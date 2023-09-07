export const calculateGoalDatePayoff = (
	balance,
	remainingBalance,
	recurringExpenses,
	monthlyInterestRate,
	absoluteMaxPayment,
	monthsRemaining,
	months,
	totalInterestPaid,
	payoff
) => {
	while (remainingBalance > 0 && months < monthsRemaining) {
		remainingBalance += recurringExpenses;
		const interest = remainingBalance * monthlyInterestRate;
		const payment = Math.min(absoluteMaxPayment, remainingBalance + interest);
		totalInterestPaid += interest;
		remainingBalance += interest - payment;
		months++;
	}

	payoff.oneYearPayoff = {
		totalAmountPaid: balance + totalInterestPaid,
		totalInterestPaid,
		totalTime: months,
		requiredMinimum: remainingBalance / monthsRemaining,
	};

	return payoff;
};