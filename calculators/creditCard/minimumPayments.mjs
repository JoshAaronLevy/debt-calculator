export const calculateMinimumPayments = (
	balance,
	remainingBalance,
	recurringExpenses,
	monthlyInterestRate,
	minimumPayment
) => {
	const payoff = {
		minimumPayments: {},
		averageMonthlyPayoff: {},
	};
	let months = 0;
	let totalInterestPaid = 0;

	while (remainingBalance > 0) {
		remainingBalance += recurringExpenses; // Add recurring expenses
		const interest = remainingBalance * monthlyInterestRate;
		const payment = Math.min(minimumPayment, remainingBalance + interest);

		if (payment < interest + recurringExpenses) {
			payoff.minimumPayments = {
				totalAmountPaid: 'Never',
				totalInterestPaid: 'Infinite',
				totalTime: 'Infinite',
				requiredMinimum: interest + recurringExpenses,
			};
			break;
		}

		totalInterestPaid += interest;
		remainingBalance += interest - payment;
		months++;
	}

	if (remainingBalance <= 0) {
		payoff.minimumPayments = {
			totalAmountPaid: balance + totalInterestPaid,
			totalInterestPaid,
			totalTime: months,
			requiredMinimum: minimumPayment,
		};
	}

	return payoff;
};