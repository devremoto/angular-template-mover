import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Angular Template Mover Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('undefined_publisher.angular-template-mover'));
	});

	test('Commands should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);

		assert.ok(commands.includes('angular-template-mover.extractTemplate'));
		assert.ok(commands.includes('angular-template-mover.extractStyles'));
		assert.ok(commands.includes('angular-template-mover.inlineTemplate'));
		assert.ok(commands.includes('angular-template-mover.inlineStyles'));
	});

	test('Sample template extraction regex test', () => {
		const componentContent = `
@Component({
  selector: 'app-test',
  template: \`
    <div>
      <h1>Hello World</h1>
    </div>
  \`,
  styleUrls: ['./test.component.css']
})
export class TestComponent { }
		`;

		const templateMatch = componentContent.match(/template\s*:\s*[`'"]([^`'"]*(?:[`'"][^`'"]*)*)[`'"]/s);
		assert.ok(templateMatch);
		assert.ok(templateMatch[1].includes('Hello World'));
	});

	test('Sample styles extraction regex test', () => {
		const componentContent = `
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styles: [\`
    .container { padding: 20px; }
    h1 { color: blue; }
  \`]
})
export class TestComponent { }
		`;

		const stylesMatch = componentContent.match(/styles\s*:\s*\[([^\]]*)\]/s);
		assert.ok(stylesMatch);
		assert.ok(stylesMatch[1].includes('padding: 20px'));
	});
});
