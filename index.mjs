import { Command } from 'commander';
const program = new Command();
import prompts from './prompts/creditCards.mjs';

program
	.description('Example: debt-calculator "./"')
	.version('1.0.0', '-v, --version')
	.action(async (message, command) => {
		if (message.branch === true || message.b === true) {
			command = message;
			prompts(command);
			return;
		} else if (!command || command === undefined) {
			command = message;
			prompts(command);
			return;
		} else {
			prompts(command);
			return;
		}
	});

program.parse(process.argv);