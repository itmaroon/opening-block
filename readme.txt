=== Opening Block ===
Contributors:      itmaroon
Tags:              block, Gutenberg, custom, Opening, Animation
Requires at least: 6.3
Tested up to:      6.5.2
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires PHP: 8.1.22

This is a block that provides the function to produce the opening animation of a website.

== Related Links ==

* [Github](https://github.com/itmaroon/opening-block)
* [source code](https://github.com/itmaroon/opening-block/tree/master/src)
* [block-class-package:GitHub](https://github.com/itmaroon/block-class-package)  
* [block-class-package:Packagist](https://packagist.org/packages/itmar/block-class-package) 
* [itmar-block-packages:npm](https://www.npmjs.com/package/itmar-block-packages)  
* [itmar-block-packages:GitHub](https://github.com/itmaroon/itmar-block-packages)


== Description ==

- This is a block that displays an opening animation when a website opens. There are three types of animations, divided into three blocks, and you can select your favorite animation.
- All blocks have a feature that allows viewers to choose not to display animations again. However, to use this feature, the [BLOCK COLLECTIONS plugin](https://ja.wordpress.org/plugins/block-collections/) must be installed and enabled.

If you download the zip file and install the plugin from the Wordpress management screen, it will function as a plugin.

When you install this plugin, the following three blocks will be registered, and you can use them in the block editor or site editor (confirmed to work with WordPress 6.4.3).

Below is an overview of the functions of each block.
1. Logo Anime
Converts a string to an SVG file and creates an animation that traces its surroundings. The string can be set freely. There are two fonts to choose from: EduVICWANTBeginner and Roboto.
2.Tea Time
Produces an animation that plays the set character string as a caption. The string can be set freely. The caption rises like steam from the cup and disappears. The length of this animation is adjustable.
3.Welcome
We will create an animation in which a pen draws the word "Welcome". In this version, the string is fixed to "Welcome".

You can select the ending animation from the following five options.
1. Vertical slide
2. Horizontal slide
3. Vertical opening
4. Lateral opening
5. Circular expansion
The opening animation will be created by combining these animations with the animations of each block.
Please see the screenshot to see what the specific animation looks like.

In each block, there is a checkbox located at the bottom right of the screen that allows the viewer to choose not to display the animation next time. This checkbox is always displayed while the animation is running, but it disappears after the animation ends and appears when the user moves the mouse cursor to the bottom right of the screen.

== Installation ==

1. From the WP admin panel, click “Plugins” -> “Add new”.
2. In the browser input box, type “Opening Block”.
3. Select the “Opening Block” plugin and click “Install”.
4. Activate the plugin.

OR…

1. Download the plugin from this page.
2. Save the .zip file to a location on your computer.
3. Open the WP admin panel, and click “Plugins” -> “Add new”.
4. Click “upload”.. then browse to the .zip file downloaded from this page.
5. Click “Install”.. and then “Activate plugin”.


== Frequently Asked Questions ==


== Screenshots ==

1. Draw the logo and the ending will slide horizontally. 
2. An animation where the letters rise like steam from a teacup, and the ending slides vertically.
3. The ending is an animation in which the pen draws letters, and the circle expands to change the screen.
4. The ending opens vertically with an animation that draws the logo.
5. The ending opens horizontally with an animation that draws the logo.
6. A block icon registered by the plugin. Divided into design group.

== Changelog ==

= 1.0.0 =
* Release

== Arbitrary section ==

1. Logo Anime Block uses a plugin called opentype.js to generate the path of the svg file from the font type. The source code and terms of use are posted [here](https://www.npmjs.com/package/opentype.js).
2. All blocks has a switch function that prevents the opening animation from being displayed, but for this to work the [BLOCK COLLECTIONS plugin](https://ja.wordpress.org/plugins/block-collections/) must be installed and enabled.
3. The blocks provided by this plugin can be placed one block per web page. Even if you try to place multiple blocks, an error message will appear and you will not be able to place them.
However, it is possible to place it on web pages other than the top page, so multiple blocks can be placed on the entire website.
4. PHP class management is now done using Composer.  
[GitHub](https://github.com/itmaroon/block-class-package)  
[Packagist](https://packagist.org/packages/itmar/block-class-package) 
5. I decided to make functions and components common to other plugins into npm packages, and install and use them from npm.  
[npm](https://www.npmjs.com/package/itmar-block-packages)  
[GitHub](https://github.com/itmaroon/itmar-block-packages)