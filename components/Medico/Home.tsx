import { Appointment } from '@/app/definitions/definitions'
import { useGetAllAppointmentsByPractitionerQuery, useGetAppointmentCompletedByPractitionerQuery, useGetAppointmentsBySpecialistQuery, useGetAppointmentStatsByPractitionerQuery, useUpdateAppointmentStatusMutation } from '@/app/redux/api/appointment.api'
import { useGetOnePractitionerQuery } from '@/app/redux/api/practitioner.api'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Swal from 'sweetalert2'


export function Home() {
    const currentDate = new Date
    const { data: session } = useSession()
    const token = session?.user.accessToken

    const [timePeriod, setTimePeriod] = useState(`${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()}`)

    const {
        data: practitionerData
    } = useGetOnePractitionerQuery({
        token: token,
        id: session?.user.id
    })

    const {
        data: practitionerAppointments,
        isLoading: isLoadingAppointments,
        isError: isErrorAppointments,
    } = useGetAllAppointmentsByPractitionerQuery({
        token: token,
        id: session?.user.id,
        startDate: timePeriod,
        endDate: timePeriod,
        page: "1",
        limit: "30",
    })

    const {
        data: appointmentStats,
        isLoading: isLoadingAppointmentStats,
        isError: isErrorAppointmentStats,
    } = useGetAppointmentStatsByPractitionerQuery({
        token: token,
        entity: {
            id: session?.user.id,
            period: "month",
        }
    })

    const [trigger,
        {
            isLoading,
            isError,
            isSuccess,
        }
    ] = useUpdateAppointmentStatusMutation()

    const handleUpdateStatus = async (appointmnet: Appointment) => {
        if (appointmnet.status == "completed") {
            Swal.fire({
                icon: "info",
                title: "¡El turno seleccionado ya esta completo!",
                timer: 5000,
                width: "670px",
                timerProgressBar: true,
            });
            return
        }
        Swal.fire({
            title: '¿Seguro?',
            icon: "question",
            text: `Estas a punto de marcar como completo el turno de ${appointmnet.patient.name} ${appointmnet.patient.lastName} con el medico ${appointmnet.practitioner.name}  ${appointmnet.practitioner.lastName} tomado en la fecha ${appointmnet.date} a las ${appointmnet.hour}.`,
            showDenyButton: true,
            confirmButtonText: 'Si',
            confirmButtonColor: "#087374",
            denyButtonText: 'No',
            customClass: {
                actions: 'my-actions',
                confirmButton: 'order-2',
                denyButton: 'order-1',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await trigger({
                        id: appointmnet.id,
                        status: "completed",
                    }).unwrap()
                    Swal.fire({
                        icon: "success",
                        title: "¡Exito!",
                        text: `El turno quedo marcado como completo`,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                } catch (error: any) {
                    Swal.fire({
                        icon: "error",
                        title: "Ocurrió un error",
                        text: `${error.data.message}`,
                        timer: 10000,
                        timerProgressBar: true,
                    });
                }
            }
        })
    }


    const ordenarPorHora = (array: Appointment[]): Appointment[] => {
        return [...array].sort((a, b) => {
            const [h1, m1] = a.hour.split(":").map(Number); //Extraemos las horas y minutos
            const [h2, m2] = b.hour.split(":").map(Number);

            const minutosA = h1 * 60 + m1; //Convertimos los las horas a minutos y añadimos los minutos para obtener el total de minutos
            const minutosB = h2 * 60 + m2;

            return minutosA - minutosB; //Si el resultado es menor a 0 A va antes de B si es mayor a 0 A va despues de B
        });
    }


    return (
        <div className=' w-full h-min-screen h-full flex flex-col gap-5 pt-5'>
            <div className='w-full h-fit  flex justify-center '>
                <div className="flex flex-col md:gap-4 xl:w-9/12 w-[98%]">
                    <b><p className='text-3xl'>{
                        practitionerData?.gender == "female" ?
                            `¡Bienvenida! Dra. ${practitionerData.name} ${practitionerData?.lastName}` :
                            `¡Bienvenido! Dr. ${practitionerData?.name} ${practitionerData?.lastName}`
                    }</p></b>
                    <div className='flex flex-col justify-center bg-white h-84 xl:pl-16 xl:pr-16 shadow-xs p-0.5 rounded-md'>
                        <div className='flex flex-row justify-between items-center border-b-2 border-gray-300 shadow-xs xl:pb-2'>
                            <b><p className='text-xl'>Agenda de hoy</p></b>
                            <input
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(e.target.value)}
                                className='border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500' type="date"
                            />
                        </div>
                        <div className=' w-full text-xl  h-4/5'>
                            <div className='grid grid-cols-4   w-full'>
                                <b><p className='text-center'>Hora</p></b>
                                <b><p className='  text-center'>Nombre</p></b>
                                <b><p className='  text-center'>Estado</p></b>
                                <b><p className=' text-center'></p></b>
                            </div>
                            <div className='flex flex-col w-full h-11/12 overflow-y-scroll'>
                                {
                                    isLoadingAppointments ?
                                        <div className='flex flex-col gap-5 w-full justify-center items-center  shadow-xs'>
                                            <img className='w-15' src="/hourglass.svg" />
                                            <p className='text-3xl'>Cargando</p>
                                        </div>
                                        : isErrorAppointments ?
                                            <div className='flex flex-col gap-5 w-full justify-center items-center  shadow-xs'>
                                                <img className='w-15' src="/crossError.svg" />
                                                <p className='text-3xl'>Ocurrio un error</p>
                                            </div>
                                            :
                                            ordenarPorHora(practitionerAppointments?.turns ? practitionerAppointments.turns : []).map((appointment) => (
                                                <div key={appointment.id} className='grid grid-cols-4 w-full  border-b-2 border-gray-300 shadow-xs md:h-15 h-fit md:gap-0 gap-4'>
                                                    <p className=' flex items-center justify-center '>{appointment.hour}</p>
                                                    <div className='  flex sm:flex-row flex-col justify-center items-center sm:gap-2'>
                                                        <p>{appointment.patient.name}</p>
                                                        <p>{appointment.patient.lastName}</p>
                                                    </div>
                                                    {
                                                        appointment.status == "pending" ?
                                                            <div className='flex justify-center items-center'>
                                                                <img className='sm:hidden' src="/turno-pendiente.svg" />
                                                                <p className='max-sm:hidden flex justify-center items-center'>Pendiente</p>
                                                            </div>
                                                            : appointment.status == "approved" ?
                                                                <div className='flex justify-center items-center'>
                                                                    <img className='sm:hidden' src="/turno-aprobado.svg" />
                                                                    <p className='max-sm:hidden text-center flex items-center'>Aprobado</p>
                                                                </div>
                                                                : appointment.status == "completed" ?
                                                                    <div className='flex justify-center items-center'>
                                                                        <img className='sm:hidden' src="/turno-completado.svg" />
                                                                        <p className='max-sm:hidden flex justify-center items-center'>Completado</p>
                                                                    </div>
                                                                    : appointment.status == "cancelled" ?
                                                                        <div className='flex justify-center items-center'>
                                                                            <img className='sm:hidden' src="/turno-cancelado.svg" />
                                                                            <p className='max-sm:hidden flex justify-center items-center'>Cancelado</p>
                                                                        </div>
                                                                        : appointment.status == "absent" ?
                                                                            <div className='flex justify-center items-center'>
                                                                                <img className='sm:hidden' src="/turno-en-revision.png" />
                                                                                <p className='max-sm:hidden flex justify-center items-center'>Ausente</p>
                                                                            </div>
                                                                            :
                                                                            <div className='flex justify-center items-center'>
                                                                                <img className='sm:hidden' src="/turno-en-revision.png" />
                                                                                <p className='max-sm:hidden flex justify-center items-center'>Otro</p>
                                                                            </div>
                                                    }
                                                    <div className='flex justify-center'>
                                                        <button
                                                            className={`${appointment.status == "completed"?"hidden":"flex"} flex-row items-center justify-center sm:w-45 w-fit btn text-white border-0 shadow-none bg-[#078B8C] rounded-[8px]`}
                                                            onClick={() => handleUpdateStatus(appointment)}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? <img src="/hourglass.svg" /> : <img src="/check-white.svg" />}
                                                            <p className='max-sm:hidden flex items-center h-full'>{isLoading ? "" : "Completar turno"}</p>
                                                        </button>
                                                    </div>

                                                </div>
                                            ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-fit flex flex-row justify-around xl:pl-14 md:pl-7 xl:pr-14 md:pr-7'>
                <a
                    className='flex flex-col justify-center items-center transition duration-400 ease-in-out  hover:scale-120 '
                    href='/medico'
                >
                    <div
                        className='cursor-pointer w-20 h-20 bg-white rounded-full flex justify-center items-center border-4 border-[#087374]'
                    >
                        <img className='w-12' src="/calender_nodots_full-salud-color.svg" />
                    </div>
                    <p>Agenda</p>
                </a>
                <a
                    className='flex flex-col justify-center items-center transition duration-400 ease-in-out  hover:scale-120'
                    href='/medico/historial'
                >
                    <div
                        className='cursor-pointer w-20 h-20 bg-white rounded-full flex justify-center items-center border-4 border-[#087374]'
                    >
                        <img className='w-12' src="/calender-events-full-salud-color.svg" />
                    </div>
                    <p>Historial de turnos</p>
                </a>
                <a
                    className='flex flex-col justify-center items-center transition duration-400 ease-in-out  hover:scale-120'
                    href='/medico/configuracion'
                >
                    <div
                        className='cursor-pointer w-20 h-20 bg-white rounded-full flex justify-center items-center border-4 border-[#087374]'
                    >
                        <img className='w-12' src="/ajustes-full-salud-color.svg" />
                    </div>
                    <p>Configuracion</p>
                </a>
            </div>
            <div className=' flex justify-center items-center w-full md:p-2 h-45'>
                <div className='bg-white flex flex-col justify-around h-full w-3xl rounded-xl border-2 border-b-4  border-gray-300 border-b-[#087374] shadow-xs'>
                    <div className='flex flex-row xl:text-3xl text-2xl'>
                        <img className='pl-2 w-10' src="/stethoscope-black.svg" />
                        <b><p className='pl-2'>Resumen del mes</p></b>
                    </div>
                    <div className='flex flex-row justify-around'>
                        {
                            isLoadingAppointmentStats ?
                                <div className='flex flex-row w-full justify-center items-center  shadow-xs'>
                                    <img className='w-10' src="/hourglass.svg" />
                                    <p className='text-3xl'>Cargando</p>
                                </div>
                                : isErrorAppointmentStats ?
                                    <div className='flex flex-row w-full justify-center items-center  shadow-xs'>
                                        <img className='w-10' src="/crossError.svg" />
                                        <p className='text-3xl'>Ocurrio un error</p>
                                    </div> :
                                    <div className='flex flex-row justify-around w-full'>
                                        <div className='text-xl flex flex-col justify-center items-center'>
                                            <b><p className='text-3xl'>{appointmentStats ? appointmentStats.completedStats.count : "Sin datos"}</p></b>
                                            <p>Turnos completos</p>
                                        </div>
                                        <div className='text-xl flex flex-col justify-center items-center'>
                                            <b><p className='text-3xl'>{appointmentStats ? appointmentStats.canceledStats.count : "Sin datos"}</p></b>
                                            <p>Turnos Cancelados</p>
                                        </div>
                                    </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
