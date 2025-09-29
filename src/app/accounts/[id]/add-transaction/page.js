'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import TransactionForm from '@/components/forms/TransactionForm'
import { getAccounts, createTransaction } from '@/lib/database'

export default function AddTransactionPage() {
  const params = useParams()
  const router = useRouter()
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccount()
  }, [params.id])

  const loadAccount = async () => {
    try {
      const accounts = await getAccounts()
      const currentAccount = accounts.find(acc => acc.id === params.id)

      if (!currentAccount) {
        router.push('/accounts')
        return
      }

      setAccount(currentAccount)
    } catch (error) {
      console.error('Error loading account:', error)
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
      router.push(`/accounts/${params.id}`)
    } catch (error) {
      throw error
    }
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
            <div className="text-gray-500">Loading...</div>
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
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/accounts/${account.id}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to {account.name}
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{account.name}</h1>
              <p className={`text-2xl font-bold ${balanceColor}`}>
                {formatCurrency(account.current_balance)}
              </p>
              <p className="text-gray-500 text-sm">Current Balance</p>
            </div>
          </div>
        </div>

        <TransactionForm
          onSubmit={handleAddTransaction}
          accountName={account.name}
        />
      </div>
    </div>
  )
}