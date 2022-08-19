const path = require('path');
const vscode = require('vscode');
const { copyExampleIfNecessary } = require('./copying');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  copyExampleIfNecessary(context.globalStorageUri, 'global');
  registerEditScripts(context, context.globalStorageUri, 'global');

  try {
    registerRunScripts(context);
    registerCustomCommands(context, context.globalStorageUri);
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage(
      'run-javascript: Unable to load global custom scripts. See console for details.'
    );
  }

  if (context.storageUri) {
    copyExampleIfNecessary(context.storageUri, 'workspace');
    try {
      registerEditScripts(context, context.storageUri, 'workspace');
      registerCustomCommands(context, context.storageUri);
    } catch (error) {
      console.error(error);
      vscode.window.showErrorMessage(
        'run-javascript: Unable to load workspace custom scripts. See console for details.'
      );
    }
  }
}

/**
 * @param {vscode.ExtensionContext} context
 * @param {vscode.Uri} uri
 */
function registerRunScripts(context) {
  // Register the "run-script" command that can be accessed from the command palette
  console.log('Registering command', 'run-javascript.run-script');
  const globalCommands = require(path.join(
    context.globalStorageUri.fsPath,
    'index.js'
  ));
  let workspaceCommands = {};
  if (context.storageUri) {
    workspaceCommands = require(path.join(
      context.storageUri.fsPath,
      'index.js'
    ));
  }
  const commands = Object.assign({}, globalCommands, workspaceCommands);

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

// Register the "edit-global-scripts" and "edit-workspace-scripts" command to enable editing scripts
/**
 * @param {vscode.ExtensionContext} context
 * @param {vscode.Uri} uri
 * @param {'workspace' | 'global'} workspaceOrGlobal
 */
function registerEditScripts(context, uri, workspaceOrGlobal) {
  const commandName = `run-javascript.edit-${workspaceOrGlobal}-scripts`;
  console.log('Registering command', commandName);
  const disposable = vscode.commands.registerCommand(commandName, async () => {
    vscode.workspace.updateWorkspaceFolders(0, 0, {
      uri: uri,
    });

    await focusIndex(uri);
  });
  context.subscriptions.push(disposable);
}

// Register commands for all of the methods in the commands directory
async function registerCustomCommands(context, uri) {
  console.log('Registering custom commands for "run-javascript"');
  const commands = require(path.join(uri.fsPath, 'index.js'));
  const allCommands = new Set(await vscode.commands.getCommands());
  Object.entries(commands).forEach(([functionName, commandFunction]) => {
    const commandName = `run-javascript.${functionName}`;
    if (!allCommands.has(commandName)) {
      console.log('Registering commands', commandName);
      const disposable = vscode.commands.registerCommand(
        commandName,
        (...args) => commandFunction(vscode, context, ...args)
      );
      context.subscriptions.push(disposable);
    }
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
