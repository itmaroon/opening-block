<?php
/**
 * Plugin Name:       Opening Block
 * Plugin URI:        https://itmaroon.net
 * Description:       Webサイトのオープニングに使用するブロックです
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            WebクリエイターITmaroon
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       opening-block
 *
 * @package           itmar
 */

//composerによるリモートリポジトリからの読み込みを要求
require_once __DIR__ . '/vendor/autoload.php';

$block_entry = new \Itmar\BlockClassPakage\ItmarEntryClass();

//ブロックの初期登録
add_action( 'init', function() use ($block_entry ) {
  $text_domain = 'opening-block'; // ここで引数を設定
  $block_entry->block_init($text_domain, __FILE__);
});

//プラグインの読み込み
function itmar_opening_block_add_plugin() {
  //JavaScript ファイルの読み込み（エンキュー）
	wp_enqueue_script( 
		'vivus','https://cdnjs.cloudflare.com/ajax/libs/vivus/0.4.4/vivus.min.js', 
		array(), 
		'0.4.4',
		true
	);
	//cookieライブラリの読込
	wp_enqueue_script( 
		'js-cookie','https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js', 
		array(), 
		null,
		true
	);
	//自作スクリプトの読み込み
	if(!is_admin()){//フロントエンドでのみ読み込む
		$script_path = plugin_dir_path(__FILE__) . 'assets/opening.js';
		wp_enqueue_script( 
			'itmar-script-handle', 
			plugins_url( '/assets/opening.js', __FILE__ ), 
			array('jquery'), 
			filemtime($script_path),
			true
		);
	}
	


	//ブロックの２重登録の監視
	if (is_admin() && !wp_doing_ajax()) {//管理画面でのみ読み込む）
		wp_enqueue_script(
			'itmar-check-script',
			plugins_url( 'build/check-blocks.js?'.date('YmdHis'), __FILE__ ),
			array( 'wp-blocks', 'wp-element', 'wp-data', 'wp-hooks' ),
			true
		);
	}
	
	
}
add_action('enqueue_block_assets', 'itmar_opening_block_add_plugin');


