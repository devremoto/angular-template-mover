# Angular Template Mover

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/AdilsondeAlmeidaPedro.angular-template-mover?style=flat-square)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/AdilsondeAlmeidaPedro.angular-template-mover?style=flat-square)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/AdilsondeAlmeidaPedro.angular-template-mover?style=flat-square)

A powerful VS Code extension that streamlines Angular component development by providing seamless functionality to move templates and styles between inline and external files. Whether you're refactoring existing components or organizing your codebase, Angular Template Mover makes it effortless to switch between different template and style patterns.

## ✨ Features

Angular Template Mover provides six comprehensive commands for Angular component management, all conveniently grouped under the "Angular Template Mover" submenu:

### 🔧 Component File Operations (.ts)

| Command | Description | Input | Output |
|---------|-------------|--------|--------|
| **Extract Template to File** | Extracts inline templates to separate HTML files | `template: '...'` | `templateUrl: './component.html'` |
| **Extract Styles to File** | Extracts inline styles to separate style files | `styles: ['...']` | `styleUrls: ['./component.css']` |
| **Inline Template from File** | Moves external templates back to inline | `templateUrl: './component.html'` | `template: '...'` |
| **Inline Styles from File** | Moves external styles back to inline | `styleUrls: ['./component.css']` | `styles: ['...']` |

### 📄 Template File Operations (.html, .htm)

| Command | Description | Action |
|---------|-------------|--------|
| **Move to Inline Template** | Converts external HTML template to inline | Automatically finds the corresponding component and inlines the template |

### 🎨 Style File Operations (.css, .scss, .sass, .less)

| Command | Description | Action |
|---------|-------------|--------|
| **Move to Inline Styles** | Converts external style files to inline | Automatically finds the corresponding component and inlines all referenced styles |

## 🚀 Quick Start

1. **Install the extension** from the VS Code Marketplace
2. **Open your Angular project** in VS Code
3. **Access the extension** using one of three methods:
   - **Right-click** on files in Explorer → "Angular Template Mover"
   - **Right-click** in editor → "Angular Template Mover"
   - **Command Palette** (Ctrl+Shift+P) → Type "Angular Template Mover"
4. **Choose your desired action** from the available commands
5. **Follow the prompts** for file operations and optional deletions

## 📖 Usage Examples

### Extract Inline Template to File

**Before:**
```typescript
@Component({
  selector: 'app-example',
  template: `
    <div class="container">
      <h1>{{title}}</h1>
      <p>Welcome to our application!</p>
    </div>
  `,
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  title = 'My App';
}
```

**After:**
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  title = 'My App';
}
```

### Move External Template to Inline

Right-click on `example.component.html` → Angular Template Mover → Move to Inline Template

## 🚀 How to Use

Angular Template Mover can be accessed through **three different methods** for maximum convenience:

### 🖱️ Method 1: Explorer Context Menu (Right-click)

1. **Open your Angular project** in VS Code
2. **Navigate to the Explorer panel** (Ctrl+Shift+E)
3. **Right-click** on any supported file:
   - `.ts` files (component files)
   - `.html/.htm` files (template files)
   - `.css/.scss/.sass/.less` files (style files)
4. **Select "Angular Template Mover"** from the context menu
5. **Choose your desired action** from the submenu

### 📝 Method 2: Editor Context Menu (Right-click in editor)

1. **Open a supported file** in the editor
2. **Right-click anywhere** in the editor content
3. **Select "Angular Template Mover"** from the context menu
4. **Choose your desired action** from the submenu

### ⌨️ Method 3: Command Palette

1. **Open Command Palette** (Ctrl+Shift+P / Cmd+Shift+P)
2. **Type "Angular Template Mover"** or any of these commands:
   - `Angular Template Mover: Extract Template to File`
   - `Angular Template Mover: Extract Styles to File`
   - `Angular Template Mover: Inline Template from File`
   - `Angular Template Mover: Inline Styles from File`
   - `Angular Template Mover: Move to Inline Template`
   - `Angular Template Mover: Move to Inline Styles`
3. **Select the command** you want to execute
4. The extension will operate on the **currently active file**

## 🎯 Context-Aware Commands

The extension intelligently shows relevant commands based on the file type:

| File Type | Available Commands |
|-----------|-------------------|
| **`.ts` files** | All extraction and inlining commands |
| **`.html/.htm` files** | Move to Inline Template |
| **Style files** (`.css`, `.scss`, `.sass`, `.less`) | Move to Inline Styles |

### 💡 Pro Tips:

- **Explorer context menu**: Best for batch operations on multiple files
- **Editor context menu**: Quick access while editing a specific file
- **Command palette**: Fastest access via keyboard shortcuts, works with active file

## ⚙️ Requirements

- **VS Code**: 1.104.0 or higher
- **Angular**: Any version with TypeScript components
- **File Structure**: Standard Angular component naming conventions

## 🔧 Supported Features

- ✅ **Multiple Style Preprocessors**: CSS, SCSS, SASS, LESS
- ✅ **Smart File Detection**: Automatically finds corresponding component files
- ✅ **Safe Operations**: Prompts before deleting files
- ✅ **Error Handling**: Comprehensive error messages and validation
- ✅ **Template Preservation**: Maintains formatting and structure
- ✅ **Batch Style Processing**: Handles multiple style files in `styleUrls`

## 🐛 Known Limitations

- Requires standard Angular naming conventions (`component-name.component.ts`)
- Only supports string templates (backticks, single, and double quotes)
- Template extraction preserves exact formatting but may need manual adjustment
- Component metadata parsing uses `eval()` for complex object structures

## 📋 Roadmap

- [ ] Support for custom naming conventions
- [ ] Batch processing for multiple files
- [ ] Integration with Angular CLI
- [ ] Template and style validation
- [ ] Undo/Redo functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

**Author**: Adilson de Almeida Pedro  
**Website**: [https://adilson.almeidapedro.com.br](https://adilson.almeidapedro.com.br)  
**GitHub**: [@devremoto](https://github.com/devremoto)  
**Twitter**: [@devremoto](https://twitter.com/devremoto)  
**LinkedIn**: [Adilson Pedro](https://www.linkedin.com/in/adilsonpedro/)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Known Limitations](#-known-limitations) section
2. Search existing [issues](https://github.com/devremoto/angular-template-mover/issues)
3. Create a new issue with detailed reproduction steps

## ⭐ Acknowledgments

- Thanks to the Angular team for creating an amazing framework
- Inspired by the need for better developer experience in Angular projects
- Built with love for the Angular community by [Adilson de Almeida Pedro](https://github.com/devremoto)

---

**Enjoy coding with Angular Template Mover! 🎉**

*Created by [Adilson de Almeida Pedro](https://adilson.almeidapedro.com.br) - Full Stack Developer*
