const moment = require('moment');
const { calculateMinimumPayments } = require('./creditCard/minimumPayments.mjs');
const { calculateExpiringInterestRate } = require('./creditCard/expiringInterestRate.mjs');
const { calculateMaxOutRisk } = require('./creditCard/maxOutRisk.mjs');
const { calculateAdjustedPayments } = require('./creditCard/adjustedPayments.mjs');
const { calculateGoalDatePayoff } = require('./creditCard/goalDatePayoff.mjs');
const { calculateAverageMonthlyPayments } = require('./creditCard/averageMonthlyPayments.mjs');

function calculatePayoff({
	creditLimit,
	balance,
	interestRate,
	zeroInterestExpiry,
	minimumPayment,
	recurringExpenses,
	absoluteMaxPayment,
	averageMonthlyPayment,
	monthsRemaining,
}) {
	const payoff = {
		minimumPayments: {},
		zeroInterestPayoff: {},
		oneYearPayoff: {},
		averageMonthlyPayoff: {},
		increasedMonthlyPayoff: {},
		maxOutRisk: {},
	};

	let remainingBalance = balance;
	let totalInterestPaid = 0;
	let months = 0;

	const monthlyInterestRate = interestRate / 12 / 100;

	const minimumPayments = calculateMinimumPayments(
		balance,
		remainingBalance,
		recurringExpenses,
		monthlyInterestRate,
		minimumPayment
	);

	console.log('minimumPayments:\n', minimumPayments);

	const monthsUntilZeroInterestExpires = moment(zeroInterestExpiry).diff(moment(), 'months');

	const zeroInterestPayoff = calculateExpiringInterestRate(
		remainingBalance,
		recurringExpenses,
		monthsUntilZeroInterestExpires,
		absoluteMaxPayment,
		months,
		balance
	);

	console.log('zeroInterestPayoff:\n', zeroInterestPayoff);

	const goalDatePayoff = calculateGoalDatePayoff(
		balance,
		remainingBalance,
		recurringExpenses,
		monthlyInterestRate,
		absoluteMaxPayment,
		monthsRemaining,
		months,
		totalInterestPaid,
		payoff
	);

	console.log('goalDatePayoff:\n', goalDatePayoff);

	const averageMonthlyPayoff = calculateAverageMonthlyPayments(
		balance,
		remainingBalance,
		recurringExpenses,
		monthlyInterestRate,
		averageMonthlyPayment,
		months,
		totalInterestPaid,
		payoff
	);

	console.log('averageMonthlyPayoff:\n', averageMonthlyPayoff);

	const adjustedPayments = calculateAdjustedPayments(
		balance,
		remainingBalance,
		recurringExpenses,
		monthlyInterestRate,
		averageMonthlyPayment,
		months,
		totalInterestPaid,
		payoff
	);

	console.log('adjustedPayments:\n', adjustedPayments);

	const maxOutRisk = calculateMaxOutRisk(
		remainingBalance,
		recurringExpenses,
		creditLimit,
		monthlyInterestRate,
		minimumPayment,
		payoff
	);

	console.log('maxOutRisk:\n', maxOutRisk);

	return payoff;
}