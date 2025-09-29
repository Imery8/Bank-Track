import { createClient } from './supabase/client'

// Account operations
export async function getAccounts() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createAccount(name, initialBalance) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('accounts')
    .insert({
      name,
      initial_balance: initialBalance,
      current_balance: initialBalance
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAccount(id, updates) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAccount(id) {
  const supabase = createClient()
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Transaction operations
export async function getTransactions(accountId) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('account_id', accountId)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createTransaction(accountId, amount, type, description, date = null) {
  const supabase = createClient()
  const transactionData = {
    account_id: accountId,
    amount: Math.abs(amount),
    type,
    description,
    transaction_date: date || new Date().toISOString().split('T')[0]
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTransaction(id) {
  const supabase = createClient()
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) throw error
}