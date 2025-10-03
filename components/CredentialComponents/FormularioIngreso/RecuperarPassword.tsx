import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { FC, useState } from "react";
import BotonRegistro from "./BotonRegistro";
import { z, ZodError } from "zod";
import Swal from "sweetalert2";
import { useForgotPasswordMutation } from "@/app/redux/api/authentication.api";

interface recuperarPassProps {
  onForgotPassword: () => void;
}
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Por favor ingrese un correo electrónico"),
});
export const RecuperarPassword: FC<recuperarPassProps> = ({
  onForgotPassword,
}) => {
  const [forgotPassword, { error }] = useForgotPasswordMutation();
  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validate={(values) => {
        try {
          forgotPasswordSchema.parse(values);
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
      onSubmit={async (values, { resetForm }) => {
        Swal.fire({
          title: "Enviando correo...",
          text: "Por favor espere un momento",
          allowOutsideClick: false,
          didOpen: async () => {
            try {
              const result = await forgotPassword(values.email).unwrap();
              if (error) {
                Swal.close();
                Swal.fire({
                  icon: "error",
                  title: "Error al enviar correo",
                  text: "Ocurrió un error al enviar el correo",
                  //Con esto le damos un poco de tiempo al usuario para leer el contenido del popup
                  timer: 3000,
                  timerProgressBar: true,
                });
                resetForm();
              } else {
                Swal.close();
                Swal.fire({
                  icon: "success",
                  title: "Correo enviado",
                  text: "Se ha enviado un correo para recuperar la contraseña \n Verifica tu bandeja de entrada",
                  //Con esto le damos un poco de tiempo al usuario para leer el contenido del popup
                  timer: 3000,
                  timerProgressBar: true,
                }).then(() => {
                  resetForm();
                  window.location.href = "/login";
                });
              }
            } catch (error) {
              Swal.close();
              Swal.fire({
                icon: "error",
                title: "Error al enviar correo",
                text: "Ocurrió un error al enviar el correo",
                timer: 100000,
                timerProgressBar: true,
                //Con esto le damos un poco de tiempo al usuario para leer el contenido del popup
                willClose: () => {
                  window.location.replace("/");
                },
              });
              resetForm();
              console.log(error);
              //window.location.replace("/");
            }
          },
        });
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="flex flex-col bg-[#F1F1F1] mt-[22px] mb-[25px] rounded-lg p-4">
            <Image
              src={"/arrow-left.svg"}
              alt=""
              width={10}
              height={10}
              className="mt-3"
              onClick={onForgotPassword}
            />

            <h2 className="mt-3 mb-3 font-semibold text-base text-[#1F1F1F] ">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="mb-2 text-sm font-medium text-gray-700">
              No te preocupes te enviaremos un e-mail para que puedas
              recuperarla.
            </p>
            <div className="flex flex-col mb-6 w-full relative">
              <label
                htmlFor="email"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Ingrese su email<span className="text-[#F00]">*</span>
              </label>

              <Image
                src={"/mail.svg"}
                alt=""
                width={24}
                height={24}
                className="absolute left-3 top-10 transform"
              />
              <Field
                type="email"
                name="email"
                placeholder="ejemplo1234@gmail.com"
                className="p-[10px] border rounded pl-10 focus:outline-none bg-[#F1F1F1] focus:ring-2 focus:ring-blue-400 text-gray-800"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div className="flex justify-center mt-[77px]">
              <button className="btn rounded-lg p-8 w-full bg-[#078B8C]">
                <span className="text-white font-bold">Enviar correo</span>
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default RecuperarPassword;
