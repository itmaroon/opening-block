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


function itmar_opening_block_block_init() {
	foreach (glob(plugin_dir_path(__FILE__) . 'build/blocks/*') as $block) {
		// Static block
		register_block_type($block);
	}
}
add_action( 'init', 'itmar_opening_block_block_init' );

//プラグインの読み込み
function itmar_opening_block_add_plugin() {
  $dir = dirname( __FILE__ );
  //JavaScript ファイルの読み込み（エンキュー）
	wp_enqueue_script( 
		'vivus','https://cdnjs.cloudflare.com/ajax/libs/vivus/0.4.4/vivus.min.js', 
		array(), 
		'0.4.4',
		true
	);
	wp_enqueue_script( 
		'itmar-script-handle', 
		plugins_url( '/assets/opening.js?'.date('YmdHis'), __FILE__ ), 
		array('jquery'), 
		'1.0.0',
		true
	);

	
	//urlパスの引き渡し
  $plugin_url = plugins_url("",__FILE__);
	wp_localize_script( 'itmar-script-handle', 'plugin', array(
			'plugin_url' => $plugin_url
	));
}
add_action('enqueue_block_assets', 'itmar_opening_block_add_plugin');


