# Run JavaScript

A VS Code extension to run custom JavaScript files as commands in VS Code.

## Features

Create JS files that are globally or workspace scoped that have access to the `vscode` object so the scripts can interact with your editor. To create and edit your scripts, use the commands "Run JavaScript: Edit Global Scripts" (`run-javascript.edit-global-scripts`) or "Run JavaScript: Edit Workspace Scripts" (`run-javascript.edit-workspace-scripts`). This will take you to the global/workspace config folder for this extension.

To create new scripts, simple create a JS file at the root of the global/workspace config folder and import/export that file from the `index.js` file in the config folder. Use the "hello world" commands as a guide.

To run your scripts from the command pallete, first run the command "Run Javascript: Run Script" and then select your script from the menu.

To run your scripts as a keyboard shortcut, use the command name `run-javascript:yourExportInIndexJs` in your shortcut definition. For example:

```
{
  "key": "cmd+shift+i",
  "command": "run-javascript.globalHelloWorld"
}
```

Note that the name of the command after the `.` is taken from the object exported in your `index.js` file in the global/workspace config.

You can also pass args to your function with keyboard shortcuts:

```
// keybindings.json
{
  "key": "cmd+shift+y",
  "command": "run-javascript.someFunction",
  "args": [
    "arg1",
    { "arg2Key": "arg2Value }
  ]
}

// someFunction.js
module.exports = function someFunction(vscode, context, arg1, arg2) {
  console.log(arg1);
  console.log(arg2);
}
```

## Known Issues

- This probably doesn't work in the web editor
- I can't add commands directly to the command pallete because the command name has to be hard-coded into the `package.json` of this extension.
