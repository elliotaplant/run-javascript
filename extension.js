const vscode = require('vscode');
const commands = require('/Users/elliot/.vscode-run-javascript/index.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Registering commands for "run-javascript"');

  // Register commands for all of the methods in the commands directory
  Object.entries(commands).forEach(([functionName, commandFunction]) => {
    const commandName = `run-javascript.${functionName}`;
    console.log('Registering command', commandName);
    const disposable = vscode.commands.registerCommand(commandName, (...args) =>
      commandFunction(vscode, context, ...args)
    );
    context.subscriptions.push(disposable);
  });

  // Register the "run-script" command that can be accessed from the command palette
  console.log('Registering command', 'run-javascript.run-script');
  const disposable = vscode.commands.registerCommand(
    'run-javascript.run-script',
    () => {
      const quickPick = vscode.window.createQuickPick();
      quickPick.items = Object.keys(commands).map((label) => ({ label }));
      quickPick.onDidChangeSelection((selection) => {
        if (selection[0]) {
          commands[selection[0].label](vscode, context)
            .catch(console.error)
            .finally(() => quickPick.dispose());
        }
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.onDidAccept(() => quickPick.dispose());
      quickPick.show();
    }
  );
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
