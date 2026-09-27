import { connection } from "next/server";

import { Dashboard } from "@/components/dashboard";
import { serverNow } from "@/lib/server-now";

export default async function Home() {
  await connection();

  return <Dashboard now={serverNow()} />;
}
