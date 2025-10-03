import { Appointment } from '@/app/definitions/definitions'
import { useUpdateAppointmentStatusMutation } from '@/app/redux/api/appointment.api';
import Error from 'next/error';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

interface Props {
  appointment: Appointment
}
const reg: RegExp = /secretaria/

export function AgendaAppointentCard({ appointment }: Props) {

  const [winLocation, setWinLocation] = useState<Location>();

  const [trigger,
    {
      isLoading,
      isError,
      isSuccess,
    }
  ] = useUpdateAppointmentStatusMutation()

  const handleUpdateStatus = async () => {
    if (appointment.status == "completed") {
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
      text: `Estas a punto de marcar como completo el turno de ${appointment.patient.name} ${appointment.patient.lastName} con el medico ${appointment.practitioner.name}  ${appointment.practitioner.lastName} tomado en la fecha ${appointment.date} a las ${appointment.hour}.`,
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
            id: appointment.id,
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

  useEffect(() => {
    setWinLocation(window.location);
  }, []);

  return (
    <div className='flex md:flex-row flex-col justify-between items-center md:h-27 h-fit md:gap-0 gap-4 bg-white border-gray-400 rounded-xl shadow-md p-4'>
      <div className='flex flex-col md:items-start items-center gap-2'>
        <div className='flex flex-row items-center gap-1'>
          <img className='h-8' src="/doctorUser-black.svg" />
          <b><p className='text-2xl'>{appointment.practitioner.name} {appointment.practitioner.lastName}</p></b>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <img src="/phone_gray.svg" />
          <p>{appointment.practitioner.phone}</p>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <img src="/information.svg" />
          <p>{appointment.practitioner.professionalDegree.profession ? appointment.practitioner.professionalDegree.profession.name : "Sin datos"}</p>
        </div>
      </div>
      <div className='flex flex-col md:items-start items-center gap-2'>
        <div className='flex flex-row items-center gap-1'>
          <img className='h-6' src="/user.svg" />
          <b><p className='text-2xl'>{appointment.patient.name} {appointment.patient.lastName}</p></b>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <img src="/phone_gray.svg" />
          <p>{appointment.patient.phone}</p>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <img src="/dni-black.svg" />
          <p>{appointment.patient.dni}</p>
        </div>
      </div>
      <div className='w-41 flex flex-col gap-2'>
        <div className='flex flex-row gap-6'>
          <b><p>Fecha</p></b>
          {appointment.date}
        </div>
        <div className='flex flex-row gap-8'>
          <b><p>Hora</p></b>
          {appointment.hour}
        </div>
        <div className='flex flex-row gap-4'>
          <b><p>Estado</p></b>
          {
            appointment.status == "pending" ?
              <p className=' flex flex-row gap-2'><img src="/turno-pendiente.svg" /> Pendiente</p>
              : appointment.status == "approved" ?
                <p className='flex flex-row gap-2'><img src="/turno-aprobado.svg" /> Aprobado</p>
                : appointment.status == "completed" ?
                  <p className='flex flex-row gap-2'><img src="/turno-completado.svg" /> Completado</p>
                  : appointment.status == "cancelled" ?
                    <p className='flex flex-row gap-2'><img src="/turno-cancelado.svg" /> Cancelado</p>
                    : appointment.status == "absent" ?
                      <p className='flex flex-row gap-2 '><img src="/turno-en-revision.png" /> Ausente</p>
                      : <p className='flex flex-row gap-2'><img src="/turno-en-revision.png" /> Otro</p>
          }
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <a
          href={reg.test(winLocation?.pathname ? winLocation.pathname : "") ? `/secretaria/turno/detalle/${appointment.id}` : `/medico/turno/detalle/${appointment.id}`}
          className='flex flex-row items-center justify-center  btn text-white border-0 shadow-none bg-[#078B8C] rounded-[8px]'
        >
          <img src="/information_white.svg" />
          <p className='flex items-center h-full'>Mas informacion</p>
        </a>
        <button
          className={`${appointment.status == "completed"?"hidden":"flex"} flex-row items-center justify-center  btn text-white border-0 shadow-none bg-[#078B8C] rounded-[8px]`}
          onClick={() => handleUpdateStatus()}
          disabled={isLoading}
        >
          {isLoading?<img src="/hourglass.svg" />:<img src="/check-white.svg" />}
          <p className='flex items-center h-full'>{isLoading?"":"Completar turno"}</p>
        </button>
      </div>
    </div>
  )
}