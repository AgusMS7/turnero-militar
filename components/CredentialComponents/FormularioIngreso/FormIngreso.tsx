"use client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Formik } from "formik";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { z, ZodError } from "zod";
import BotonRegistro from "./BotonRegistro";
import { useRouter } from "next/navigation";

interface FormProps {
  onForgotPassword: Dispatch<SetStateAction<boolean>>;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Formato de Email Invalido" }),
  contraseña: z
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

const Form: FC<FormProps> = ({ onForgotPassword }) => {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [loginError, setLoginError] = useState(false); // Estado para manejar el error de login
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        email: "",
        contraseña: "",
      }}
      validate={(values) => {
        try {
          loginSchema.parse(values);
          return {};
        } catch (errors) {
          if (errors instanceof ZodError) {
            const formErrors: Record<string, string> = {};
            errors.issues.forEach((issue) => {
              const key = issue.path[0];
              if (typeof key === "string") {
                formErrors[key] = issue.message;
              }
            });
            return formErrors;
          }
        }
      }}
      onSubmit={async (values, { setErrors }) => {
        if (isLoading) return;

        setIsLoading(true); // Activar estado de carga
        setLoginError(false); // Reiniciar error de login

        const { email, contraseña } = values;

        try {
          const result = await signIn("signIn", {
            email,
            password: contraseña,
            redirect: false,
          });

          if (result?.error) {
            setLoginError(true);
            setLoginErrorMessage(result.error);
            setIsLoading(false);
          } else if (result?.ok) {
            router.push("/");
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setLoginError(true);
          setLoginErrorMessage("Error de conexión");
          setIsLoading(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
      }) => (
        <div className="flex flex-col items-center w-[350px] h-[575px] bg-[#F1F1F1] mt-[22px] mb-[25px] rounded-lg">
          <form
            id="loginForm"
            className="mt-6 p-2 w-full"
            onSubmit={handleSubmit}
          >
            {/* Campo de email */}
            <div className="flex flex-col mb-6 relative">
              <label
                htmlFor="email"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Ingrese su email<span className="text-[#F00]">*</span>
              </label>
              <Image
                src={"/mail.svg"}
                alt="Correo"
                width={24}
                height={24}
                className="absolute left-3 top-10 transform"
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo1234@gmail.com"
                className={`p-[10px] border border-[#A4D4D4] rounded pl-10 focus:outline-none bg-[#F1F1F1] focus:ring-2 focus:ring-blue-400 text-gray-800 ${
                  touched.email && errors.email ? "border-red-600" : ""
                } `}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Campo de contraseña */}
            <div className="flex flex-col relative">
              <label
                htmlFor="contraseña"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Ingrese su contraseña<span className="text-[#F00]">*</span>
              </label>
              <Image
                src={"/password.svg"}
                alt="Contraseña"
                width={24}
                height={24}
                className="absolute left-3 top-10 transform"
              />
              <input
                type="password"
                id="contraseña"
                name="contraseña"
                placeholder="************"
                className={`p-[10px] border border-[#A4D4D4] pl-10 rounded focus:outline-none bg-[#F1F1F1] focus:ring-2 focus:ring-blue-400 text-gray-800 ${
                  touched.contraseña && errors.contraseña && "border-red-600"
                }`}
                value={values.contraseña}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.contraseña && errors.contraseña && (
                <p className="text-red-600 text-sm">{errors.contraseña}</p>
              )}
            </div>

            {/* Mensaje de error de login */}
            {loginError && (
              <p className="text-red-600 text-center text-sm">
                {loginErrorMessage}
              </p>
            )}
            {/* No tengo cuenta*/}
            <a
            href="/register"
              className="mt-2 text-sm flex justify-end underline cursor-pointer text-blue-500"
            >
              ¿No tienes cuenta? Creala aqui
            </a>
            {/* Olvidé mi contraseña */}
            <p
              className="mt-2 text-sm flex justify-end underline cursor-pointer text-blue-500"
              onClick={() => onForgotPassword(true)}
            >
              ¿Olvidaste tu contraseña?
            </p>

            {/* Botón de ingreso */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-4/5 h-[60px] p-4 bg-[#078B8C] rounded-lg flex items-center justify-center text-white text-xl font-normal leading-7 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {isLoading ? "Cargando..." : "Ingresar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default Form;
