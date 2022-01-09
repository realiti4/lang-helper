import * as vscode from 'vscode';
import { subscribeToDocumentChanges, EMOJI_MENTION } from './diagnostics';

const COMMAND = 'code-actions-sample.command';
import util = require('util');


import { NodeDependenciesProvider } from './nodeDependencies';



export function activate(context: vscode.ExtensionContext): void {
	
	console.log('Congratulations, your extension "lang-helper" is now active!');

	// load existing extension test
	let allExts = vscode.extensions.all;
	let phpExt = vscode.extensions.getExtension('vscode.php');
	// let importedApi = phpExt.exports;
	console.log('karakara');
	
	
	// Tree view - Dev
	const nodeDependenciesProvider = new NodeDependenciesProvider(vscode.workspace.rootPath);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () =>
		nodeDependenciesProvider.refresh()
	);

	// vscode.window.registerTreeDataProvider(
	// 	'nodeDependencies',
	// 	new NodeDependenciesProvider(vscode.workspace.rootPath)
	// );
	// vscode.window.createTreeView('nodeDependencies', {
	// 	treeDataProvider: new NodeDependenciesProvider(vscode.workspace.rootPath)
	// });

	
	
	// change selected text
	const disposable = vscode.commands.registerCommand('lang-helper.makeLang', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const word = document.getText(selection);
			const reversed = word.split('').reverse().join('');

			// Dev - make this better
			var new_word = word.toLowerCase();
			// remove turkish characters
			var new_word = new_word.replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u');
			// replace multiple white space with one
			var new_word = new_word.replace(/\s{2,}/g, ' ');
			var new_word = new_word.replace(/ /g,'.');

			// var final_word = "<?=lang('${new_word}')?>";
			var group = 'general.';
			var new_word = group + new_word;
			var final_word = "<?=lang('" + new_word + "')?>";
			var final_word_in_php = "lang('" + new_word + "')";

			// copy to clipboard
			// require('child_process').spawn('clip').stdin.end(util.inspect(word));
			var lang_output = '$lang["' + new_word + '"] = "' + word +'";';
			require('child_process').spawn('clip').stdin.end(lang_output);	// fix utf-8


			editor.edit(editBuilder => {
				editBuilder.replace(selection, final_word);
			});
		}
	});

	context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
export function deactivate() {}
