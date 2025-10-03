import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { useGetAllAppointmentsByPractitionerQuery, useLazyGetAllAppointmentsByPatientQuery, useLazyGetAllAppointmentsByPractitionerQuery } from '@/app/redux/api/appointment.api';
import { useGetProfessionaDegreeQuery } from '@/app/redux/api/professionalDegree.api';
import { useGetPatientByIdQuery } from '@/app/redux/api/patient.api';
import { ToggleWithText } from '@/components/Paciente/Historial/ToggleWithText';
import { HistoryAppointmentCard } from './HistoryAppointmentCard';
import { useGetOnePractitionerQuery } from '@/app/redux/api/practitioner.api';

interface Props{
    userId:string
}

const Limit = 3



export function HistorialMedico({userId}:Props) {

    const { data: session } = useSession();

    const token = session?.user.accessToken;

    const [patientName, setPatientName] = useState("")

    const [patientDni, setPatientDni] = useState("")

    const [timePeriod, setTimePeriod] = useState("all")

    const [appointmentStatus, setAppointmentStatus] = useState("")

    const [currentPage, setCurrentPage] = useState(1);

    const getDates = () => {
        const currentDate = new Date

        const startDate = new Date

        if (timePeriod == "all") {
            return ["2000-01-01", `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()}`]
        }


        if (timePeriod == "week") {
            startDate.setDate(currentDate.getDate() - 7)
            return [`${startDate.getFullYear()}-${startDate.getMonth() < 9 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1}-${startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}`, `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()}`]
        }

        if (timePeriod == "month") {
            startDate.setMonth(currentDate.getMonth() - 1)
            return [`${startDate.getFullYear()}-${startDate.getMonth() < 9 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1}-${startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}`, `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()}`]
        }

        if (timePeriod == "6month") {
            startDate.setMonth(currentDate.getMonth() - 6)
            return [`${startDate.getFullYear()}-${startDate.getMonth() < 9 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1}-${startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}`, `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()}`]
        }
        return ["", ""]

    }

    const {
        data: practitioner
    } = useGetOnePractitionerQuery({
        token: token,
        id: userId,
    })

    const {
        data: professionalDegrees,
        isLoading: profDegreeLoad,
        isError: profDegreeError,
    } = useGetProfessionaDegreeQuery(token)

    const [trigger, {
        data: patientData,
        isLoading,
        isError,
    }] = useLazyGetAllAppointmentsByPractitionerQuery()

    useEffect(() => {
        const dates = getDates()
        if (!userId) return
        trigger({
            id: userId,
            token: token,
            patientName: patientName != "" ? patientName : undefined,
            status: appointmentStatus == "" ? undefined : appointmentStatus,
            patientDNI: patientDni != "" ? patientDni : undefined,
            startDate: dates[0],
            endDate: dates[1],
            page: "1",
            limit: Limit.toString(),
        })
        console.log("turnos", patientData)
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [patientName, appointmentStatus, timePeriod, patientDni])

    useEffect(() => {
        const dates = getDates()
        if (!userId) return
        const delayDebounce = setTimeout(() => {
            trigger({
                id: userId,
                token: token,
                patientName: patientName != "" ? patientName : undefined,
                status: appointmentStatus == "" ? undefined : appointmentStatus,
                patientDNI: patientDni != "" ? patientDni : undefined,
                startDate: dates[0],
                endDate: dates[1],
                page: currentPage.toString(),
                limit: Limit.toString(),
            })
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [patientName, appointmentStatus, patientDni, timePeriod, currentPage])


    return (
        <div className='bg-gray-200 w-full md:h-full h-fit flex justify-center items-end'>
            <div className='flex flex-col lg:w-[98%] xl:w-10/12 w-[98%] h-[92%] gap-6'>
                <div className='flex flex-col bg-white border-gray-400 rounded-xl shadow-md gap-3 md:p-2.5 p-0.5 sm:pl-10 sm:pr-10 '>
                    <div className='w-full flex flex-row items-center gap-10'>
                        <p className='text-2xl'>
                            <b>Historial de turnos</b>
                        </p>
                        <p className='text-gray-400'>
                            { practitioner ? `${practitioner.name} ${practitioner.lastName} - ${practitioner.professionalDegree.profession.name}` : ""}
                        </p>
                    </div>
                    <div className='flex md:flex-row flex-col justify-around w-full'>
                        <div
                            className="flex flex-row input 2xl:w-5/12 md:w-6/12 w-full rounded-lg text-xl"
                        >
                            <img src="/search_gray.svg" alt="" />
                            <input
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder="Nombre..."
                            />
                        </div>
                        <div
                            className="flex flex-row input 2xl:w-5/12 md:w-6/12 w-full rounded-lg text-xl"
                        >
                            <img src="/search_gray.svg" alt="" />
                            <input
                                type="text"
                                value={patientDni}
                                onChange={(e) => setPatientDni(e.target.value)}
                                placeholder="DNI..."
                            />
                        </div>
                    </div>
                    <div className='flex flex-row xl:gap-20 gap-2 md:justify-around justify-between'>
                        <div >
                            <p>Periodo de tiempo</p>
                            <div className='flex md:flex-row flex-col items-center gap-1.5'>
                                <ToggleWithText
                                    bodyText='Todos'
                                    activationCondition='all'
                                    activationValue={timePeriod}
                                    changeActivationValueFunction={setTimePeriod}
                                />
                                <ToggleWithText
                                    bodyText='1 Semana'
                                    activationCondition='week'
                                    activationValue={timePeriod}
                                    changeActivationValueFunction={setTimePeriod}
                                />
                                <ToggleWithText
                                    bodyText='1 Mes'
                                    activationCondition='month'
                                    activationValue={timePeriod}
                                    changeActivationValueFunction={setTimePeriod}
                                />
                                <ToggleWithText
                                    bodyText='6 Meses'
                                    activationCondition='6month'
                                    activationValue={timePeriod}
                                    changeActivationValueFunction={setTimePeriod}
                                />
                            </div>
                        </div>
                        <div>
                            <p>Estado de turno</p>
                            <div className='flex flex-col xl:flex-row md:items-start items-center gap-1.5'>
                                <div className='flex md:flex-row flex-col items-center gap-1.5'>
                                    <ToggleWithText
                                        bodyText='Todos'
                                        activationCondition=''
                                        activationValue={appointmentStatus}
                                        changeActivationValueFunction={setAppointmentStatus}
                                    />
                                    <ToggleWithText
                                        bodyText='Pendiente'
                                        activationCondition='pending'
                                        activationValue={appointmentStatus}
                                        changeActivationValueFunction={setAppointmentStatus}
                                    />
                                    <ToggleWithText
                                        bodyText='Aprobado'
                                        activationCondition='approved'
                                        activationValue={appointmentStatus}
                                        changeActivationValueFunction={setAppointmentStatus}
                                    />
                                    <ToggleWithText
                                        bodyText='Completado'
                                        activationCondition='completed'
                                        activationValue={appointmentStatus}
                                        changeActivationValueFunction={setAppointmentStatus}
                                    />
                                </div>
                                <div className='flex md:flex-row flex-col items-center gap-1.5'>
                                    <ToggleWithText
                                        bodyText='Cancelado'
                                        activationCondition='cancelled'
                                        activationValue={appointmentStatus}
                                        changeActivationValueFunction={setAppointmentStatus}
                                    />
                                    <ToggleWithText
                                        bodyText='Ausente'
                                        activationCondition='absent'
                                        activationValue={appointmentStatus}
                                        changeActivationValueFunction={setAppointmentStatus}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-full h-full gap-4 overflow-x-auto'>
                    {patientData?.turns && patientData?.turns.length > 0 ?
                        patientData?.turns.map((appointment) => (
                            <HistoryAppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                        :
                        isLoading ?
                            <div className='flex items-center justify-center'>
                                <div className='flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl'>
                                    <img className='w-10 h-10' src="/hourglass.svg" />
                                    <p className='md:text-3xl text-xl'>Cargando...</p>
                                </div>
                            </div>
                            :
                            isError ?
                                <div className='flex items-center justify-center'>
                                    <div className='flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl'>
                                        <p className='md:text-3xl text-xl'>Ocurrio un error</p>
                                        <p className='text-center'>Por favor intenta de nuevo mas tarde</p>
                                        <img className='w-10 h-10' src="/crossError.svg" />
                                    </div>
                                </div>
                                :
                                <div className='flex items-center justify-center'>
                                    <div className='flex flex-col justify-center gap-2 items-center bg-white shadow-md md:w-xl w-11/12 h-44 rounded-2xl'>
                                        <p className='md:text-3xl text-xl'>No se encontraron coincidencias</p>
                                        <img className='w-10 h-10' src="/information.svg" />
                                    </div>
                                </div>

                    }

                </div>
                <div className="w-full flex flex-row justify-center items-center mt-0.5 gap-4 mb-1.5">
                    <button
                        className={`btn w-10 relative ${currentPage <= 1 ? "bg-gray-500" : "bg-[#078B8C]"}`}
                        disabled={currentPage <= 1}
                        onClick={() => {
                            setCurrentPage(currentPage - 1)
                        }}
                    >
                        <img className="absolute" src="/arrow-left-white.svg" />
                    </button>
                    <div>
                        {currentPage}-{Math.ceil(patientData?.total ? (patientData?.total / Limit) : 1)}
                    </div>
                    <button
                        className={`btn w-10 relative ${currentPage >= (patientData?.total ? Math.ceil(patientData?.total ? (patientData?.total / Limit) : 1) : -1) ? "bg-gray-500" : "bg-[#078B8C]"}`}
                        disabled={currentPage >= (patientData?.total ? Math.ceil(patientData?.total ? (patientData?.total / Limit) : 1) : -1)}
                        onClick={() => {
                            setCurrentPage(currentPage + 1)
                        }}
                    >
                        <img className="absolute" src="/arrow-right-white.svg" />
                    </button>
                </div>
            </div>
        </div>
    )
}
