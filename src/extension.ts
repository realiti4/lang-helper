import * as vscode from 'vscode';
import { subscribeToDocumentChanges, EMOJI_MENTION } from './diagnostics';

const COMMAND = 'code-actions-sample.command';
import util = require('util');


import { NodeDependenciesProvider } from './nodeDependencies';
import { processText } from './process';
// import clipboard from 'clipboardy';
var ncp = require("copy-paste");


export function activate(context: vscode.ExtensionContext): void {
	
	// load existing extension test
	let allExts = vscode.extensions.all;
	let phpExt = vscode.extensions.getExtension('vscode.php');
	// let importedApi = phpExt.exports;
	// console.log('karakara');
	
	
	// Tree view - Dev
	const nodeDependenciesProvider = new NodeDependenciesProvider(context);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () =>
		nodeDependenciesProvider.refresh()
	);
	vscode.commands.registerCommand('nodeDependencies.clean', () =>
		nodeDependenciesProvider.clean()
	);
	vscode.commands.registerCommand('nodeDependencies.copy', () =>
		nodeDependenciesProvider.copy()
	);

	
	// change selected text
	const disposable = vscode.commands.registerCommand('lang-helper.makeLang', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const word = document.getText(selection);

			// const output = processText(word);
			const output = processText(word, true, 7);

			// save it to global state			
			context.globalState.update(output['lang_key'], output['lang_output']);

			// Let's refresh menu here
			nodeDependenciesProvider.refresh();


			editor.edit(editBuilder => {
				editBuilder.replace(selection, output['final_word']);
			});
		}
	});

	context.subscriptions.push(disposable);

}

// // this method is called when your extension is deactivated
// export function deactivate() {}
