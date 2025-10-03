"use client";

import { horarioAtencionSchema } from "@/app/utils/ZodSchemas/HorarioAtencionSchema";
import { Field, Form, Formik } from "formik";
import { SetStateAction } from "react";
import { ZodError } from "zod";

interface Props {
  setModify: React.Dispatch<SetStateAction<boolean>>;
}

export default function HoraAtencionForm({ setModify }: Props) {
  return (
    <div className="p-4 rounded-lg bg-white mt-4">
      <span className="text-gray-700">
        Seleccione su horario de trabajo en el transcurso de la semana
      </span>
      <Formik
        enableReinitialize
        initialValues={{
          lunes: {
            enable: false,
            horaInicio: "",
            horaFin: "",
            custom: "",
          },
          martes: { enable: false, horaInicio: "", horaFin: "", custom: "" },
          miercoles: { enable: false, horaInicio: "", horaFin: "", custom: "" },
          jueves: { enable: false, horaInicio: "", horaFin: "", custom: "" },
          viernes: { enable: false, horaInicio: "", horaFin: "", custom: "" },
          sabado: { enable: false, horaInicio: "", horaFin: "", custom: "" },
          domingo: { enable: false, horaInicio: "", horaFin: "", custom: "" },
          duracionTurno: "15",
        }}
        validate={(values) => {
          try {
            horarioAtencionSchema.parse(values);
            return {};
          } catch (errors) {
            if (errors instanceof ZodError) {
              // Declarar el tipo explícito para formErrors
              const formErrors: Record<string, any> = {};

              for (const issue of errors.issues) {
                const [first, second] = issue.path;

                if (second !== undefined) {
                  if (!formErrors[first]) {
                    formErrors[first] = {};
                  }
                  formErrors[first][second] = issue.message;
                } else {
                  formErrors[first] = issue.message;
                }
              }
              console.log("formErrors", formErrors);
              return formErrors;
            }
          }
        }}
        onSubmit={async (values) => {
          console.log("values", values);
        }}
      >
        {({ values, errors, touched }) => {
          return (
            <Form className="space-y-2 mt-2">
              <div className="space-y-2">
                <span className="inline-flex gap-2 items-center">
                  <Field
                    type="checkbox"
                    name="lunes.enable"
                    className="toggle toggle-success toggle-sm"
                  />{" "}
                  Lunes
                </span>
                <div
                  className={values.lunes.enable ? "block space-y-2" : "hidden"}
                >
                  <div className="flex gap-3 items-center">
                    <span>Desde</span>
                    <Field
                      type="time"
                      name="lunes.horaInicio"
                      min="07:00"
                      max="23:00"
                      className={`input input-sm w-full max-w-xs ${
                        errors.lunes?.horaInicio &&
                        touched.lunes?.horaInicio &&
                        "border border-red-500"
                      }`}
                    />

                    <span>Hasta</span>
                    <Field
                      type="time"
                      name="lunes.horaFin"
                      min="07:00"
                      max="23:00"
                      className={`input input-bordered input-sm w-full max-w-xs ${
                        errors.lunes?.horaFin &&
                        touched.lunes?.horaFin &&
                        "border border-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    {errors.lunes?.horaInicio && touched.lunes?.horaInicio && (
                      <span className="text-red-500 text-sm">
                        {errors.lunes.horaInicio}
                      </span>
                    )}
                    {errors.lunes?.horaFin && touched.lunes?.horaFin && (
                      <span className="text-red-500 text-sm">
                        {errors.lunes.horaFin}
                      </span>
                    )}
                    <span className="text-red-500 text-sm">
                      {errors.lunes?.custom || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="inline-flex gap-2 items-center">
                  <Field
                    type="checkbox"
                    name="martes.enable"
                    className="toggle toggle-success toggle-sm"
                  />{" "}
                  Martes
                </span>
                <div
                  className={
                    values.martes.enable ? "block space-y-2" : "hidden"
                  }
                >
                  <div className="flex gap-3 items-center">
                    <span>Desde</span>
                    <Field
                      type="time"
                      name="martes.horaInicio"
                      min="07:00"
                      max="23:00"
                      className={`input input-sm w-full max-w-xs ${
                        errors.martes?.horaInicio &&
                        touched.martes?.horaInicio &&
                        "border border-red-500"
                      }`}
                    />

                    <span>Hasta</span>
                    <Field
                      type="time"
                      name="martes.horaFin"
                      min="07:00"
                      max="23:00"
                      className={`input input-sm w-full max-w-xs ${
                        errors.martes?.horaFin &&
                        touched.martes?.horaFin &&
                        "border border-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    {errors.martes?.horaInicio &&
                      touched.martes?.horaInicio && (
                        <span className="text-red-500 text-sm">
                          {errors.martes.horaInicio}
                        </span>
                      )}
                    {errors.martes?.horaFin && touched.martes?.horaFin && (
                      <span className="text-red-500 text-sm">
                        {errors.martes.horaFin}
                      </span>
                    )}
                    <span className="text-red-500 text-sm">
                      {errors.martes?.custom || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="inline-flex gap-2 items-center">
                  <Field
                    type="checkbox"
                    name="miercoles.enable"
                    className="toggle toggle-success toggle-sm"
                  />{" "}
                  Miercoles
                </span>
                <div
                  className={
                    values.miercoles.enable ? "block space-y-2" : "hidden"
                  }
                >
                  <div className="flex gap-3 items-center">
                    <span>Desde</span>
                    <Field
                      type="time"
                      name="miercoles.horaInicio"
                      min="07:00"
                      max="23:00"
                      className={`input input-sm w-full max-w-xs ${
                        errors.miercoles?.horaInicio &&
                        touched.miercoles?.horaInicio &&
                        "border border-red-500"
                      }`}
                    />

                    <span>Hasta</span>
                    <Field
                      type="time"
                      name="miercoles.horaFin"
                      min="07:00"
                      max="23:00"
                      className={`input input-sm w-full max-w-xs ${
                        errors.miercoles?.horaFin &&
                        touched.miercoles?.horaFin &&
                        "border border-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    {errors.miercoles?.horaInicio &&
                      touched.miercoles?.horaInicio && (
                        <span className="text-red-500 text-sm">
                          {errors.miercoles.horaInicio}
                        </span>
                      )}
                    {errors.miercoles?.horaFin &&
                      touched.miercoles?.horaFin && (
                        <span className="text-red-500 text-sm">
                          {errors.miercoles.horaFin}
                        </span>
                      )}
                    <span className="text-red-500 text-sm">
                      {errors.miercoles?.custom || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="inline-flex gap-2 items-center">
                  <Field
                    type="checkbox"
                    name="jueves.enable"
                    className="toggle toggle-success toggle-sm"
                  />{" "}
                  Jueves
                </span>
                <div
                  className={
                    values.jueves.enable ? "block space-y-2" : "hidden"
                  }
                >
                  <div className="flex gap-3 items-center">
                    <span>Desde</span>
                    <Field
                      type="time"
                      name="jueves.horaInicio"
                      min="07:00"
                      max="23:00"
                      className={`border input input-sm w-full max-w-xs ${
                        errors.jueves?.horaInicio &&
                        touched.jueves?.horaInicio &&
                        "border border-red-500"
                      }`}
                    />

                    <span>Hasta</span>
                    <Field
                      type="time"
                      name="jueves.horaFin"
                      min="07:00"
                      max="23:00"
                      className={`border input input-sm w-full max-w-xs ${
                        errors.jueves?.horaFin &&
                        touched.jueves?.horaFin &&
                        "border border-red-500"
                      }`}
                    />
                  </div>

                  <div className="flex flex-col text-center">
                    {errors.jueves?.horaInicio &&
                      touched.jueves?.horaInicio && (
                        <span className="text-red-500 text-sm">
                          {errors.jueves.horaInicio}
                        </span>
                      )}
                    {errors.jueves?.horaFin && touched.jueves?.horaFin && (
                      <span className="text-red-500 text-sm">
                        {errors.jueves.horaFin}
                      </span>
                    )}
                    <span className="text-red-500 text-sm">
                      {errors.jueves?.custom || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="inline-flex gap-2 items-center">
                  <Field
                    type="checkbox"
                    name="viernes.enable"
                    className="toggle toggle-success toggle-sm"
                  />{" "}
                  Viernes
                </span>
                <div
                  className={
                    values.viernes.enable ? "block space-y-2" : "hidden"
                  }
                >
                  <div className="flex gap-3 items-center">
                    <span>Desde</span>
                    <Field
                      type="time"
                      name="viernes.horaInicio"
                      min="07:00"
                      max="23:00"
                      className={`border input input-sm w-full max-w-xs ${
                        errors.viernes?.horaFin &&
                        touched.viernes?.horaFin &&
                        "border border-red-500"
                      }`}
                    />

                    <span>Hasta</span>
                    <Field
                      type="time"
                      name="viernes.horaFin"
                      min="07:00"
                      max="23:00"
                      className={`border input input-sm w-full max-w-xs ${
                        errors.viernes?.horaInicio &&
                        touched.viernes?.horaInicio &&
                        "border border-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    {errors.viernes?.horaInicio &&
                      touched.viernes?.horaInicio && (
                        <span className="text-red-500 text-sm">
                          {errors.viernes.horaInicio}
                        </span>
                      )}
                    {errors.viernes?.horaFin && touched.viernes?.horaFin && (
                      <span className="text-red-500 text-sm">
                        {errors.viernes.horaFin}
                      </span>
                    )}
                    <span className="text-red-500 text-sm">
                      {errors.viernes?.custom || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <span className="inline-flex gap-2 items-center">
                  <Field
                    type="checkbox"
                    name="sabado.enable"
                    className="toggle toggle-success toggle-sm"
                  />{" "}
                  Sabado
                </span>
                <div
                  className={
                    values.sabado.enable ? "block space-y-2" : "hidden"
                  }
                >
                  <div className="flex gap-3 items-center">
                    <span>Desde</span>
                    <Field
                      type="time"
                      name="sabado.horaInicio"
                      min="07:00"
                      max="23:00"
                      className={`border input input-sm w-full max-w-xs ${
                        errors.sabado?.horaInicio &&
                        touched.sabado?.horaInicio &&
                        "border border-red-500"
                      }`}
                    />

                    <span>Hasta</span>
                    <Field
                      type="time"
                      name="sabado.horaFin"
                      min="07:00"
                      max="23:00"
                      className={`border input input-sm w-full max-w-xs ${
                        errors.sabado?.horaFin &&
                        touched.sabado?.horaFin &&
                        "border border-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    {errors.sabado?.horaInicio &&
                      touched.sabado?.horaInicio && (
                        <span className="text-red-500 text-sm">
                          {errors.sabado.horaInicio}
                        </span>
                      )}
                    {errors.sabado?.horaFin && touched.sabado?.horaFin && (
                      <span className="text-red-500 text-sm">
                        {errors.sabado.horaFin}
                      </span>
                    )}
                    <span className="text-red-500 text-sm">
                      {errors.sabado?.custom || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <span className="inline-flex gap-2 items-center">
                  <Field
                    type="checkbox"
                    name="domingo.enable"
                    className="toggle toggle-success toggle-sm"
                  />{" "}
                  Domingo
                </span>
                <div
                  className={
                    values.domingo.enable ? "block space-y-2" : "hidden"
                  }
                >
                  <div className="flex gap-3 items-center">
                    <span>Desde</span>
                    <Field
                      type="time"
                      name="domingo.horaInicio"
                      min="07:00"
                      max="23:00"
                      className={`border input input-sm w-full max-w-xs ${
                        errors.domingo?.horaInicio &&
                        touched.domingo?.horaInicio &&
                        "border border-red-500"
                      }`}
                    />

                    <span>Hasta</span>
                    <Field
                      type="time"
                      name="domingo.horaFin"
                      min="07:00"
                      max="23:00"
                      className={`border input input-sm w-full max-w-xs ${
                        errors.domingo?.horaFin &&
                        touched.domingo?.horaFin &&
                        "border border-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    {errors.domingo?.horaInicio &&
                      touched.domingo?.horaInicio && (
                        <span className="text-red-500 text-sm">
                          {errors.domingo.horaInicio}
                        </span>
                      )}
                    {errors.domingo?.horaFin && touched.domingo?.horaFin && (
                      <span className="text-red-500 text-sm">
                        {errors.domingo.horaFin}
                      </span>
                    )}
                    <span className="text-red-500 text-sm">
                      {errors.domingo?.custom || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-gray-700">Duracion del turno</span>
                <Field as="select" name="duracionTurno" className="select">
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 hora y 30 minutos</option>
                  <option value="120">2 horas</option>
                </Field>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setModify(false)}
                  className="btn rounded-lg text-[#48a7a8] border-2 border-[#48a7a8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn rounded-lg bg-[#48a7a8] text-white font-bold"
                >
                  Guardar
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
