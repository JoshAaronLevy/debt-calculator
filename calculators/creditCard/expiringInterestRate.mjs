export const calculateExpiringInterestRate = (
	remainingBalance,
	recurringExpenses,
	monthsUntilZeroInterestExpires,
	absoluteMaxPayment,
	months,
	balance
) => {
	let payoff = {};

	while (remainingBalance > 0 && months < monthsUntilZeroInterestExpires) {
		remainingBalance += recurringExpenses; // Add recurring expenses
		const payment = Math.min(absoluteMaxPayment, remainingBalance);
		remainingBalance -= payment;
		months++;
	}

	payoff.zeroInterestPayoff = {
		totalAmountPaid: balance,
		totalInterestPaid: 0,
		totalTime: months,
		requiredMinimum: remainingBalance / monthsUntilZeroInterestExpires,
	};

	return payoff;
};