import * as vscode from 'vscode';
import { subscribeToDocumentChanges, EMOJI_MENTION } from './diagnostics';

const COMMAND = 'code-actions-sample.command';
const util = require('util');


// test2
const tokenTypes = ['class', 'interface', 'enum', 'function', 'variable'];
const tokenModifiers = ['declaration', 'documentation'];
const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

const provider: vscode.DocumentSemanticTokensProvider = {
	provideDocumentSemanticTokens(
		document: vscode.TextDocument
	): vscode.ProviderResult<vscode.SemanticTokens> {
		// analyze the document and return semantic tokens

		const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
		// on line 1, characters 1-5 are a class declaration
		tokensBuilder.push(
			new vscode.Range(new vscode.Position(1, 1), new vscode.Position(1, 5)),
			'class',
			['declaration']
		);
		return tokensBuilder.build();
	}
};

export function activate(context: vscode.ExtensionContext): void {
	
	console.log('Congratulations, your extension "lang-helper" is now active!');

	let allExts = vscode.extensions.all;
	let phpExt = vscode.extensions.getExtension('vscode.php');
	// let importedApi = phpExt.exports;
	console.log('karakara');

	// another test
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		const text = editor.document.getText();
		let selection = editor.selection;
		var text_sample = editor.document.getText(selection);
	}	

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

			// Dev
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
			require('child_process').spawn('clip').stdin.end(lang_output);


			editor.edit(editBuilder => {
				editBuilder.replace(selection, final_word);
			});
		}
	});

	context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
export function deactivate() {}
