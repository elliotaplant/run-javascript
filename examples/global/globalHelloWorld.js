/**
 * Simple hello world defined in a global context
 * @param {vscode} vscode
 * @param {vscode.ExtensionContext} context
 * @param {any[]} args
 */
function globalHelloWorld(vscode, context, ...args) {
  vscode.window.showInformationMessage(
    'Hello World from run-javascript in the global context'
  );
}

module.exports = globalHelloWorld;
