'use client'

import { useState } from 'react'
import { deleteTransaction } from '@/lib/database'
import ConfirmDialog from './ConfirmDialog'

export default function TransactionList({ transactions, onTransactionDeleted }) {
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState({ show: false, transactionId: null, description: '' })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleDelete = (id) => {
    const transaction = transactions.find(t => t.id === id)
    setConfirmDelete({
      show: true,
      transactionId: id,
      description: transaction?.description || 'this transaction'
    })
  }

  const confirmDeleteTransaction = async () => {
    const id = confirmDelete.transactionId
    setDeletingId(id)
    setConfirmDelete({ show: false, transactionId: null, description: '' })

    try {
      await deleteTransaction(id)
      onTransactionDeleted(id)
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Failed to delete transaction')
    } finally {
      setDeletingId(null)
    }
  }

  const cancelDelete = () => {
    setConfirmDelete({ show: false, transactionId: null, description: '' })
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No transactions yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center hover:bg-gray-50"
        >
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">{formatDate(transaction.transaction_date)}</p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-gray-400 capitalize">{transaction.type}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDelete(transaction.id)}
            disabled={deletingId === transaction.id}
            className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {deletingId === transaction.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}

      <ConfirmDialog
        isOpen={confirmDelete.show}
        onClose={cancelDelete}
        onConfirm={confirmDeleteTransaction}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${confirmDelete.description}"? This action cannot be undone.`}
        confirmText="Delete Transaction"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  )
}