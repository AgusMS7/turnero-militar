import { useGetPatientByIdQuery, useUpdatePatientByIdMutation } from '@/app/redux/api/patient.api'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import Swal from 'sweetalert2';
import { z } from 'zod';
import Image from 'next/image';
import Volver from '../Volver';


const phoneSchema = z
    .string({ required_error: "Campo Requerido" })
    .regex(new RegExp(/^[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/), {
        message: "Número de teléfono inválido",
    })

const emailSchema = z.string()
    .email('El formato del correo electrónico es inválido')

const adressSchema = z.
    string({ required_error: "Campo Requerido" })
    .min(1, "Debe subir una imagen")
export function Perfil() {

    const { data: session } = useSession();
    const token = session?.user.accessToken;

    const [isEditingPhone, setIsEditingPhone] = useState(false)

    const [isEditingEmail, setIsEditingEmail] = useState(false)

    const formikRef = useRef<any>(null)

    const {
        data: patient,
        isLoading,
        isSuccess,
        isError,
    } = useGetPatientByIdQuery({
        token: token,
        id: session?.user.id,

    })

    const [
        trigger,
        {
            isLoading: isUpdateLoading,
            isSuccess: isUpdateSuccess,
            isError: isUpdateError
        }
    ] = useUpdatePatientByIdMutation()


    return (
        <div className="w-full h-full flex flex-col justify-around">
            <div className="w-full h-fit flex flex-row items-center">
                <Volver link='/paciente/configuracion'/>
            </div>
            <div className=" w-full flex justify-center items-center">
                <div className='md:w-2xl w-4/5 md:p-5 flex flex-col'>
                    {isLoading ?
                        <div className='flex flex-col gap-5 items-center'>
                            <Image className='w-25 animate-spin' src="/hourglass.svg" alt='' height={50} width={50}/>
                            <p className='text-2xl'><b>Cargando...</b></p>
                        </div>
                        : isError ?
                            <div className='md:ml-12 ml-5 flex flex-col gap-5 items-center'>
                                <p className='text-2xl'><b>Ocurrio un error</b></p>
                                <p className='text-xl'>Por favor intente mas tarde</p>
                                <img className='w-50' src="/crossError.svg" />
                            </div>
                            :
                            <div className='flex flex-col p-5 gap-5 shadow-xl rounded-2xl [&_p]:text-lg'>
                                <b className='text-xl'>
                                    Mis datos personales
                                </b>
                                <Formik
                                    innerRef={formikRef}
                                    initialValues={{
                                        phone: "",
                                        email: "",
                                        adress: "",
                                    }}
                                    validate={(values) => {
                                        const formErrors: Record<string, string> = {};

                                        if (isEditingEmail) {
                                            const emailResult = emailSchema.safeParse(values.email);
                                            if (!emailResult.success) {
                                                formErrors.email = emailResult.error.issues[0].message;
                                            }
                                        }

                                        if (isEditingPhone) {
                                            const phoneResult = phoneSchema.safeParse(values.phone);
                                            if (!phoneResult.success) {
                                                formErrors.phone = phoneResult.error.issues[0].message;
                                            }
                                        }

                                        return formErrors;
                                    }}
                                    onSubmit={async (values) => {
                                        const body = {
                                            phone: isEditingPhone ? values.phone : patient?.phone,
                                            email: isEditingEmail ? values.email : patient?.email,
                                        }
                                        try {
                                            await trigger({
                                                token: token,
                                                entity: {
                                                    body: body,
                                                    id: session?.user.id,
                                                }
                                            }).unwrap()
                                            Swal.fire({
                                                icon: "success",
                                                title: "¡Exito!",
                                                text: `Modificacion completa`,
                                                timer: 1500,
                                                timerProgressBar: true,
                                            })
                                            setIsEditingEmail(false)
                                            setIsEditingPhone(false)
                                        } catch (error) {
                                            Swal.fire({
                                                icon: "error",
                                                title: "Error",
                                                text: `Ocurrio un error durante la creacion del profesional, por favor intente mas tarde.`,
                                                timer: 3000,
                                                timerProgressBar: true,
                                            })
                                        }

                                    }}
                                >
                                    {({ values, errors, touched, setFieldValue }) =>
                                    (
                                        <Form>
                                            <div className='flex flex-col gap-3'>
                                                <div className='text-sm'>
                                                    <p><b>Nombre</b></p>
                                                    <p>{patient?.name} {patient?.lastName}</p>
                                                </div>
                                                <div className='text-sm'>
                                                    <p><b>Fecha de nacimiento</b></p>
                                                    <p>{patient?.birth?.replaceAll("-", "/")}</p>
                                                </div>
                                                <div className='text-sm'>
                                                    <p><b>Dni</b></p>
                                                    <p>{patient?.dni}</p>
                                                </div>
                                                <div className='w-[94%] text-sm flex flex-row justify-between'>
                                                    {isEditingPhone ?
                                                        <div className='flex flex-col gap-2 w-full'>
                                                            <p><b>Nuevo Telefono</b></p>
                                                            <div className='flex w-full flex-row justify-between items-center'>
                                                                <div>
                                                                    <Field
                                                                        className='input'
                                                                        name='phone'
                                                                        type="text"
                                                                        value={values.phone}
                                                                    />
                                                                    <ErrorMessage
                                                                        name="phone"
                                                                        component="div"
                                                                        className="text-[#ff0000] text-sm "
                                                                    />
                                                                </div>

                                                            </div>
                                                        </div>
                                                        :
                                                        <div className='flex flex-col w-full'>
                                                            <p><b>Telefóno</b></p>
                                                            <div className='flex w-full flex-row justify-between items-center'>
                                                                <p>{patient?.phone}</p>
                                                                <button
                                                                    type="button"
                                                                    className='btn hover:bg-gray-300'
                                                                    onClick={() => {
                                                                        setFieldValue("phone", patient?.phone)
                                                                        setIsEditingPhone(true)
                                                                    }}>
                                                                    <img src="/edit-square-full-salud-colorsvg.svg" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className='w-[94%] text-sm flex flex-row justify-between'>
                                                    {isEditingEmail ?
                                                        <div className='flex flex-col gap-2 w-full'>
                                                            <p><b>Nuevo Correo</b></p>
                                                            <div className='flex w-full flex-row justify-between items-center'>
                                                                <div>
                                                                    <Field
                                                                        className='input'
                                                                        name='email'
                                                                        type="text"
                                                                        value={values.email}
                                                                    />
                                                                    <ErrorMessage
                                                                        name="email"
                                                                        component="div"
                                                                        className="text-[#ff0000] text-sm "
                                                                    />
                                                                </div>

                                                            </div>
                                                        </div>
                                                        :
                                                        <div className='flex flex-col w-full'>
                                                            <p><b>Correo Electronico</b></p>
                                                            <div className='flex w-full flex-row justify-between items-center'>
                                                                <p>{patient?.email}</p>
                                                                <button
                                                                    type="button"
                                                                    className='btn hover:bg-gray-300'
                                                                    onClick={() => {
                                                                        setFieldValue("email", patient?.email)
                                                                        setIsEditingEmail(true)
                                                                    }}>
                                                                    <img src="/edit-square-full-salud-colorsvg.svg" alt="" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                {isEditingEmail || isEditingPhone ?
                                                    <div className='flex justify-center'>
                                                        <button
                                                            type="button"
                                                            className='btn w-3xs hover:bg-white bg-[#087374] hover:text-[#087374] text-white border-2 border-[#087374]'
                                                            disabled={isUpdateLoading}
                                                            onClick={() => formikRef.current?.submitForm()}
                                                        >
                                                            {isUpdateLoading ? <img src="/hourglass.svg" /> : "Guardar"}
                                                        </button>
                                                    </div>
                                                    :
                                                    <div></div>
                                                }
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                    }
                </div>
            </div>
            <div className="w-full flex justify-center">
                <button
                    onClick={() => signOut()}
                    className='btn w-35 h-fit p-2 shadow-md text-lg hover:bg-[#087374] bg-white hover:border-white border-[#087374] border-2 hover:text-white text-[#087374]'>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}
