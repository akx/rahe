export default function dateFilterTransactions(transactions, start, end)
{
  const startDateYMD = start.format('YYYY-MM-DD');
  const endDateYMD = end.format('YYYY-MM-DD');
  return transactions.filter((txn) => (txn.paymentDate >= startDateYMD && txn.paymentDate <= endDateYMD));
}
