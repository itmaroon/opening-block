// webpack.config.js in your project root
const path = require('path');
const fs = require('fs');

class FileListPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      const directoryPath = path.join(__dirname, '/assets/fonts');
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          return callback(err);
        }
        const fileList = JSON.stringify(files);
        compilation.assets['fileList.json'] = {
          source: function () {
            return fileList;
          },
          size: function () {
            return fileList.length;
          }
        };
        callback();
      });
    });
  }
}

module.exports = () => {
  let defaultConfig = require("@wordpress/scripts/config/webpack.config");
  defaultConfig.plugins.push(new FileListPlugin());
  return defaultConfig;
};