import { z } from "zod";
import { DocumentTypes, Gender } from "@/app/definitions/definitions";

export const registroSchema = z
  .object({
    email: z
      .string({ required_error: "Campo Requerido" })
      .email("Email inválido"),
    password: z
      .string({ required_error: "Campo Requerido" })
      .regex(new RegExp(/^[a-zA-Z0-9!@#$%^&*]{8,20}$/), {
        message: "La contraseña debe tener entre 8 y 20 caracteres \n No puede contener espacios en blanco\nDebe contener al menos un número, una letra mayúscula, una minúscula y un símbolo",
      }),
    confirmPassword: z.string({ required_error: "Campo Requerido" }),
    name: z
      .string({ required_error: "Campo Requerido" })
      .min(1, "Debe ingresar un nombre"),
    lastName: z
      .string({ required_error: "Campo Requerido" })
      .min(1, "Debe ingresar un apellido"),
    gender: z.enum([Gender.male, Gender.female, Gender.other], {
      message: "Debe elegir un género",
    }),
    birth: z.string({ required_error: "Campo Requerido" }).date(),
    phone: z
      .string({ required_error: "Campo Requerido" })
      .regex(new RegExp(/^[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/), {
        message: "Número de teléfono inválido",
      }),
    documentType: z.enum([DocumentTypes.dni, DocumentTypes.passport], {
      message: "Debe elegir un tipo de documento",
    }),
    dni: z
      .string({ required_error: "Campo Requerido" })
      .min(1, "Debe ingresar un número de documento"),
    urlImg: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe seleccionar una imagen" }),
    license: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe ingresar un número de matrícula" }),
    practitionerRoleId: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe seleccionar una especialidad" }),
    homeService: z.boolean({ required_error: "Campo Requerido" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
