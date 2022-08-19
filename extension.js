const vscode = require('vscode');
const commands = require('/Users/elliot/.vscode-run-javascript/index.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Registering commands for "run-javascript"');
  Object.entries(commands).forEach(([commandName, commandFunction]) => {
    console.log('Registering command', commandName);
    const disposable = vscode.commands.registerCommand(
      `run-javascript.${commandName}`,
      () => commandFunction(vscode, context)
    );
    context.subscriptions.push(disposable);
  });
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
