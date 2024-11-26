"use server";

import { db } from "@/drizzle";
import { Users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserById(id: string) {
  const user = await db.select().from(Users).where(eq(Users.id, id));
  return (
    user[0] || {
      id: id,
      username: "",
    }
  );
}

export async function addUser(userId: string, username: string) {
  await db
    .insert(Users)
    .values({
      id: userId,
      username,
    })
    .onConflictDoUpdate({
      target: Users.id,
      set: { username },
    });
}
