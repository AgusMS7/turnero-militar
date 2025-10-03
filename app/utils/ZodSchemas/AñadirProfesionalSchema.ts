import { z } from "zod";

interface FieldData {
    enable: boolean;
    openingHour?: string;
    closinghour?: string;
}

function validarHora(hora: string, fraccion: string) {
    const [horas, minutos] = hora.split(":").map(Number);
    const totalMinutos = horas * 60 + minutos;
    return totalMinutos % parseInt(fraccion) === 0;
}

function validarCampos(ctx: z.RefinementCtx, data: FieldData) {
    if (data.enable) {
        if (!data.openingHour) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["openingHour"],
                message: "Campo Requerido",
            });
        }
        if (!data.closinghour) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["closinghour"],
                message: "Campo Requerido",
            });
        }
        if (data.openingHour && data.closinghour) {
            if (data.openingHour > data.closinghour) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["custom"],
                    message: "La hora de inicio no puede ser mayor a la hora de fin",
                });
            }
        }
  }
}



export const añadirProfesionalSchema=z.
    object({
        urlImg: z
            .string({ required_error: "Campo Requerido" })
            .min(1,"Debe subir una imagen"),
        name: z
            .string({ required_error: "Campo Requerido" })
            .min(1,"Debe ingresa un nombre"),
        surename:z
            .string({ required_error: "Campo Requerido" })
            .min(1,"Debe ingresa un Apellido"),
        email: z
            .string({ required_error: "Campo Requerido" })
            .email("Email inválido"),
        birthDate: z
            .string({ required_error: "Campo Requerido" })
            .date("Debe ingresar una fecha"),
        gender: z
            .string({ required_error: "Campo Requerido" })
            .min(1,"Debe ingresa un genero"),
        phone: z
            .string({ required_error: "Campo Requerido" })
            .regex(new RegExp(/^[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/), {
                message: "Número de teléfono inválido",
            }),
        documentNumber: z
            .string({ required_error: "Campo Requerido" })
            .min(1, "Debe ingresar un número de documento"),
        specialtyId: z
            .string(),
        license: z
            .string({ required_error: "Campo Requerido" })
            .min(1, { message: "Debe ingresar un número de matrícula" }),
        //Horas de atencion ↓
        monday: z
            .object({
                enable: z.boolean(),
                openingHour: z.string().optional(),
                closinghour: z.string().optional(),
                custom: z.string().optional(),
            })
            .superRefine((data, ctx) => {
                validarCampos(ctx, data);
            }),
        tuesday: z
            .object({
                enable: z.boolean(),
                openingHour: z.string().optional(),
                closinghour: z.string().optional(),
                custom: z.string().optional(),
            })
            .superRefine((data, ctx) => {
                validarCampos(ctx, data);
            }),
        wednesday: z
            .object({
                enable: z.boolean(),
                openingHour: z.string().optional(),
                closinghour: z.string().optional(),
                custom: z.string().optional(),
            })
            .superRefine((data, ctx) => {
                validarCampos(ctx, data);
            }),
        thursday: z
            .object({
                enable: z.boolean(),
                openingHour: z.string().optional(),
                closinghour: z.string().optional(),
                custom: z.string().optional(),
            })
            .superRefine((data, ctx) => {
                validarCampos(ctx, data);
            }),
        friday: z
            .object({
                enable: z.boolean(),
                openingHour: z.string().optional(),
                closinghour: z.string().optional(),
                custom: z.string().optional(),
            })
            .superRefine((data, ctx) => {
                validarCampos(ctx, data);
            }),
        duracionTurno: z
            .enum(["15", "30", "45", "60", "90", "120"], {
                message: "La duracion del turno no es valida",
            }),
        //Horas de atencion ↑
        password: z
            .string({ required_error: "Campo Requerido" })
            .regex(new RegExp(/^[a-zA-Z0-9!@#$%^&*]{8,20}$/), {
                message: "La contraseña debe tener entre 8 y 20 caracteres \n No puede contener espacios en blanco\nDebe contener al menos un número, una letra mayúscula, una minúscula y un símbolo",
            }),
        confirmPassword: z.
            string({ required_error: "Campo Requerido" }),
    })
    .superRefine((data, ctx) => {
        const dias = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
        ] as const;
        const campos = ["openingHour", "closinghour"] as const;
        
        dias.forEach((dia) => {
            const diaData = data[dia];
            if (diaData.enable) {
                campos.forEach((campo) => {
                const hora = diaData[campo];
                    if (hora && !validarHora(hora, data.duracionTurno)) {
                        ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [dia, campo],
                        message: `La fraccion de la hora no es valida`,
                        });
                    }
                });
            }
        });
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });