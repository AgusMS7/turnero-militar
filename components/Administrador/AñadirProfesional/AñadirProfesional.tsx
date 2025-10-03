import { Form, Formik } from 'formik'
import React, { useRef, useState } from 'react'
import { AñadirProfesionalForm1 } from './AñadirProfesionalForm1'
import { AñadirProfesionalForm2 } from './AñadirProfesionalForm2'
import { AñadirProfesionalForm3 } from './AñadirProfesionalForm3'
import { NavigationButtons } from './NavigationButtons'
import { DocumentTypes, Gender, Practitioner } from '@/app/definitions/definitions'
import { añadirProfesionalSchema } from '@/app/utils/ZodSchemas/AñadirProfesionalSchema'
import { ZodError } from 'zod'
import { useCreatePractitionerMutation } from '@/app/redux/api/practitioner.api'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation';

interface AppointmentSlots {
  enable: boolean;
  openingHour: string;
  closinghour: string;
  custom: string;
}

const getAppointmetDateSlots = (slots: AppointmentSlots[]) => {
  const appSlots: {
    schedules: {
      openingHour: string,
      closeHour: string,
    }[],
    day: string
  }[] = []
  let a = 0
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  slots.forEach((slot) => {
    if (slot.enable) {
      appSlots.push({
        schedules: [{
          openingHour: slot.openingHour,
          closeHour: slot.closinghour,
        }],
        day: dayNames[a],
      })
    }
    a += 1
  })
  return appSlots
}


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
  specialtyId: "",
  license: "",
  monday: {
    enable: false,
    openingHour: "",
    closinghour: "",
    custom: "",
  },
  tuesday: {
    enable: false,
    openingHour: "",
    closinghour: "",
    custom: "",
  },
  wednesday: {
    enable: false,
    openingHour: "",
    closinghour: "",
    custom: "",
  },
  thursday: {
    enable: false,
    openingHour: "",
    closinghour: "",
    custom: "",
  },
  friday: {
    enable: false,
    openingHour: "",
    closinghour: "",
    custom: "",
  },
  duracionTurno: "30",
  password: "",
  confirmPassword: "",
}
export function AñadirProfesional() {

  const router = useRouter();

  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [createPractitioner, {
    isLoading,
  }] = useCreatePractitionerMutation()


  const formikRef = useRef<any>(null)

  const [currentFormSteap, setCurrentFormSteap] = useState(0)
  return (
    <div className='flex flex-row w-full min-h-screen md:h-fit h-full max-md:p-2'>
      <div className='md:flex hidden flex-col w-4/12  min-h-screen bg-[#CDE8E8] items-start md:p-5 p-0.5'>{/*Sidebar*/}
        <p className='text-center w-full md:text-3xl text-xs'>
          <b>Agregar Profesional</b>
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
              Informacion Profesional
            </p>
          </div>
          <div className='w-full h-13 relative'>
            <div className={currentFormSteap == 2 ? `text-transparent h-full bg-[#078B8C] rounded-[8px]` : `text-transparent`} />

            <p className={`absolute top-0 w-full h-full flex items-center justify-start ${currentFormSteap == 2 ? `2xl:text-3xl xl:text-2xl text-2xs text-white md:ml-4 ml-0.5` : `2xl:text-2xl xl:text-[18px] text-xs`}`}>
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
                añadirProfesionalSchema.parse(values);
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
              const appointmentSlotsData = getAppointmetDateSlots([values.monday, values.tuesday, values.wednesday, values.thursday, values.friday])
              const practitionerData = {
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
                license: values.license,
                durationAppointment: values.duracionTurno,
                professionalDegreeId: values.specialtyId,
                homeService: false,
                acceptedSocialWorks: false,
                appointmentSlots: appointmentSlotsData
              }
              const response = await createPractitioner({
                token: token,
                entity: practitionerData
              })
              if (response.error) {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: `Ocurrio un error durante la creacion del profesional, por favor intente mas tarde.`,
                  timer: 4000,
                  timerProgressBar: true,
                })
              }
              if (response.data) {
                Swal.fire({
                  icon: "success",
                  title: "¡Exito!",
                  text: `Profesional creado correctamente`,
                  timer: 2000,
                  timerProgressBar: true,
                }).then(() => {
                  resetForm()
                  router.push(
                    `/administrator`
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
                    <AñadirProfesionalForm1
                      setFieldValue={setFieldValue}
                      values={values}
                      errors={errors}
                      touched={touched}
                    /> :
                    currentFormSteap == 1 ?
                      <AñadirProfesionalForm2
                        values={values}
                        errors={errors}
                        touched={touched}
                      /> :
                      <AñadirProfesionalForm3
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
