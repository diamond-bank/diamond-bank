import { pgTable, text, timestamp, integer, decimal, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const transactionTypeEnum = pgEnum("transaction_type", ["transfer", "deposit", "withdrawal", "fee"]);
export const accountTypeEnum = pgEnum("account_type", ["savings", "checking", "investment"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  accountNumber: text("account_number").notNull().unique(),
  accountType: accountTypeEnum("account_type").default("checking").notNull(),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0.00").notNull(),
  isBlocked: integer("is_blocked").default(0).notNull(), // 0 = active, 1 = blocked
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const supportMessages = pgTable("support_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderAccountId: uuid("sender_account_id").references(() => accounts.id),
  receiverAccountId: uuid("receiver_account_id").references(() => accounts.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  type: transactionTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  supportMessages: many(supportMessages),
}));

export const supportMessagesRelations = relations(supportMessages, ({ one }) => ({
  user: one(users, {
    fields: [supportMessages.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  sentTransactions: many(transactions, { relationName: "sentTransactions" }),
  receivedTransactions: many(transactions, { relationName: "receivedTransactions" }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  senderAccount: one(accounts, {
    fields: [transactions.senderAccountId],
    references: [accounts.id],
    relationName: "sentTransactions",
  }),
  receiverAccount: one(accounts, {
    fields: [transactions.receiverAccountId],
    references: [accounts.id],
    relationName: "receivedTransactions",
  }),
}));
