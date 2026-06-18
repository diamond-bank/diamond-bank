import { db } from "./index";
import { users, accounts, transactions } from "./schema";
import bcrypt from "bcryptjs";

export async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(transactions);
  await db.delete(accounts);
  await db.delete(users);

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
