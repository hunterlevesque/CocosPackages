'use strict';
const fs = require('fs');
const path = require('path');
var deletedDirs = [];
function traverseDirectory(directory) {
  // 获取目录中的所有文件和文件夹
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      Editor.log(`无法读取目录: ${directory}`);
      return;
    }
1
    // 检查是否为空目录 或者 只有.DS_Store文件
    if (files.length === 0 || (files.length === 1 && files[0].name === ".DS_Store")) {
      var delete_dir = 'db://assets/' + path.relative(Editor.Project.path + "/assets", directory);
      if (deletedDirs.indexOf(delete_dir) == -1) {
        Editor.log(`删除文件夹: ${directory}`);
        deletedDirs.push(delete_dir);
        Editor.assetdb.delete([delete_dir], function (err, results) {
          traverseDirectory(path.dirname(directory)); // 递归删除父目录
        });
      }
    } else {
      // 遍历每个文件或文件夹
      files.forEach(file => {
        const fullPath = path.join(directory, file.name);
        if (file.isDirectory()) {
          // 如果是文件夹，则递归进入
          traverseDirectory(fullPath);
        }
      });
    }
  });

}

module.exports = {
  load() {
    // execute when package loaded
  },

  unload() {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'run'() {
      Editor.log('删除空文件夹');
      // 执行删除空文件夹操作
      traverseDirectory(Editor.Project.path + "/assets");
    }
  },
};