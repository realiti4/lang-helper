import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
var ncp = require("copy-paste");

export class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {

	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	// constructor(private workspaceRoot: string, context: vscode.ExtensionContext) {
	// 	this.context = context;
	// }

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | null | void> = new vscode.EventEmitter<Dependency | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | null | void> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	clean(): void {
		Object.entries(this.context.globalState.keys()).forEach(([i, v]) => {
			this.context.globalState.update(v, undefined);
		})
		this.refresh();
		vscode.window.showInformationMessage('Cleaned!');
	}

	copy(): void {
		var entry_keys = this.context.globalState.keys();
		var clipboard = '';

		if (entry_keys.length > 0) {
			Object.entries(entry_keys).forEach(([i, v]) => {
				clipboard += this.context.globalState.get(v);
				clipboard += '\n';
			})
			ncp.copy(clipboard);
			vscode.window.showInformationMessage('Copied!');
		} else {
			vscode.window.showInformationMessage('Nothing to copy!');
		}

	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {

		// Dev
		return Promise.resolve(this.getstateEntries());

	}


	private getstateEntries(): Dependency[] {
		// const toDep = (moduleName: string, version: string): Dependency => {
		// 	if (this.context.globalState.keys().length > 0) {
		// 		return new Dependency(
		// 			moduleName,
		// 			version,
		// 			vscode.TreeItemCollapsibleState.Collapsed
		// 		);
		// 	} else {
		// 		// vscode.window.showInformationMessage('Nothing to show');
		// 		return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
		// 	}
		// };

		const toDep = (moduleName: string, version: string): Dependency => {
			return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
		}

		const devEntries = this.context.globalState._value
			? Object.keys(this.context.globalState._value).map(dep =>
				toDep(dep, this.context.globalState._value[dep])
			)
			: [];

		return devEntries;
	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
		if (this.pathExists(packageJsonPath)) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

			// const toDep = (moduleName: string, version: string): Dependency => {
			// 	if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
			// 		return new Dependency(
			// 			moduleName,
			// 			version,
			// 			vscode.TreeItemCollapsibleState.Collapsed
			// 		);
			// 	} else {
			// 		return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
			// 	}
			// };

			const toDep = (moduleName: string, version: string): Dependency => {
				return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
			}

			const deps = packageJson.dependencies
				? Object.keys(packageJson.dependencies).map(dep =>
					toDep(dep, packageJson.dependencies[dep])
				)
				: [];
			const devDeps = packageJson.devDependencies
				? Object.keys(packageJson.devDependencies).map(dep =>
					toDep(dep, packageJson.devDependencies[dep])
				)
				: [];
			return deps.concat(devDeps);
		} else {
			return [];
		}
	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}
		return true;
	}
}

class Dependency extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}-${this.version}`;
		this.description = this.version;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};
}