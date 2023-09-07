export const calculateMaxOutRisk = (
	remainingBalance,
	recurringExpenses,
	creditLimit,
	monthlyInterestRate,
	minimumPayment,
	payoff
) => {
	let isAtRisk = false;
	let minPaymentToAvoidMaxOut;

	while (remainingBalance < creditLimit) {
		remainingBalance += recurringExpenses;
		const interest = remainingBalance * monthlyInterestRate;
		remainingBalance += interest;

		if (remainingBalance >= creditLimit) {
			isAtRisk = true;
			minPaymentToAvoidMaxOut = remainingBalance + recurringExpenses + interest - creditLimit;
			break;
		}

		const payment = Math.min(minimumPayment, remainingBalance);
		remainingBalance -= payment;
	}

	payoff.maxOutRisk = {
		isAtRisk,
		minPaymentToAvoidMaxOut,
	};

	return payoff;
};