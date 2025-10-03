import { z } from "zod";

export const PasswordSetupSchema = z
  .object({
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("El email no es válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
      ),
    confirmPassword: z.string().min(1, "Confirme la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type PasswordSetupFormData = z.infer<typeof PasswordSetupSchema>;
