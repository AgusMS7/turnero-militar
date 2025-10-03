import { Appointment } from '@/app/definitions/definitions'
import Link from 'next/link'
import React from 'react'

interface Props{
  appointment:Appointment
}

export function HistoryPractitionerCard({appointment}:Props){
  return (
    <div className='flex md:flex-row flex-col justify-between items-center md:h-27 h-fit md:gap-0 gap-4 bg-white border-gray-400 rounded-xl shadow-md p-4'>
      <div className='flex flex-col md:items-start items-center gap-2'>
        <div className='flex flex-row items-center gap-1'>
          <img className='h-6' src="/user.svg"/>
          <b><p className='text-2xl'>{appointment.practitioner.name} {appointment.practitioner.lastName}</p></b>
        </div>
        
        <div className='flex flex-row items-center gap-1'>
          <img  src="/phone_gray.svg"/>
          <p>{appointment.practitioner.phone}</p>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <img  src="/information.svg"/>
          <p>{appointment.practitioner.professionalDegree.profession.name}</p>
        </div>
      </div>
      <div className='flex flex-col items-start'>
        <div className='flex flex-row items-center gap-2'>
          <img className='md:w-12 w-8 md:h-12 h-8' src="/agenda_nodots_gray.svg"/>
          <p className='md:text-2xl text-xl'>{appointment.date}</p>
        </div>
        <div className='flex flex-row items-center justify-center gap-2'>
          <img className='md:w-12 w-8 md:h-12 h-8' src="/hour-gray.svg"/>
          <p className='md:text-2xl text-xl'>{appointment.hour}</p>
        </div>
      </div>
      <div className= 'w-32 flex flex-col items-center gap-4'>
        <p>Estado</p>
        {
          appointment.status=="pending"?
            <p className=' flex flex-row gap-2'><img src="/turno-pendiente.svg"/> Pendiente</p>
          :appointment.status=="approved"?
            <p className='flex flex-row gap-2'><img src="/turno-aprobado.svg"/> Aprobado</p>
          :appointment.status=="completed"?
            <p className='flex flex-row gap-2'><img src="/turno-completado.svg"/> Completado</p>
          :appointment.status=="cancelled"?
            <p className='flex flex-row gap-2'><img src="/turno-cancelado.svg"/> Cancelado</p>
          :appointment.status=="absent"?
            <p className='flex flex-row gap-2 '><img src="/turno-en-revision.png"/> Ausente</p>
          : <p className='flex flex-row gap-2'><img src="/turno-en-revision.png"/> Otro</p>
        }
      </div>
      <Link href={`/paciente/turno/detalle/${appointment.id}`} className='flex flex-row items-center justify-center  btn text-white border-0 shadow-none bg-[#078B8C] rounded-[8px]'>
        <img src="/information_white.svg"/>
        <p className='flex items-center h-full'>Mas informacion</p>
      </Link>
    </div>
  )
}
