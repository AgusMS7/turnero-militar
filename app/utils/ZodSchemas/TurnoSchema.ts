import { DocumentTypes, Gender } from "@/app/definitions/definitions";
import { z } from "zod";

const today = new Date();
const maxYears = 120;

export const turnoSchema = z
  .object({
    nombre: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe introducir un nombre" }),
    apellido: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe introducir un apellido" }),
    tipoDoc: z.enum([DocumentTypes.dni, DocumentTypes.passport], {
      required_error: "Debe seleccionar un tipo de documento",
      invalid_type_error: "Tipo de documento no válido",
    }),
    nroDoc: z.string({ required_error: "Campo Requerido" }),
    fechaNac: z.coerce.date({ required_error: "Campo Requerido" })
      .refine((date) => date <= today, {
        message: "La fecha no puede estar en el futuro",
      })
      .refine((date) => {
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - maxYears);
        return date >= minDate;
      }, {
        message: `La fecha no puede ser mayor a ${maxYears} años atrás`,
      }),
    genero: z.enum([Gender.male, Gender.female, Gender.other], {
      message: "Selección no válida",
    }),
    obraSocial: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe seleccionar una obra social" }),
    nroAfiliado: z.string().optional(),
    email: z
      .string({ required_error: "Campo Requerido" })
      .email({ message: "Formato Invalido" }),
    telefono: z
      .string({ required_error: "Campo Requerido" })
      .regex(/^[0-9]{10}$/, {
        message: "Debe introducir un número de teléfono válido (10 dígitos)",
      }),
    fechaTurno: z.coerce.date({ required_error: "Campo Requerido" }),
    horaTurno: z
      .string({ required_error: "Campo Requerido" })
      .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "La hora no es válida (formato HH:mm)",
      }),
  })
  .superRefine((data, ctx) => {
    const { tipoDoc, nroDoc, obraSocial, nroAfiliado } = data;
    if (tipoDoc === DocumentTypes.dni) {
      if (!/^\d{7,8}$/.test(nroDoc)) {
        ctx.addIssue({
          path: ["nroDoc"],
          code: z.ZodIssueCode.custom,
          message: "Debe ingresar un número de DNI válido (7 u 8 dígitos)",
        });
      }
    }
    if (tipoDoc === DocumentTypes.passport) {
      if (!/^[A-Z0-9]{6,9}$/.test(nroDoc)) {
        ctx.addIssue({
          path: ["nroDoc"],
          code: z.ZodIssueCode.custom,
          message: "Debe ingresar un número de pasaporte válido (6 a 9 caracteres alfanuméricos)",
        });
      }
    }
    
    const isParticular = obraSocial === "particular";
    if (!isParticular && (!nroAfiliado || nroAfiliado.trim() === "")) {
      ctx.addIssue({
        path: ["nroAfiliado"],
        code: z.ZodIssueCode.custom,
        message: "Debe introducir un número de afiliado",
      });
    }
  });
