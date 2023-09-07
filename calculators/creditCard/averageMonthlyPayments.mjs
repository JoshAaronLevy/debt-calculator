export const calculateAverageMonthlyPayments = (
	balance,
	remainingBalance,
	recurringExpenses,
	monthlyInterestRate,
	averageMonthlyPayment,
	months,
	totalInterestPaid,
	payoff
) => {
	while (remainingBalance > 0) {
		remainingBalance += recurringExpenses;
		const interest = remainingBalance * monthlyInterestRate;
		const payment = Math.min(averageMonthlyPayment, remainingBalance + interest);
		totalInterestPaid += interest;
		remainingBalance += interest - payment;
		months++;
	}

	payoff.averageMonthlyPayoff = {
		totalAmountPaid: balance + totalInterestPaid,
		totalInterestPaid,
		totalTime: months,
	};

	return payoff;
};