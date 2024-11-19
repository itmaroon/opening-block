// webpack.config.js in your project root
const path = require("path");
const fs = require("fs");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");

//プロジェクト内フォルダのファイル一覧プラグイン
class FileListPlugin {
	apply(compiler) {
		compiler.hooks.emit.tapAsync("FileListPlugin", (compilation, callback) => {
			const directoryPath = path.join(__dirname, "/assets/fonts");
			fs.readdir(directoryPath, (err, files) => {
				if (err) {
					return callback(err);
				}
				const fileList = JSON.stringify(files);
				compilation.assets["fileList.json"] = {
					source: function () {
						return fileList;
					},
					size: function () {
						return fileList.length;
					},
				};
				callback();
			});
		});
	}
}

//オリジナルのReactコンポーネントのトランスパイルエントリポイントの追加
const newEntryConfig = async () => {
	const originalEntry = await defaultConfig.entry();

	return {
		...originalEntry,
		"check-blocks": path.resolve(__dirname, "./src/check-blocks.js"),
	};
};

module.exports = async () => {
	defaultConfig.entry = await newEntryConfig();
	defaultConfig.plugins.push(new FileListPlugin());
	return defaultConfig;
};
