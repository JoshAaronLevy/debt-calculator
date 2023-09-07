// To Do:
//   - Add a prompt for the user to select a credit card
//   - Add a prompt for the user to enter credit limit
//   - Add a prompt for the user to enter credit card balance
//   - Add a prompt for the user to enter introductory credit card interest rate
//   - Add a prompt for the user to enter credit card interest rate
//   - Add a prompt for the user to enter date 0% interest rate expires
//   - Add a prompt for the user to enter credit card minimum payment
//   - Add a prompt for the user to enter absolute maximum amount they can pay towards the credit card
//   - Add a prompt for the user to enter recurring expenses on the credit card
//   - Return the credit card payoff object
//   - Payoff object should include:
//     - Object for minimum payments including:
//       - Total amount paid
//       - Total interest paid
//       - Total time to pay off (or never if minimum payment is less than interest accrued and/or less   than recurring expenses)
//       - What the minimum payment needs to be to cover recurring expenses and interest accrued
//     - Object for paying off the balance prior to 0% interest rate expiring with recurring expenses including:
//       - Total amount paid
//       - Total interest paid
//       - Total time to pay off
//       - What the minimum payment needs to be to cover recurring expenses and interest accrued
//     - Object for paying off the balance in 1 year with recurring expenses
//       - Total amount paid
//       - Total interest paid
//       - What the minimum payment needs to be to cover recurring expenses and interest accrued

// Example Inputs:
//   - Credit Card 1
//     - Credit Limit: $10,000
//     - Balance: $8,432.12
//     - Introductory Interest Rate: 0%
//     - Interest Rate: 19.99%
//     - 0% Interest Rate Expires: 6/31/2024
//     - Minimum Payment: $100
//     - Absolute Maximum Payment: $1,850
//     - Recurring Expenses: $550

import inquirer from 'inquirer';
import moment from 'moment';

let userDebtInfo = {
	creditLimit: null,
	currentBalance: null,
	availableCredit: null,
	baseInterestRate: null,
	recurringExpenses: null,
	minimumPayment: {
		required: null,
		average: null,
	},
	introductoryInterest: {
		expiration: null,
		monthsLeft: null,
	},
};

export default () => {
	return selectPayoffAction();
};

const selectPayoffAction = () => {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'payoffAction',
				message: 'What would you like to do?\n',
				choices: [
					'Calculate payoff options for a 0% introductory interest rate',
					'Cancel',
				],
				default: 'Calculate payoff options for a 0% introductory interest rate'
			}
		])
		.then(answer => {
			const action = answer['payoffAction'];

			if (action === 'Cancel') {
				console.log('Cancelled');
				return;
			} else if (action === 'Calculate payoff options for a 0% introductory interest rate') {
				return inputCreditLimit();
			}
		}).catch(error => {
			console.log(error);
		});
};

const inputCreditLimit = () => {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'creditLimit',
				message: 'What is the total credit limit?\n',
				filter: function (value) {
					const sanitizedValue = value.replace(/[^0-9.]/g, '');
					return parseFloat(sanitizedValue).toFixed(2);
				},
				validate: function (value) {
					const isValid = !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
					return isValid || 'Please enter a valid number.';
				},
			}
		])
		.then(async answer => {
			userDebtInfo.creditLimit = Number(answer.creditLimit);
			return inputCurrentBalance();
		}).catch(error => {
			console.log(error);
		});
};

const inputCurrentBalance = () => {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'currentBalance',
				message: 'What is the current balance?\n',
				filter: function (value) {
					const sanitizedValue = value.replace(/[^0-9.]/g, '');
					return parseFloat(sanitizedValue).toFixed(2);
				},
				validate: function (value) {
					const isValid = !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
					return isValid || 'Please enter a valid number.';
				},
			}
		])
		.then(async answer => {
			userDebtInfo.currentBalance = Number(answer.currentBalance);
			userDebtInfo.availableCredit = userDebtInfo.creditLimit - userDebtInfo.currentBalance;
			return inputRecurringExpenses();
		}).catch(error => {
			console.log(error);
		});
};

