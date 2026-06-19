import { db } from "./index";
import { users, accounts, transactions, supportMessages } from "./schema";
import bcrypt from "bcryptjs";

import { sql } from "drizzle-orm";

export async function seed() {
  console.log("Initializing database tables...");

  // 1. Create Tables if they don't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      account_number TEXT NOT NULL UNIQUE,
      account_type TEXT NOT NULL DEFAULT 'checking',
      balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
      is_blocked INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sender_account_id UUID REFERENCES accounts(id),
      receiver_account_id UUID REFERENCES accounts(id),
      amount DECIMAL(15,2) NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS support_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  console.log("Clearing old data...");
  // Use try/catch in case tables were just created and are empty
  try {
    await db.delete(transactions);
    await db.delete(accounts);
    await db.delete(users);
    await db.delete(supportMessages);
  } catch (e) {
    console.log("Tables were already empty or just created.");
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Users
  const [user1] = await db.insert(users).values({
    name: "John Doe",
    email: "john@example.com",
    password: hashedPassword,
    avatarUrl: "https://i.pravatar.cc/150?u=john",
  }).returning();

  const [user2] = await db.insert(users).values({
    name: "Jane Smith",
    email: "jane@example.com",
    password: hashedPassword,
    avatarUrl: "https://i.pravatar.cc/150?u=jane",
  }).returning();

  // Create Accounts
  const [acc1] = await db.insert(accounts).values({
    userId: user1.id,
    accountNumber: "DB123456789",
    accountType: "checking",
    balance: "5420.50",
  }).returning();

  const [acc2] = await db.insert(accounts).values({
    userId: user1.id,
    accountNumber: "DB987654321",
    accountType: "savings",
    balance: "12500.00",
  }).returning();

  const [acc3] = await db.insert(accounts).values({
    userId: user2.id,
    accountNumber: "DB555666777",
    accountType: "checking",
    balance: "3200.75",
  }).returning();

  // Create Transactions
  await db.insert(transactions).values([
    {
      senderAccountId: acc1.id,
      receiverAccountId: acc3.id,
      amount: "250.00",
      description: "Dinner split",
      type: "transfer",
    },
    {
      senderAccountId: acc3.id,
      receiverAccountId: acc1.id,
      amount: "50.00",
      description: "Coffee",
      type: "transfer",
    },
    {
      receiverAccountId: acc1.id,
      amount: "1500.00",
      description: "Salary deposit",
      type: "deposit",
    },
    {
      senderAccountId: acc2.id,
      amount: "200.00",
      description: "ATM Withdrawal",
      type: "withdrawal",
    }
  ]);

  console.log("Seeding completed!");
}
