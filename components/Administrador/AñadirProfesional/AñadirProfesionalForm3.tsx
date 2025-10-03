import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import Image from "next/image";
import { useState } from "react";

interface Props{
  values:{
    password:string;
    confirmPassword:string;
  };
  errors:FormikErrors<{
    password:string;
    confirmPassword:string;
  }>;
  touched:FormikTouched<{
    password:string;
    confirmPassword:string;
  }>;
}

export function AñadirProfesionalForm3({values,errors,touched}:Props){

  const [showPassword,setShowPassword]=useState(false)

  const [showConfirmPassword,setShowConfirmPassword]=useState(false)

  return (
    <div className="flex flex-col justify-center md:pl-60 md:pr-60 gap-8">
      <div className="flex flex-col gap-3">
        <div>{/*Contraseña*/}
          <label className="text-xl" htmlFor="name">Ingresa contraseña</label>
          <div className={`relative`}>
            <Field
              type={showPassword?"text":"password"}
              name="password"
              placeholder="*************"
              className={`flex flex-row border justify-between border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
              errors.password && touched.password && "border border-red-500"
            }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 py-2"
            >
              <Image
                className="hover:cursor-pointer"
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
            className="text-[#ff0000] text-sm "
          />
        </div>
        <div>{/*Repetir Contraseña*/}
          <label className="text-xl" htmlFor="name">Repetir contraseña</label>
          <div className={`relative`}>
            <Field
              type={showConfirmPassword?"text":"password"}
              name="confirmPassword"
              placeholder="*************"
              className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
              errors.confirmPassword && touched.confirmPassword && "border border-red-500"
            }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 px-3 py-2"
            >
              <Image
                className="hover:cursor-pointer"
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
            className="text-[#ff0000] text-sm "
          />
        </div>
      </div>
    </div>
  )
}
