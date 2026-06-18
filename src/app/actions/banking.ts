"use server";

import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function transferAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const fromAccountId = formData.get("fromAccountId") as string;
  const toAccountNumber = formData.get("toAccountNumber") as string;
  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const amount = Number(amountStr);

  if (!fromAccountId || !toAccountNumber || isNaN(amount) || amount <= 0) {
    return { error: "Invalid input" };
  }

  try {
    return await db.transaction(async (tx) => {
      // 1. Check sender account
      const senderAcc = await tx.query.accounts.findFirst({
        where: eq(accounts.id, fromAccountId),
      });

      if (!senderAcc || senderAcc.userId !== session.user.id) {
        throw new Error("Sender account not found or access denied");
      }

      if (senderAcc.isBlocked === 1) {
        throw new Error("This account is currently blocked from making transfers. Please contact support.");
      }

      if (Number(senderAcc.balance) < amount) {
        throw new Error("Insufficient funds");
      }

      // 2. Check receiver account
      const receiverAcc = await tx.query.accounts.findFirst({
        where: eq(accounts.accountNumber, toAccountNumber),
      });

      if (!receiverAcc) {
        throw new Error("Receiver account not found");
      }

      if (senderAcc.id === receiverAcc.id) {
        throw new Error("Cannot transfer to the same account");
      }

      // 3. Perform transfer
      await tx.update(accounts)
        .set({ balance: sql`${accounts.balance} - ${amount}` })
        .where(eq(accounts.id, senderAcc.id));

      await tx.update(accounts)
        .set({ balance: sql`${accounts.balance} + ${amount}` })
        .where(eq(accounts.id, receiverAcc.id));

      // 4. Record transaction
      await tx.insert(transactions).values({
        senderAccountId: senderAcc.id,
        receiverAccountId: receiverAcc.id,
        amount: amount.toString(),
        description: description || `Transfer to ${receiverAcc.accountNumber}`,
        type: "transfer",
      });

      return { success: true };
    });
  } catch (e: any) {
    return { error: e.message || "Transfer failed" };
  } finally {
    revalidatePath("/dashboard");
  }
}

export async function depositAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const accountId = formData.get("accountId") as string;
  const amountStr = formData.get("amount") as string;
  const amount = Number(amountStr);

  if (!accountId || isNaN(amount) || amount <= 0) {
    return { error: "Invalid input" };
  }

  try {
    await db.update(accounts)
      .set({ balance: sql`${accounts.balance} + ${amount}` })
      .where(eq(accounts.id, accountId));

    await db.insert(transactions).values({
      receiverAccountId: accountId,
      amount: amount.toString(),
      description: "Capital Credit",
      type: "deposit",
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (e: any) {
    return { error: e.message || "Deposit failed" };
  }
}

export async function toggleBlockAction(accountId: string, currentlyBlocked: boolean) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await db.update(accounts)
      .set({ isBlocked: currentlyBlocked ? 0 : 1 })
      .where(eq(accounts.id, accountId));
    
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (e: any) {
    return { error: "Failed to update account status" };
  }
}

import { supportMessages, users } from "@/db/schema";

export async function sendSupportMessage(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!subject || !message) return { error: "Missing fields" };

  try {
    await db.insert(supportMessages).values({
      userId: session.user.id,
      subject,
      message,
    });
    return { success: true };
  } catch (e) {
    return { error: "Failed to send message" };
  }
}

export async function updateProfileAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const avatarUrl = formData.get("avatarUrl") as string;
  const name = formData.get("name") as string;

  try {
    await db.update(users)
      .set({ avatarUrl, name })
      .where(eq(users.id, session.user.id));
    
    // Note: session cookie won't auto-update name until re-login, 
    // but DB will be updated. In a real app we'd refresh the session.
    
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (e) {
    return { error: "Failed to update profile" };
  }
}
