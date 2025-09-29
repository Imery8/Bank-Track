import Link from 'next/link'

export default function AccountCard({ account }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const balanceColor = account.current_balance >= 0 ? 'text-green-600' : 'text-red-600'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
          <p className="text-sm text-gray-500">
            Initial: {formatCurrency(account.initial_balance)}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${balanceColor}`}>
            {formatCurrency(account.current_balance)}
          </p>
          <p className="text-sm text-gray-500">Current Balance</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Link
          href={`/accounts/${account.id}`}
          className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          View Transactions
        </Link>
        <Link
          href={`/accounts/${account.id}/add-transaction`}
          className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Add Transaction
        </Link>
      </div>
    </div>
  )
}