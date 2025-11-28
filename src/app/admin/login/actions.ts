"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD!, 10);

export async function login(prevState: any, formData: FormData) {
  // FormData comes as second argument in server actions when using `useActionState`
  const password = formData.get("password")?.toString() || "";

  if (bcrypt.compareSync(password, hashedPassword)) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", { httpOnly: true, path: "/" });
    redirect("/admin/items");
  }

  return { message: "Invalid password" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
