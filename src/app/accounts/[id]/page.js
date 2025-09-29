'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import TransactionList from '@/components/ui/TransactionList'
import TransactionForm from '@/components/forms/TransactionForm'
import { getAccounts, getTransactions, createTransaction } from '@/lib/database'

export default function AccountDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadAccountData()
  }, [params.id])

  const loadAccountData = async () => {
    try {
      const [accountsData, transactionsData] = await Promise.all([
        getAccounts(),
        getTransactions(params.id)
      ])

      const currentAccount = accountsData.find(acc => acc.id === params.id)
      if (!currentAccount) {
        router.push('/accounts')
        return
      }

      setAccount(currentAccount)
      setTransactions(transactionsData)
    } catch (error) {
      console.error('Error loading account data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (transactionData) => {
    try {
      await createTransaction(
        params.id,
        transactionData.amount,
        transactionData.type,
        transactionData.description,
        transactionData.date
      )
      await loadAccountData()
      setShowAddForm(false)
    } catch (error) {
      throw error
    }
  }

  const handleTransactionDeleted = () => {
    loadAccountData()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading account...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Account not found.</div>
            <Link
              href="/accounts"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Back to Accounts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const balanceColor = account.current_balance >= 0 ? 'text-green-600' : 'text-red-600'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/accounts"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Accounts
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{account.name}</h1>
                <p className="text-gray-600">
                  Initial Balance: {formatCurrency(account.initial_balance)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${balanceColor}`}>
                  {formatCurrency(account.current_balance)}
                </p>
                <p className="text-gray-500">Current Balance</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                {showAddForm ? 'Cancel' : 'Add Transaction'}
              </button>
              <Link
                href={`/accounts/${account.id}/add-transaction`}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Quick Add
              </Link>
            </div>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-6">
            <TransactionForm
              onSubmit={handleAddTransaction}
              accountName={account.name}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Transaction History ({transactions.length})
          </h2>
          <TransactionList
            transactions={transactions}
            onTransactionDeleted={handleTransactionDeleted}
          />
        </div>
      </div>
    </div>
  )
}