"use server";

import { db } from "@/db";
import { users, accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "Missing fields" };

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    // Create a default checking account for the new user
    await db.insert(accounts).values({
      userId: newUser.id,
      accountNumber: "DB" + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'),
      accountType: "checking",
      balance: "0.00",
    });

    await login({ id: newUser.id, email: newUser.email, name: newUser.name });
  } catch (e: any) {
    if (e.code === '23505') return { error: "Email already exists" };
    return { error: "Something went wrong" };
  }

  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Missing fields" };

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid email or password" };
  }

  await login({ id: user.id, email: user.email, name: user.name });
  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/");
}
