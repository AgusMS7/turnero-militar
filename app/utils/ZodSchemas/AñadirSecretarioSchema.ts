import { z } from "zod";

export const AñadirSecretariaSchema=z.
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
        password: z
            .string({ required_error: "Campo Requerido" })
            .regex(new RegExp(/^(?=.*\d)[a-zA-Z0-9!@#$%^&*]{8,20}$/), {
                message: "La contraseña debe tener entre 8 y 20 caracteres \n No puede contener espacios en blanco\nDebe contener al menos un número, una letra mayúscula, una minúscula y un símbolo",
            }),
        confirmPassword: z.
            string({ required_error: "Campo Requerido" }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });