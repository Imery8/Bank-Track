-- Create accounts table
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  initial_balance decimal(10,2) not null default 0,
  current_balance decimal(10,2) not null default 0,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts(id) on delete cascade not null,
  amount decimal(10,2) not null,
  type text not null check (type in ('credit', 'debit')),
  description text not null,
  transaction_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;

-- Create policies for accounts table
create policy "Users can view their own accounts"
  on public.accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own accounts"
  on public.accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own accounts"
  on public.accounts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own accounts"
  on public.accounts for delete
  using (auth.uid() = user_id);

-- Create policies for transactions table
create policy "Users can view transactions for their accounts"
  on public.transactions for select
  using (
    exists (
      select 1 from public.accounts
      where accounts.id = transactions.account_id
      and accounts.user_id = auth.uid()
    )
  );

create policy "Users can insert transactions for their accounts"
  on public.transactions for insert
  with check (
    exists (
      select 1 from public.accounts
      where accounts.id = transactions.account_id
      and accounts.user_id = auth.uid()
    )
  );

create policy "Users can update transactions for their accounts"
  on public.transactions for update
  using (
    exists (
      select 1 from public.accounts
      where accounts.id = transactions.account_id
      and accounts.user_id = auth.uid()
    )
  );

create policy "Users can delete transactions for their accounts"
  on public.transactions for delete
  using (
    exists (
      select 1 from public.accounts
      where accounts.id = transactions.account_id
      and accounts.user_id = auth.uid()
    )
  );

-- Function to update account balance when transactions are added/modified/deleted
create or replace function update_account_balance()
returns trigger as $$
begin
  if TG_OP = 'DELETE' then
    -- Recalculate balance after deletion
    update public.accounts
    set current_balance = initial_balance + coalesce((
      select sum(case when type = 'credit' then amount else -amount end)
      from public.transactions
      where account_id = OLD.account_id
    ), 0)
    where id = OLD.account_id;
    return OLD;
  else
    -- Recalculate balance after insert/update
    update public.accounts
    set current_balance = initial_balance + coalesce((
      select sum(case when type = 'credit' then amount else -amount end)
      from public.transactions
      where account_id = NEW.account_id
    ), 0)
    where id = NEW.account_id;
    return NEW;
  end if;
end;
$$ language plpgsql;

-- Create triggers to automatically update account balance
create trigger update_account_balance_trigger
  after insert or update or delete on public.transactions
  for each row execute function update_account_balance();