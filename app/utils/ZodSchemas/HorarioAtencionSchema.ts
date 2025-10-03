import { z } from "zod";

interface FieldData {
  enable: boolean;
  horaInicio?: string;
  horaFin?: string;
}

function validarHora(hora: string, fraccion: string) {
  const [horas, minutos] = hora.split(":").map(Number);
  const totalMinutos = horas * 60 + minutos;
  return totalMinutos % parseInt(fraccion) === 0;
}

function validarCampos(ctx: z.RefinementCtx, data: FieldData) {
  if (data.enable) {
    if (!data.horaInicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["horaInicio"],
        message: "Campo Requerido",
      });
    }
    if (!data.horaFin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["horaFin"],
        message: "Campo Requerido",
      });
    }
    if (data.horaInicio && data.horaFin) {
      if (data.horaInicio > data.horaFin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["custom"],
          message: "La hora de inicio no puede ser mayor a la hora de fin",
        });
      }
    }
  }
}

export const horarioAtencionSchema = z
  .object({
    lunes: z
      .object({
        enable: z.boolean(),
        horaInicio: z.string().optional(),
        horaFin: z.string().optional(),
        custom: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        validarCampos(ctx, data);
      }),
    martes: z
      .object({
        enable: z.boolean(),
        horaInicio: z.string().optional(),
        horaFin: z.string().optional(),
        custom: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        validarCampos(ctx, data);
      }),
    miercoles: z
      .object({
        enable: z.boolean(),
        horaInicio: z.string().optional(),
        horaFin: z.string().optional(),
        custom: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        validarCampos(ctx, data);
      }),
    jueves: z
      .object({
        enable: z.boolean(),
        horaInicio: z.string().optional(),
        horaFin: z.string().optional(),
        custom: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        validarCampos(ctx, data);
      }),
    viernes: z
      .object({
        enable: z.boolean(),
        horaInicio: z.string().optional(),
        horaFin: z.string().optional(),
        custom: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        validarCampos(ctx, data);
      }),
    sabado: z
      .object({
        enable: z.boolean(),
        horaInicio: z.string().optional(),
        horaFin: z.string().optional(),
        custom: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        validarCampos(ctx, data);
      }),
    domingo: z
      .object({
        enable: z.boolean(),
        horaInicio: z.string().optional(),
        horaFin: z.string().optional(),
        custom: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        validarCampos(ctx, data);
      }),
    duracionTurno: z.enum(["15", "30", "45", "60", "90", "120"], {
      message: "La duracion del turno no es valida",
    }),
  })
  .superRefine((data, ctx) => {
    const dias = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ] as const;
    const campos = ["horaInicio", "horaFin"] as const;

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
  });
