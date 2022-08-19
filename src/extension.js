const path = require('path');
const vscode = require('vscode');
const commands = require('/Users/elliot/.vscode-run-javascript/index.js');
const { copyExampleIfNecessary } = require('./copying');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  copyExampleIfNecessary(context.globalStorageUri, 'global');
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
      vscode.workspace.updateWorkspaceFolders(0, 0, {
        uri: context.globalStorageUri,
      });

      await focusIndex(context.globalStorageUri);
    }
  );
  context.subscriptions.push(globalDisposable);

  const localCommand = 'run-javascript.edit-local-scripts';
  console.log('Registering command', localCommand);
  const localDisposable = vscode.commands.registerCommand(
    localCommand,
    async () => {
      copyExampleIfNecessary(context.storageUri, 'workspace');
      await vscode.workspace.updateWorkspaceFolders(0, 0, {
        uri: context.storageUri,
      });
      await focusIndex(context.storageUri);
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

async function focusIndex(uri) {
  const doc = await vscode.workspace.openTextDocument(
    vscode.Uri.file(path.join(uri.fsPath, 'index.js'))
  );
  await vscode.window.showTextDocument(doc);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
