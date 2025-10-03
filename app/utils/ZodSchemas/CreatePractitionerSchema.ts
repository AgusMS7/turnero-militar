import { z } from 'zod';

export const CreatePractitionerSchema = z.object({
  // Campos del UserDto que son obligatorios
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(20, 'La contraseña no puede tener más de 20 caracteres')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),

  // Campos específicos del PractitionerDto
  dni: z.string()
    .regex(/^\d{8}$/, 'El DNI debe ser un número de 8 dígitos'),

  email: z.string()
    .email('El formato del correo electrónico es inválido'),

  acceptedSocialWorks: z.boolean(),

  // Campos opcionales que decidiste usar
  license: z.string()
    .optional(),

  professionalDegreeId: z.string()
    .optional(),

  // NOTA: Los siguientes campos del DTO original se omiten
  // porque indicaste que no los necesitas en este formulario.
  // durationAppointment?: number;
  // homeService?: boolean;
  // appointmentSlot?: CreateAppointmentSlotDto[];
  // consultationTime: string;
  // socialWorkDetails?: PractitionerSocialWorkDetailDto[];
});

// Puedes inferir el tipo de TypeScript del schema para usarlo en tu código
export type CreatePractitionerFormValues = z.infer<typeof CreatePractitionerSchema>;