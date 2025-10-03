"use client";
import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import Image from "next/image";

interface Props {
  showPassword: boolean;
  showConfirmPassword: boolean;
  toggleShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  toggleShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  values: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: FormikErrors<{
    email: string;
    password: string;
    confirmPassword: string;
  }>;
  touched: FormikTouched<{
    email: string;
    password: string;
    confirmPassword: string;
  }>;
}

export default function FormPage1({
  values,
  errors,
  touched,
  showPassword,
  showConfirmPassword,
  toggleShowPassword,
  toggleShowConfirmPassword,
}: Props) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <span className="text-center font-bold text-xl">Crea tu cuenta</span>
      <div>
        <label htmlFor="email" className="block text-gray-700">
          Correo Electrónico <span className="text-[#ff0000]">*</span>
        </label>
        <Field
          type="email"
          name="email"
          placeholder="ejemplo1234@gmail.com"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
            errors.email && touched.email && "border border-red-500"
          }`}
        />
        <ErrorMessage
          name="email"
          component="div"
          className="text-[#ff0000] text-sm "
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700">
          Contraseña <span className="text-[#ff0000]">*</span>
        </label>
        <div className="relative">
          <Field
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Ingresa una contraseña"
            className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
              errors.password && touched.password && "border border-red-500"
            }`}
          />
          <button
            type="button"
            onClick={() => toggleShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 py-2"
          >
            <Image
              src={showPassword ? "/mostrarPSW.svg" : "/ocultarPSW.svg"}
              alt={showPassword ? "Ocultar" : "Mostrar"}
              width={16}
              height={16}
            />
          </button>
        </div>
        <ErrorMessage
          name="password"
          component="div"
          className="text-[#ff0000] text-sm"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-gray-700">
          Confirmar Contraseña <span className="text-[#ff0000]">*</span>
        </label>
        <div className="relative">
          <Field
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirma tu contraseña"
            className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
              errors.confirmPassword &&
              touched.confirmPassword &&
              "border border-red-500"
            }`}
          />
          <button
            type="button"
            onClick={() => toggleShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 px-3 py-2"
          >
            <Image
              src={showConfirmPassword ? "/mostrarPSW.svg" : "/ocultarPSW.svg"}
              alt={showConfirmPassword ? "Ocultar" : "Mostrar"}
              width={16}
              height={16}
            />
          </button>
        </div>
        <ErrorMessage
          name="confirmPassword"
          component="div"
          className="text-[#ff0000] text-sm"
        />
      </div>
    </div>
  );
}