const inputRecurringExpenses = () => {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'recurringExpenses',
				message: 'What are your total monthly recurring expenses on the card (i.e. bills, subscription services, groceries)?\n',
				filter: function (value) {
					const sanitizedValue = value.replace(/[^0-9.]/g, '');
					return parseFloat(sanitizedValue).toFixed(2);
				},
				validate: function (value) {
					const isValid = !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
					return isValid || 'Please enter a valid number.';
				},
			}
		])
		.then(async answer => {
			userDebtInfo.recurringExpenses = Number(answer.recurringExpenses);
			return inputMinimumPayment();
		}).catch(error => {
			console.log(error);
		});
};

const inputMinimumPayment = () => {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'minimumPayment',
				message: 'What is the monthly minimum payment due?\n',
				filter: function (value) {
					const sanitizedValue = value.replace(/[^0-9.]/g, '');
					return parseFloat(sanitizedValue).toFixed(2);
				},
				validate: function (value) {
					const isValid = !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
					return isValid || 'Please enter a valid number.';
				},
			}
		])
		.then(async answer => {
			userDebtInfo.minimumPayment.required = Number(answer.minimumPayment);
			return inputaverageMinimumPayment();
		}).catch(error => {
			console.log(error);
		});
};

const inputaverageMinimumPayment = () => {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'averageMinimumPayment',
				message: 'How much do you typically pay each month?\n',
				filter: function (value) {
					const sanitizedValue = value.replace(/[^0-9.]/g, '');
					return parseFloat(sanitizedValue).toFixed(2);
				},
				validate: function (value) {
					const isValid = !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
					return isValid || 'Please enter a valid number.';
				},
			}
		])
		.then(async answer => {
			userDebtInfo.minimumPayment.average = Number(answer.averageMinimumPayment);
			userDebtInfo.minimumPayment.average = userDebtInfo.minimumPayment.average - 0;
			return selectInterestExpirationDate();
		}).catch(error => {
			console.log(error);
		});
};

const selectInterestExpirationDate = async () => {
	try {
		const { interestExpirationMonth } = await inquirer.prompt([
			{
				type: 'list',
				name: 'interestExpirationMonth',
				message: 'What month does the introductory interest rate end on?\n',
				choices: [
					'01 - January',
					'02 - February',
					'03 - March',
					'04 - April',
					'05 - May',
					'06 - June',
					'07 - July',
					'08 - August',
					'09 - September',
					'10 - October',
					'11 - November',
					'12 - December',
				],
				default: '01 - January',
			},
		]);

		const { interestExpirationYear } = await inquirer.prompt([
			{
				type: 'list',
				name: 'interestExpirationYear',
				message: 'What year does the introductory interest rate end on?\n',
				choices: [
					'2023',
					'2024',
					'2025',
					'2026',
					'2027',
					'2028',
					'2029',
					'2030',
				],
				default: '2023',
			},
		]);

		// Extract just the month number from the selected choice
		const monthNumber = interestExpirationMonth.split(' ')[0];

		// Create a moment object for the expiration date
		const expirationDate = moment(`${interestExpirationYear}-${monthNumber}`);

		// Calculate the number of months left until the introductory rate expires
		const monthsLeft = expirationDate.diff(moment(), 'months');

		userDebtInfo.introductoryInterest.expiration = `${monthNumber}/${interestExpirationYear}`;
		userDebtInfo.introductoryInterest.monthsLeft = monthsLeft;
		userDebtInfo.introductoryInterest.monthsLeft = userDebtInfo.introductoryInterest.monthsLeft - 0;

		return inputBaseInterestRate();
	} catch (error) {
		console.log(error);
	}
};

const inputBaseInterestRate = () => {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'baseInterestRate',
				message: 'What will the interest rate be when the introductory rate expires?\n',
				filter: function (value) {
					const sanitizedValue = value.replace(/[^0-9.]/g, '');
					return parseFloat(sanitizedValue).toFixed(2);
				},
				validate: function (value) {
					const isValid = !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
					return isValid || 'Please enter a valid number.';
				},
			}
		])
		.then(async answer => {
			userDebtInfo.baseInterestRate = Number(answer.baseInterestRate);
			console.log('userDebtInfo:\n', userDebtInfo);
			return userDebtInfo;
		}).catch(error => {
			console.log(error);
		});
};