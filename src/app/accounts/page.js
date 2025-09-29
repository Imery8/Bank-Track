'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import AccountCard from '@/components/ui/AccountCard'
import AccountForm from '@/components/forms/AccountForm'
import { getAccounts, createAccount, deleteAccount } from '@/lib/database'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const router = useRouter()

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const data = await getAccounts()
      setAccounts(data)
    } catch (error) {
      console.error('Error loading accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async (accountData) => {
    try {
      const newAccount = await createAccount(accountData.name, accountData.initialBalance)
      setAccounts([newAccount, ...accounts])
      setShowForm(false)
    } catch (error) {
      throw error
    }
  }

  const handleDeleteAccount = async (accountId) => {
    if (!confirm('Are you sure you want to delete this account? All transactions will also be deleted.')) {
      return
    }

    setDeleting(accountId)
    try {
      await deleteAccount(accountId)
      setAccounts(accounts.filter(account => account.id !== accountId))
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading accounts...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            {showForm ? 'Cancel' : 'Create Account'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Account</h2>
            <AccountForm onSubmit={handleCreateAccount} />
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No accounts created yet.</div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Create Your First Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="relative">
                <AccountCard account={account} />
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  disabled={deleting === account.id}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                >
                  {deleting === account.id ? 'Deleting...' : '×'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}