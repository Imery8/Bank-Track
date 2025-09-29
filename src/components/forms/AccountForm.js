'use client'

import { useState } from 'react'

export default function AccountForm({ onSubmit, initialData = null, submitLabel = 'Create Account' }) {
  const [name, setName] = useState(initialData?.name || '')
  const [initialBalance, setInitialBalance] = useState(initialData?.initial_balance || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!name.trim()) {
      setError('Account name is required')
      setLoading(false)
      return
    }

    const balance = parseFloat(initialBalance) || 0

    try {
      await onSubmit({ name: name.trim(), initialBalance: balance })
      if (!initialData) {
        setName('')
        setInitialBalance('')
      }
    } catch (error) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Account Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter account name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
          required
        />
      </div>

      <div>
        <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700 mb-1">
          Initial Balance
        </label>
        <input
          id="initialBalance"
          type="number"
          step="0.01"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium"
      >
        {loading ? 'Processing...' : submitLabel}
      </button>
    </form>
  )
}