/**
 * Simple hello world defined in a workspace context
 * @param {vscode} vscode
 * @param {vscode.ExtensionContext} context
 * @param {any[]} args
 */
function workspaceHelloWorld(vscode, context, ...args) {
  vscode.window.showInformationMessage(
    'Hello World from run-javascript in this workspace'
  );
}

module.exports = workspaceHelloWorld;
