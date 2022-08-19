const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function copyWorkspaceExampleIfNecessary(context) {
  console.log('context.storageUri', context.storageUri);
  const indexPath = path.join(context.storageUri.fsPath, 'index.js');
  const helloWorldDstPath = path.join(
    context.storageUri.fsPath,
    'workspaceHelloWorld.js'
  );
  if (fs.existsSync(indexPath)) {
    return;
  }

  mkdirIfNotExists(context.storageUri.fsPath);

  const exampleIndex = path.join(__dirname, '../examples/workspace/index.js');
  const exampleHelloWorld = path.join(
    __dirname,
    '../examples/workspace/workspaceHelloWorld.js'
  );
  fs.copyFileSync(exampleIndex, indexPath);
  fs.copyFileSync(exampleHelloWorld, helloWorldDstPath);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function copyGlobalExampleIfNecessary(context) {
  const indexPath = path.join(context.globalStorageUri.fsPath, 'index.js');
  const helloWorldDstPath = path.join(
    context.globalStorageUri.fsPath,
    'workspaceHelloWorld.js'
  );
  if (fs.existsSync(indexPath)) {
    return;
  }

  mkdirIfNotExists(context.globalStorageUri.fsPath);

  const exampleIndex = path.join(__dirname, '../examples/global/index.js');
  const exampleHelloWorld = path.join(
    __dirname,
    '../examples/global/globalHelloWorld.js'
  );
  fs.copyFileSync(exampleIndex, indexPath);
  fs.copyFileSync(exampleIndex, helloWorldDstPath);
}

function mkdirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

module.exports = {
  copyWorkspaceExampleIfNecessary,
  copyGlobalExampleIfNecessary,
};
