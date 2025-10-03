"use client";
import { z, ZodError } from "zod";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useResetPasswordMutation } from "@/app/redux/api/authentication.api";
import Swal from "sweetalert2";
import { TokenWithEntity } from "@/app/definitions/definitions";
import Image from "next/image";
import Link from "next/link";

interface Props {
  token: string;
}

const passwordSchema = z.object({
  password: z
    .string({ message: "Debe insertar una contraseña" })
    .refine((password) => password.length >= 8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    })
    .refine((password) => password.length <= 20, {
      message: "La contraseña debe tener menos de 20 caracteres",
    })
    .refine((password) => !/\s/.test(password), {
      message: "La contraseña no puede contener espacios en blanco",
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: "La contraseña debe contener al menos una letra mayúscula",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "La contraseña debe contener al menos una letra minúscula",
    })
    .refine((password) => /\d/.test(password), {
      message: "La contraseña debe contener al menos un número",
    }),
});
export default function FormRecoverPassword({ token }: Props) {
  const [resetPassword, { error }] = useResetPasswordMutation();

  return (
    <Formik
      initialValues={{ password: "" }}
      validate={(values) => {
        try {
          passwordSchema.parse(values);
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
      onSubmit={async (values) => {
        try {
          Swal.fire({
            title: "Cambiando contraseña...",
            text: "Por favor espere un momento",
            allowOutsideClick: false,
            didOpen: () => {
              const data: TokenWithEntity = {
                token: token,
                entity: {
                  password: values.password,
                },
              };
              Swal.close();
              const result = resetPassword(data).unwrap();
              if (error) {
                Swal.close();
                Swal.fire({
                  icon: "error",
                  title: "Error al cambiar contraseña",
                  text: "Ocurrió un error al cambiar la contraseña",
                  //Con esto le damos un poco de tiempo al usuario para leer el contenido del popup
                  //Para evitar hacerle perder tiempo al usuario puse un tiempo de solo 2 segundos
                  timer: 2000,
                  timerProgressBar: true,
                });
              } else {
                Swal.close();
                Swal.fire({
                  icon: "success",
                  title: "Contraseña cambiada",
                  text: "Se ha cambiado la contraseña con éxito",
                  //Con esto le damos un poco de tiempo al usuario para leer el contenido del popup
                  //Para evitar hacerle perder tiempo al usuario puse un tiempo de solo 2 segundos
                  timer: 2000,
                  timerProgressBar: true,
                }).then(() => {
                  window.location.href = "/login";
                });
              }
            },
          });
        } catch (error) {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Error al cambiar contraseña",
            text: "Ocurrió un error al cambiar la contraseña",
            //Con esto le damos un poco de tiempo al usuario para leer el contenido del popup
            //Para evitar hacerle perder tiempo al usuario puse un tiempo de solo 2 segundos
            timer: 2000,
            timerProgressBar: true
          });
        }
      }}
    >
      <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
        <Form>
          <div className="flex flex-col gap-10 items-center p-12 w-[440px] bg-[#F1F1F1] rounded-2xl shadow-lg">
            <div className="flex items-center justify-start w-full mb-1">
              <Link href="/">
                <Image src={"/arrow-left.svg"} alt="regresar" width={12} height={12} />
              </Link>
            </div>
            <div className="w-full flex flex-col gap-1 mb-1">
              <h2 className="text-xl font-bold text-[#078B8C] text-center mb-2 mt-0">
               Introduzca una nueva contraseña
              </h2>
              <p className="text-center text-gray-700 text-base leading-relaxed mt-2">
                Por seguridad, <strong>tienes 15 minutos</strong> para completar el
                cambio de contraseña, sino, tendrás que volver a solicitar el cambio
                de contraseña.
              </p>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-semibold text-md text-gray-800"
              >
                Contraseña nueva
              </label>
              <Field
                type="password"
                name="password"
                placeholder="Ingrese su nueva contraseña"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#078B8C] transition"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm w-full text-left"
              />
            </div>
            <button
              type="submit"
              className="btn bg-[#078B8C] w-full rounded-lg p-3 text-white font-semibold hover:bg-[#056e6e] transition"
            >
              Enviar
            </button>
          </div>
        </Form>
      </div>
    </Formik>
  );
}
