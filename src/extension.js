const fs = require('fs');
const vscode = require('vscode');
const commands = require('/Users/elliot/.vscode-run-javascript/index.js');
const {
  copyWorkspaceExampleIfNecessary,
  copyGlobalExampleIfNecessary,
} = require('./copying');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  copyGlobalExampleIfNecessary(context);
  registerRunScripts(context);
  registerEditScripts(context);
  registerCustomCommands(context);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function registerRunScripts(context) {
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

// Register the "edit-global-scripts" and "edit-local-scripts" command to enable editing scripts
/**
 * @param {vscode.ExtensionContext} context
 */
function registerEditScripts(context) {
  const globalCommand = 'run-javascript.edit-global-scripts';
  console.log('Registering command', globalCommand);
  const globalDisposable = vscode.commands.registerCommand(
    globalCommand,
    async () => {
      fs.writeFileSync(
        context.globalStorageUri.fsPath + '/index.js',
        'console.log("hello world");'
      );
      await vscode.workspace.updateWorkspaceFolders(0, 0, {
        uri: context.globalStorageUri,
      });
    }
  );
  context.subscriptions.push(globalDisposable);

  const localCommand = 'run-javascript.edit-local-scripts';
  console.log('Registering command', localCommand);
  const localDisposable = vscode.commands.registerCommand(
    localCommand,
    async () => {
      copyWorkspaceExampleIfNecessary(context);
      await vscode.workspace.updateWorkspaceFolders(0, 0, {
        uri: context.storageUri,
      });
    }
  );
  context.subscriptions.push(localDisposable);
}

// Register commands for all of the methods in the commands directory
function registerCustomCommands(context) {
  console.log('Registering custom commands for "run-javascript"');
  Object.entries(commands).forEach(([functionName, commandFunction]) => {
    const commandName = `run-javascript.${functionName}`;
    console.log('Registering command', commandName);
    const disposable = vscode.commands.registerCommand(commandName, (...args) =>
      commandFunction(vscode, context, ...args)
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
