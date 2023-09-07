export const calculateAdjustedPayments = (
	balance,
	remainingBalance,
	recurringExpenses,
	monthlyInterestRate,
	averageMonthlyPayment,
	months,
	totalInterestPaid,
	payoff
) => {
	const adjustedPayments = [50, 100];
	payoff.adjustedMonthlyPayoff = {};

	adjustedPayments.forEach((increase) => {
		remainingBalance = balance;
		const adjustedPayment = averageMonthlyPayment + increase;

		while (remainingBalance > 0) {
			remainingBalance += recurringExpenses;
			const interest = remainingBalance * monthlyInterestRate;
			const payment = Math.min(adjustedPayment, remainingBalance + interest);
			totalInterestPaid += interest;
			remainingBalance += interest - payment;
			months++;
		}

		payoff.adjustedMonthlyPayoff[`plus${increase}`] = {
			totalAmountPaid: balance + totalInterestPaid,
			totalInterestPaid,
			totalTime: months,
		};
	});

	return payoff;
};