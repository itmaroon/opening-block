<?php

/**
 * Plugin Name:       Opening Block
 * Plugin URI:        https://itmaroon.net
 * Description:       This is a block that displays the opening animation.
 * Requires at least: 6.4
 * Requires PHP:      8.1.22
 * Version:           1.1.0
 * Author:            Web Creator ITmaroon
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       opening-block
 * Domain Path:       /languages
 * 
 * @package           itmar
 */

if (!defined('ABSPATH')) exit;

// プラグイン情報取得に必要なファイルを読み込む
if (!function_exists('get_plugin_data')) {
	require_once(ABSPATH . 'wp-admin/includes/plugin.php');
}

//composerによるリモートリポジトリからの読み込みを要求
require_once __DIR__ . '/vendor/itmar/loader-package/src/register_autoloader.php';

$block_entry = new \Itmar\BlockClassPackage\ItmarEntryClass();

//ブロックの初期登録
add_action('init', function () use ($block_entry) {
	$text_domain = 'opening-block'; // ここで引数を設定
	$block_entry->block_init($text_domain, __FILE__);
});

function itmar_opening_block_textdomain()
{
	load_plugin_textdomain('opening-block', false, basename(dirname(__FILE__)) . '/languages');
}
add_action('init', 'itmar_opening_block_textdomain');

//プラグインの読み込み
function itmar_opening_block_add_plugin()
{
	//自作スクリプトの読み込み
	if (!is_admin()) { //フロントエンドでのみ読み込む
		$script_path = plugin_dir_path(__FILE__) . 'assets/opening.js';
		wp_enqueue_script(
			'opening-js-handle',
			plugins_url('\assets\opening.js', __FILE__),
			array('jquery'),
			filemtime($script_path),
			true
		);
	}

	//ブロックの２重登録の監視
	if (is_admin() && !wp_doing_ajax()) { //管理画面でのみ読み込む）
		$script_path = plugin_dir_path(__FILE__) . 'build/check-blocks.js';
		wp_enqueue_script(
			'itmar-check-script',
			plugins_url('build/check-blocks.js', __FILE__),
			array('wp-blocks', 'wp-element', 'wp-data', 'wp-hooks', 'wp-block-editor'),
			filemtime($script_path),
			true
		);
	}
	// ２重登録監視スクリプトの翻訳をセット
	wp_set_script_translations('itmar-check-script', 'opening-block', plugin_dir_path(__FILE__) . 'languages');
}
add_action('enqueue_block_assets', 'itmar_opening_block_add_plugin');

//ブロックが有効化されているかどうかの判定を行うカスタムエンドポイントを登録
add_action('rest_api_init', function () {
	register_rest_route('itmar-rest-api/v1', '/is-block-registered/', array(
		'methods' => 'GET',
		'callback' => 'itmar_block_registered',
		'permission_callback' => '__return_true', // これにより、すべてのユーザーがエンドポイントにアクセスできます。
	));
});

function itmar_block_registered($request)
{
	$block_name = $request->get_param('block_name');
	if (WP_Block_Type_Registry::get_instance()->is_registered($block_name)) {
		return new WP_REST_Response(array('registered' => true), 200);
	} else {
		return new WP_REST_Response(array('registered' => false), 200);
	}
}
