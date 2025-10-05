// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { extractTemplate, extractStyles, inlineTemplate, inlineStyles, inlineTemplateFromHtml, inlineStylesFromCss } from './mover';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Angular Template Mover extension is now active!');

	// Register all commands
	const extractTemplateDisposable = vscode.commands.registerCommand('angular-template-mover.extractTemplate', extractTemplate);
	const extractStylesDisposable = vscode.commands.registerCommand('angular-template-mover.extractStyles', extractStyles);
	const inlineTemplateDisposable = vscode.commands.registerCommand('angular-template-mover.inlineTemplate', inlineTemplate);
	const inlineStylesDisposable = vscode.commands.registerCommand('angular-template-mover.inlineStyles', inlineStyles);
	const inlineTemplateFromHtmlDisposable = vscode.commands.registerCommand('angular-template-mover.inlineTemplateFromHtml', inlineTemplateFromHtml);
	const inlineStylesFromCssDisposable = vscode.commands.registerCommand('angular-template-mover.inlineStylesFromCss', inlineStylesFromCss);

	context.subscriptions.push(
		extractTemplateDisposable,
		extractStylesDisposable,
		inlineTemplateDisposable,
		inlineStylesDisposable,
		inlineTemplateFromHtmlDisposable,
		inlineStylesFromCssDisposable
	);
}



// This method is called when your extension is deactivated
export function deactivate() { }
