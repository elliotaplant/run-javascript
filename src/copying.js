const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.Uri} uri
 * @param {'workspace' | 'global'} workspaceOrGlobal
 */
function copyExampleIfNecessary(uri, workspaceOrGlobal) {
  const helloWorldFile = `${workspaceOrGlobal}HelloWorld.js`;
  const indexPath = path.join(uri.fsPath, 'index.js');
  const helloWorldDstPath = path.join(uri.fsPath, helloWorldFile);

  if (fs.existsSync(indexPath)) {
    return;
  }

  mkdirIfNotExists(uri.fsPath);

  const exampleIndex = path.join(
    __dirname,
    `../examples/${workspaceOrGlobal}/index.js`
  );
  const exampleHelloWorld = path.join(
    __dirname,
    `../examples/${workspaceOrGlobal}/${helloWorldFile}`
  );
  fs.copyFileSync(exampleIndex, indexPath);
  fs.copyFileSync(exampleHelloWorld, helloWorldDstPath);
}

function mkdirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

module.exports = {
  copyExampleIfNecessary,
};
