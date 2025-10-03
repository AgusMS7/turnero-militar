"use client";

import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import Image from "next/image";
import { z, ZodError } from "zod";
import FormPage1 from "./FormPage1";
import NavigationBtn from "./NavigationBtn";
import { registroSchema } from "@/app/utils/ZodSchemas/RegistroSchema";
import { signIn } from "next-auth/react";
import FormPage3 from "./FormPage3";
import FormPage2 from "./FormPage2";
import { DocumentTypes } from "@/app/definitions/definitions";
import Swal from "sweetalert2";

export default function RegistroUsuario() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formPage, setFormPage] = useState(1);
  const [registerError, setRegisterError] = useState(false); // Estado para manejar el error de registro
  const [registerErrorMessage, setRegisterErrorMessage] = useState(""); // Mensaje de error de registro

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    lastName: "",
    gender: "",
    birth: "",
    phone: "",
    documentType: DocumentTypes.dni,
    dni: "",
    urlImg:
      "https://rybwefx6jybsfaoy.public.blob.vercel-storage.com/userStandar-7lV6py4Ynp7hbBAd4ScOksVBQYqQN2.jpg",
    license: "",
    practitionerRoleId: "5f01ee49-3b32-4fc3-a9d4-c8bbedb8a90f",
    homeService: false,
  };

  const formikRef = useRef<any>(null);

  return (
    <div className="flex items-start justify-center bg-[#E4ECEC] w-full min-h-screen p-3">
      <div className="flex flex-col items-center">
        <Image src="/logo.png" alt="Logo" width={170} height={170} />

        <h1 className="text-2xl text-black font-bold text-center mb-4">
          Te damos la bienvenida
        </h1>
        <p className="text-black text-xl text-center mb-4 mx-5">
          Crea una cuenta y gestiona tus citas desde un mismo lugar
        </p>

        <div className="relative w-full h-5">
          <Image
            src="/arrow-up.png"
            alt="Flecha Arriba"
            width={20}
            height={20}
            className="absolute top-0 right-0 h-auto"
          />
        </div>

        <div className="w-full text-black">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validate={(values) => {
              try {
                registroSchema.parse(values);
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
            onSubmit={async (data,{resetForm}) => {
              const result = await signIn("signUp-practitioner", {
                email: data.email,
                password: data.password,
                name: data.name,
                lastName: data.lastName,
                documentType: data.documentType,
                dni: data.dni,
                phone: data.phone,
                urlImg: data.urlImg,
                birth: data.birth,
                gender: data.gender,
                license: data.license,
                practitionerRole: [{
                  id:data.practitionerRoleId
                }],
              });
              console.log(result)

              if (result?.error){
                //Avisarle al usuario cual fue el error
                Swal.fire({
                  icon: "error",
                  title: "Ocurrio un error",
                  text: `${result?.error}`,
                  timer: 6000,
                  timerProgressBar: true,
                });
                
                setRegisterError(true); // Activar error de registro
                setRegisterErrorMessage(result.error); // Establecer mensaje de error
                resetForm(); // Reiniciar el formulario
              }else{
                setRegisterError(false); // Desactivar error de registro
                setRegisterErrorMessage(""); // Limpiar mensaje de error
                resetForm(); // Reiniciar el formulario
              }
            }}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <div className="space-y-2 px-1">
                  {registerError && (
                    <div className="bg-red-200 text-red-800 p-2 rounded-md">
                      Error al registrar el usuario. Por favor, verifica tus datos.
                    </div>
                  )}
                  <div className={formPage === 1 ? "block" : "hidden"}>
                    <FormPage1
                      values={values}
                      errors={errors}
                      touched={touched}
                      showPassword={showPassword}
                      showConfirmPassword={showConfirmPassword}
                      toggleShowConfirmPassword={setShowConfirmPassword}
                      toggleShowPassword={setShowPassword}
                    />
                  </div>
                  <div className={formPage === 2 ? "block" : "hidden"}>
                    <FormPage2
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                  <div className={formPage === 3 ? "block" : "hidden"}>
                    <FormPage3
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="relative w-full h-5">
          <Image
            src="/arrow-down.png"
            alt="Flecha Abajo"
            width={20}
            height={20}
            className="absolute top-0 right-0 h-auto"
          />
        </div>
        <div className="w-full">
          <NavigationBtn
            pageNumber={formPage}
            setPageNumber={setFormPage}
            formRef={formikRef}
          />
        </div>
      </div>
    </div>
  );
}
