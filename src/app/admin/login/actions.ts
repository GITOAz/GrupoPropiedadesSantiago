"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { loginInputSchema } from "@/lib/validation";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Ingresa un email y contraseña válidos." };
  }

  const admin = await prisma.admin.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!admin) {
    return { error: "Credenciales incorrectas." };
  }

  const passwordOk = await bcrypt.compare(
    parsed.data.password,
    admin.passwordHash
  );

  if (!passwordOk) {
    return { error: "Credenciales incorrectas." };
  }

  const token = await createSessionToken({
    sub: admin.id,
    nombre: admin.nombre,
    email: admin.email,
  });
  await setSessionCookie(token);

  redirect("/admin/propiedades");
}
