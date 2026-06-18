import { db } from "@/db";
import { accounts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import TransferForm from "@/components/TransferForm";

export default async function TransferPage() {
  const session = await getSession();
  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, session.user.id),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Transfer Funds</h1>
        <p className="text-slate-500">Send money to any Diamond Bank account instantly.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <TransferForm accounts={userAccounts} />
      </div>
    </div>
  );
}
