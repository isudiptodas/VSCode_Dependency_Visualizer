import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { scanDependencies } from "./DependencyScanner";

export function activate(context: vscode.ExtensionContext) {

  const command = vscode.commands.registerCommand(
    "dependencyChart.explainDependency",
    () => {

      const folders = vscode.workspace.workspaceFolders;

      if (!folders) {
        vscode.window.showErrorMessage(
          "Please open a project folder first."
        );
        return;
      }

      const rootPath = folders[0].uri.fsPath;

      const dependencies = scanDependencies(rootPath);

      if (dependencies.length === 0) {
        vscode.window.showInformationMessage(
          "No dependencies found."
        );
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        "dependencyChart",
        "Dependency Chart",
        vscode.ViewColumn.One,
        {
          enableScripts: true,

          localResourceRoots: [
            vscode.Uri.file(
              path.join(context.extensionPath, "src", "webview")
            )
          ]
        }
      );

      const htmlPath = path.join(
        context.extensionPath,
        "src",
        "webview",
        "index.html"
      );

      let html = fs.readFileSync(htmlPath, "utf8");

      const styleUri = panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(
            context.extensionPath,
            "src",
            "webview",
            "styles.css"
          )
        )
      );

      const scriptUri = panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(
            context.extensionPath,
            "src",
            "webview",
            "script.js"
          )
        )
      );

      html = html.replace(
        "{{styleUri}}",
        styleUri.toString()
      );

      html = html.replace(
        "{{scriptUri}}",
        scriptUri.toString()
      );

      html = html.replace(
        '"__DEPENDENCY_DATA__"',
        JSON.stringify(dependencies)
      );

      panel.webview.html = html;
    }
  );

  context.subscriptions.push(command);
}

export function deactivate() {}