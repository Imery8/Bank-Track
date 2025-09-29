'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import AccountCard from '@/components/ui/AccountCard'
import { getAccounts, getTransactions } from '@/lib/database'

export default function Dashboard() {
  const [accounts, setAccounts] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBalance: 0,
    accountCount: 0,
    recentTransactionCount: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const accountsData = await getAccounts()
      setAccounts(accountsData)

      // Get recent transactions from all accounts
      const allTransactions = []
      for (const account of accountsData) {
        const transactions = await getTransactions(account.id)
        const transactionsWithAccount = transactions.map(t => ({
          ...t,
          accountName: account.name
        }))
        allTransactions.push(...transactionsWithAccount)
      }

      // Sort by date and get most recent 10
      const sortedTransactions = allTransactions.sort((a, b) => {
        const dateA = new Date(`${a.transaction_date}T${a.created_at.split('T')[1]}`)
        const dateB = new Date(`${b.transaction_date}T${b.created_at.split('T')[1]}`)
        return dateB - dateA
      }).slice(0, 10)

      setRecentTransactions(sortedTransactions)

      // Calculate stats
      const totalBalance = accountsData.reduce((sum, account) => sum + parseFloat(account.current_balance), 0)
      setStats({
        totalBalance,
        accountCount: accountsData.length,
        recentTransactionCount: allTransactions.length
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading dashboard...</div>
          </div>
        </div>
      </div>
    )
  }

  const totalBalanceColor = stats.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Balance</p>
                  <p className={`text-2xl font-bold ${totalBalanceColor}`}>
                    {formatCurrency(stats.totalBalance)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.accountCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentTransactionCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex space-x-4">
              <Link
                href="/accounts"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Manage Accounts
              </Link>
              {accounts.length > 0 && (
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        window.location.href = `/accounts/${e.target.value}/add-transaction`
                      }
                    }}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors font-medium border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10"
                    defaultValue=""
                  >
                    <option value="" disabled>Quick Transaction</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        Add to {account.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accounts Overview */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Accounts</h2>
              <Link
                href="/accounts"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            {accounts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500 mb-4">No accounts created yet.</p>
                <Link
                  href="/accounts"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  Create Your First Account
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.slice(0, 4).map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {recentTransactions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No transactions yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.accountName} • {formatDate(transaction.transaction_date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold text-sm ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}