import React, { useRef, useState } from 'react'
import Swal from 'sweetalert2';
import { CreateSecretary, DocumentTypes } from '@/app/definitions/definitions';
import { ZodError } from 'zod';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCreateSecretaryMutation } from '@/app/redux/api/secretary.api';
import { NavigationButtons } from './NavigationButtons';
import { AñadirSecretarioForm1 } from './AñadirSecretarioForm1';
import { AñadirSecretarioForm2 } from './AñadirSecretarioForm2';
import { AñadirSecretariaSchema } from '@/app/utils/ZodSchemas/AñadirSecretarioSchema';



const initialValues = {
  urlImg: "/UserIconPlaceholder.jpg",
  name: "",
  surename: "",
  email: "",
  birthDate: "",
  gender: "",
  phone: "",
  documentType: DocumentTypes.dni,
  documentNumber: "",
  password: "",
  confirmPassword: "",
}
export function AñadirSecretario() {

  const router = useRouter();

  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [createSecretary, {
    isLoading,
  }] = useCreateSecretaryMutation()


  const formikRef = useRef<any>(null)

  const [currentFormSteap, setCurrentFormSteap] = useState(0)

  return (
    <div className='flex flex-row w-full min-h-screen md:h-fit h-full max-md:p-2'>
      <div className='md:flex hidden flex-col w-4/12  min-h-screen bg-[#CDE8E8] items-start md:p-5 p-0.5'>{/*Sidebar*/}
        <p className='text-center w-full md:text-3xl text-xs'>
          <b>Agregar Secretario</b>
        </p>
        <div className=' w-full flex flex-col h-full justify-center items-start'>
          <div className='w-full h-13 relative'>
            <div className={currentFormSteap == 0 ? `text-transparent h-full bg-[#078B8C] rounded-[8px]` : `text-transparent`} />
            <p className={`absolute top-0 w-full h-full flex items-center justify-start ${currentFormSteap == 0 ? `2xl:text-3xl xl:text-2xl text-2xs text-white md:ml-4 ml-0.5` : `2xl:text-2xl xl:text-[18px] text-xs`}`}>
              Datos personales
            </p>
          </div>
          <div className='w-full h-13 relative'>
            <div className={currentFormSteap == 1 ? `text-transparent h-full bg-[#078B8C] rounded-[8px]` : `text-transparent`} />
            <p className={`absolute top-0 w-full h-full flex items-center justify-start ${currentFormSteap == 1 ? `2xl:text-3xl xl:text-2xl text-2xs text-white md:ml-4 ml-0.5` : `2xl:text-2xl xl:text-[18px] text-xs`}`}>
              Acceso a la plataforma
            </p>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col justify-between  gap-18'>
        <div>{/*Inputs*/}
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validate={(values) => {
              try {
                AñadirSecretariaSchema.parse(values);
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
                  return formErrors;
                }
              }
            }}
            onSubmit={async (values, { resetForm }) => {
              const secretaryData: CreateSecretary = {
                name: values.name,
                lastName: values.surename,
                email: values.email,
                password: values.password,
                gender: values.gender,
                birth: values.birthDate,
                urlImg: values.urlImg,
                googleBool: false,
                documentType: DocumentTypes.dni,
                dni: values.documentNumber,
                phone: values.phone,
              }
              const response = await createSecretary({
                token: token,
                entity: secretaryData
              })
              if (response.error) {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: `Ocurrio un error durante la creacion del secretario, por favor intente mas tarde.`,
                  timer: 4000,
                  timerProgressBar: true,
                })
              }
              if (response.data) {
                Swal.fire({
                  icon: "success",
                  title: "¡Exito!",
                  text: `Secretario creado correctamente`,
                  timer: 2000,
                  timerProgressBar: true,
                }).then(() => {
                  resetForm()
                  router.push(
                    `/administrator/secretarias`
                  )
                })
              }
            }}
          >
            {({ values, errors, touched, setFieldValue }) =>
            (
              <Form>
                {
                  currentFormSteap == 0 ?
                    <AñadirSecretarioForm1
                      setFieldValue={setFieldValue}
                      values={values}
                      errors={errors}
                      touched={touched}
                    /> :
                    <AñadirSecretarioForm2
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                }
                <div className='w-full mt-20'>{/*Botones de navegacion*/}
                  <NavigationButtons
                    currentSteap={currentFormSteap}
                    setCurrentSteap={setCurrentFormSteap}
                    formikRef={formikRef}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
