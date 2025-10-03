"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { z, ZodError } from "zod";
import BuscarTurnoList from "./BuscarTurnoList";
import { useLazyGetAppointmentsByPatientAndPractitionerQuery } from "@/app/redux/api/appointment.api";

const buscarTurnoSchema = z.object({
  dni: z
    .string({ required_error: "El DNI es requerido" })
    .regex(new RegExp(/^\d{8}$/), "El DNI debe tener 8 dígitos"),
});

interface Props {
  practitionerId: string;
}

export default function ModalBuscarTurno({ practitionerId }: Props) {
  const [trigger, { data: appointments, status, isLoading, isError }] =
    useLazyGetAppointmentsByPatientAndPractitionerQuery();
  return (
    <dialog id="buscarTurnoModal" className="modal">
      <div className="modal-box p-3.5">
        <form method="dialog">
          <button className="btn items-center border border-gray-500 btn-circle absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Buscar turnos por DNI</h3>
        <p className="py-4">
          Ingresa tu DNI para buscar los turnos con este medico/a
        </p>
        <div>
          <Formik
            initialValues={{ dni: "" }}
            validate={(values) => {
              try {
                buscarTurnoSchema.parse(values);
                return {};
              } catch (errors) {
                if (errors instanceof ZodError) {
                  // Declarar el tipo explícito para formErrors
                  const formErrors: Record<string, string> = {};

                  errors.issues.forEach((issue) => {
                    const key = issue.path[0]; // TypeScript ahora entiende que es string
                    if (typeof key === "string") {
                      formErrors[key] = issue.message;
                    }
                  });
                  return formErrors;
                }
              }
            }}
            onSubmit={(values) => {
              trigger({
                patientId: values.dni,
                practitionerId: practitionerId,
              });
            }}
          >
            <Form>
              <div className="flex flex-row gap-2">
                <Field
                  type="text"
                  name="dni"
                  placeholder="12345678"
                  className="input input-bordered w-full border border-[#078B8C]"
                />
                <button
                  className="bg-[#078B8C] rounded font-bold p-2 text-white"
                  type="submit"
                >
                  Buscar
                </button>
              </div>
              <ErrorMessage
                name="dni"
                component="div"
                className="text-red-500 text-sm"
              />
            </Form>
          </Formik>
        </div>
        {status !== "uninitialized" && (
          <BuscarTurnoList resultQuery={{ appointments, isError, isLoading }} />
        )}
      </div>
    </dialog>
  );
}
