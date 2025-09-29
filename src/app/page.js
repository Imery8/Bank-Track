import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bank Track
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Track separate account balances within your shared bank account
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium block"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="w-full bg-white text-indigo-600 py-3 px-4 rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors font-medium block"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-900 mb-2">Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Manually track individual account balances</li>
            <li>• Record transactions and purchases</li>
            <li>• Real-time balance calculations</li>
            <li>• Secure and private account management</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
