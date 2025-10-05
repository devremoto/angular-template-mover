import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export async function extractTemplate(uri?: vscode.Uri) {
    const activeEditor = vscode.window.activeTextEditor;
    const targetUri = uri || activeEditor?.document.uri;
    if (!targetUri || !targetUri.fsPath.endsWith('.ts')) {
        vscode.window.showErrorMessage('Please select a TypeScript component file.');
        return;
    }
    try {
        const document = await vscode.workspace.openTextDocument(targetUri);
        const content = document.getText();
        const componentMetadata = content.match(/@Component\(\s*({[\s\S]*?})\s*\)/);
        if (!componentMetadata) {
            vscode.window.showWarningMessage('No @Component decorator found in this file.');
            return;
        }
        var withoutImports = componentMetadata[1].replace(/imports\s*:\s*\[[^\]]*\],?/g, '');
        let metadata;
        try {
            metadata = eval('(' + withoutImports + ')');
            console.log(metadata);
        } catch {
            vscode.window.showWarningMessage('Failed to parse component metadata.');
            return;
        }
        if (!metadata.template) {
            vscode.window.showWarningMessage('No inline template found in this component.');
            return;
        }
        var templateData = metadata.template;
        if (Array.isArray(templateData)) {
            templateData = templateData.join('\n');
        }
        templateData = templateData
            .replace(/\\n/g, '\n')
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .trim();
        const templateContent = templateData;
        const componentDir = path.dirname(targetUri.fsPath);
        const componentName = path.basename(targetUri.fsPath, '.ts');
        const templatePath = path.join(componentDir, `${componentName}.html`);

        await fs.promises.writeFile(templatePath, templateContent, 'utf8');

        let updatedContent = content
            .replace(templateContent, '')
            .replace(
                /template\s*:\s*['"`][^'"`]*['"`]/s,
                `templateUrl: './${componentName}.html'`
            );
        const edit = new vscode.WorkspaceEdit();
        edit.replace(targetUri, new vscode.Range(0, 0, document.lineCount, 0), updatedContent);
        await vscode.workspace.applyEdit(edit);
        vscode.window.showInformationMessage(`Template extracted to ${componentName}.html`);
    } catch (error) {
        vscode.window.showErrorMessage(`Error extracting template: ${error}`);
    }
}

export const extractStyles = async (uri?: vscode.Uri) => {
    const activeEditor = vscode.window.activeTextEditor;
    const targetUri = uri || activeEditor?.document.uri;
    const angularJsonPath = path.join(vscode.workspace.rootPath || '', 'angular.json');
    let styleExtension = 'css';

    try {
        const angularJson = JSON.parse(await fs.promises.readFile(angularJsonPath, 'utf8'));
        const project = angularJson.projects[Object.keys(angularJson.projects)[0]];
        styleExtension = project?.architect?.build?.options?.styles?.[0]?.split('.').pop() || styleExtension;
    } catch (error) {
        console.error('Error reading angular.json:', error);
    }

    if (!targetUri || !targetUri.fsPath.endsWith('.ts')) {
        vscode.window.showErrorMessage('Please select a TypeScript component file.');
        return;
    }

    try {
        const document = await vscode.workspace.openTextDocument(targetUri);
        const content = document.getText();
        const pattern = /styles\s*:\s*(\[[^\]]*\]|`[^`]*`|["'][^"']*["'])/s;
        //stylesMatch should match styles: [`....`],styles: ["..."],styles: ['...'], styles: [...],styles: `...`,styles: "...", style: '...'
        const stylesMatch = content.match(pattern);
        if (!stylesMatch) {
            vscode.window.showWarningMessage('No inline styles found in this component.');
            return;
        }
        const stylesContent = stylesMatch[1]
            .replace(/[`'"]/g, '') // Remove quotes and backticks
            .replace(/\s*\]\s*$/, '')
            .replace(/^\s*\[\s*/, '') // Remove opening bracket if present
            .replace(/\\n/g, '\n')
            .trim();

        const componentDir = path.dirname(targetUri.fsPath);
        const componentName = path.basename(targetUri.fsPath, '.ts');
        const stylesPath = path.join(componentDir, `${componentName}.${styleExtension}`);

        await fs.promises.writeFile(stylesPath, stylesContent, 'utf8');

        const updatedContent = content.replace(
            pattern,
            `styleUrls: ['./${componentName}.${styleExtension}']`
        );
        const edit = new vscode.WorkspaceEdit();
        edit.replace(targetUri, new vscode.Range(0, 0, document.lineCount, 0), updatedContent);
        await vscode.workspace.applyEdit(edit);
        vscode.window.showInformationMessage(`Styles extracted to ${componentName}.${styleExtension}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Error extracting styles: ${error}`);
    }
};

export const inlineTemplate = async (uri?: vscode.Uri) => {
    const activeEditor = vscode.window.activeTextEditor;
    const targetUri = uri || activeEditor?.document.uri;

    if (!targetUri || !targetUri.fsPath.endsWith('.ts')) {
        vscode.window.showErrorMessage('Please select a TypeScript component file.');
        return;
    }

    try {
        const document = await vscode.workspace.openTextDocument(targetUri);
        const content = document.getText();

        const templateUrlMatch = content.match(/templateUrl\s*:\s*[`'"]([^`'"]+)[`'"]/);
        if (!templateUrlMatch) {
            vscode.window.showWarningMessage('No templateUrl found in this component.');
            return;
        }
        const templateUrlPath = templateUrlMatch[1];
        const componentDir = path.dirname(targetUri.fsPath);
        const templatePath = path.resolve(componentDir, templateUrlPath);
        if (!fs.existsSync(templatePath)) {
            vscode.window.showErrorMessage(`Template file not found: ${templatePath}`);
            return;
        }

        const templateContent = await fs.promises.readFile(templatePath, 'utf8');

        const updatedContent = content.replace(
            /templateUrl\s*:\s*[`'"]([^`'"]+)[`'"]/,
            `template: \`${templateContent.replace(/`/g, '\\`')}\``
        );
        const edit = new vscode.WorkspaceEdit();
        edit.replace(targetUri, new vscode.Range(0, 0, document.lineCount, 0), updatedContent);
        await vscode.workspace.applyEdit(edit);
        const deleteFile = await vscode.window.showInformationMessage(
            'Template inlined successfully. Do you want to delete the template file?',
            'Yes', 'No'
        );
        if (deleteFile === 'Yes') {
            await fs.promises.unlink(templatePath);
            vscode.window.showInformationMessage('Template inlined and file deleted.');
        } else {
            vscode.window.showInformationMessage('Template inlined successfully.');
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error inlining template: ${error}`);
    }
};

export const inlineStyles = async (uri?: vscode.Uri) => {
    const activeEditor = vscode.window.activeTextEditor;
    const targetUri = uri || activeEditor?.document.uri;

    if (!targetUri || !targetUri.fsPath.endsWith('.ts')) {
        vscode.window.showErrorMessage('Please select a TypeScript component file.');
        return;
    }

    try {
        const document = await vscode.workspace.openTextDocument(targetUri);

        await generateStyle(document);
    } catch (error) {
        vscode.window.showErrorMessage(`Error inlining styles: ${error}`);
    }
};

export const inlineTemplateFromHtml = async (uri?: vscode.Uri) => {
    const targetUri = uri;

    if (!targetUri || !targetUri.fsPath.endsWith('.html')) {
        vscode.window.showErrorMessage('Please select an HTML template file.');
        return;
    }

    try {
        const templatePath = targetUri.fsPath;
        const componentDir = path.dirname(templatePath);
        const templateFileName = path.basename(templatePath, '.html');
        const componentPath = path.join(componentDir, `${templateFileName}.ts`);

        if (!fs.existsSync(componentPath)) {
            vscode.window.showErrorMessage(`Component file not found: ${componentPath}`);
            return;
        }

        await inlineTemplate(vscode.Uri.file(componentPath.replace('.html', '.ts')));
    } catch (error) {
        vscode.window.showErrorMessage(`Error inlining template: ${error}`);
    }
};


export const inlineStylesFromCss = async (uri?: vscode.Uri) => {
    const targetUri = uri;


    if (!targetUri) {
        vscode.window.showErrorMessage('Please select a CSS/SCSS/SASS/LESS file.');
        return;
    }

    const styleExtensions = ['.css', '.scss', '.sass', '.less'];
    const fileExtension = path.extname(targetUri.fsPath);

    if (!styleExtensions.includes(fileExtension)) {
        vscode.window.showErrorMessage('Please select a CSS, SCSS, SASS, or LESS file.');
        return;
    }
    var uri2 = vscode.Uri.file(targetUri.fsPath.replace(fileExtension, '.ts'));
    await inlineStyles(uri2);

};

async function generateStyle(document: vscode.TextDocument) {
    const content = document.getText();
    // should also match styleUrl: `...`, styleUrl: '...', styleUrl: "..."
    // should also match styleUrls: [`...`], styleUrls: ['...'], styleUrls: ["..."]

    const pattern = /styleUrl[s]?\s*:\s*(\[[^\]]*\]|`[^`]*`|["'][^"']*["'])/s;
    //styleUrlsMatch should match styleUrls: ['...'], styleUrls: ["..."], styleUrls: [`...`]
    const styleUrlsMatch = content.match(pattern);

    if (!styleUrlsMatch) {
        vscode.window.showWarningMessage('No styleUrls found in this component.');
        return;
    }

    const styleUrlsContent = styleUrlsMatch[1];
    const styleUrls = styleUrlsContent.match(/[`'"]([^`'"]+)[`'"]/g);
    if (!styleUrls || styleUrls.length === 0) {
        vscode.window.showWarningMessage('No valid style URLs found.');
        return;
    }

    const componentDir = path.dirname(document.uri.fsPath);
    let combinedStyles = [];
    const filesToDelete: string[] = [];
    for (const styleUrl of styleUrls) {
        const cleanUrl = styleUrl.replace(/[`'"]/g, '');
        const stylePath = path.resolve(componentDir, cleanUrl);

        if (fs.existsSync(stylePath)) {
            const styleContent = await fs.promises.readFile(stylePath, 'utf8');
            combinedStyles.push(styleContent);
            filesToDelete.push(stylePath);
        }
    }

    if (!combinedStyles.length) {
        vscode.window.showWarningMessage('No style files found or they are empty.');
        return;
    }
    let updatedContent = content;
    if (combinedStyles.length > 1) {
        console.log(combinedStyles);
        updatedContent = content.replace(
            pattern,
            `styles: [ \`${combinedStyles.join('`,\n`')}\` ]`
        );
    }
    if (combinedStyles.length === 1) {
        console.log(combinedStyles);
        updatedContent = content.replace(
            pattern,
            `styles: \`\n${combinedStyles[0]}\n\``
        );
    }
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), updatedContent);
    await vscode.workspace.applyEdit(edit);
    const deleteFiles = await vscode.window.showInformationMessage(
        'Styles inlined successfully. Do you want to delete the style files?',
        'Yes', 'No'
    );
    if (deleteFiles === 'Yes') {
        for (const filePath of filesToDelete) {
            await fs.promises.unlink(filePath);
        }
        vscode.window.showInformationMessage('Styles inlined and files deleted.');
    } else {
        vscode.window.showInformationMessage('Styles inlined successfully.');
    }
}
