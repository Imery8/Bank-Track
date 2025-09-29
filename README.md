# Bank Track

A Next.js application for manually tracking separate account balances within a shared bank account. Perfect for managing individual spending between multiple people using the same bank account.

## Features

- **Multiple Account Management**: Create and manage separate virtual accounts
- **Transaction Tracking**: Record credits (money added) and debits (purchases/expenses)
- **Real-time Balance Updates**: Automatic balance calculations with database triggers
- **Secure Authentication**: User authentication powered by Supabase Auth
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Transaction History**: View detailed transaction history for each account

## Tech Stack

- **Frontend**: Next.js 15 with JavaScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bank-track
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Supabase project:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy the contents of `supabase-schema.sql` and run it in your Supabase SQL editor

4. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The `supabase-schema.sql` file contains all the necessary SQL to set up your database:

- **Tables**: `accounts` and `transactions`
- **Row Level Security (RLS)**: Ensures users can only see their own data
- **Triggers**: Automatically update account balances when transactions are added/modified/deleted

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with your existing credentials
2. **Create Accounts**: Add virtual accounts (e.g., "My Account", "Brother's Account")
3. **Set Initial Balances**: Set the starting balance for each account
4. **Record Transactions**:
   - Add money (credit) when transferring funds into an account
   - Record purchases (debit) when money is spent
5. **Track Balances**: View real-time balance updates across all accounts

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/          # Dashboard page
│   ├── accounts/           # Account management pages
│   ├── login/              # Authentication pages
│   └── signup/
├── components/             # Reusable components
│   ├── layout/             # Layout components (Navigation)
│   ├── ui/                 # UI components (cards, lists, etc.)
│   └── forms/              # Form components
└── lib/                    # Utilities and configurations
    ├── supabase/           # Supabase client configuration
    └── database.js         # Database operation functions
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
