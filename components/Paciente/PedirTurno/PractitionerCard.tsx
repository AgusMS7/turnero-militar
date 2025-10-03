import { AppointmentSlot, Practitioner } from '@/app/definitions/definitions'
import React from 'react'
import { WorkingDaysDisplay } from './WorkingDaysDisplay'
import { useRouter } from 'next/navigation';

interface Props {
    practitioner: Practitioner
}

type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

function getWorkingDays(appointmentSlots: AppointmentSlot[] = []) {
    // Mapea los días de la semana a false por defecto
    const days: Record<Weekday, boolean> = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
    };

    // Recorre los días y marca true si hay slot y no está unavailable
    appointmentSlots?.forEach(slot => {
        const day = slot.day?.toLowerCase() as Weekday | undefined;
        if (
            day && days.hasOwnProperty(day) &&
            slot.unavailable === false &&
            Array.isArray(slot.schedules) &&
            slot.schedules.length > 0
        ) {
            days[day] = true;
        }
    });

    return days;
}

export function PractitionerCard({ practitioner }: Props) {
    const workingDays = getWorkingDays(practitioner.appointmentSlots);
    const router = useRouter();
    return (
        <div className='bg-white py-5 flex lg:flex-row flex-col w-full lg:h-26 h-fit justify-between items-center md:p-4 p-0.5 gap-1 rounded-3xl shadow-md'>
            <div className='flex flex-row md:w-4/12 w-full gap-4'>
                <img
                    src="/rst.png"
                    className='w-13 h-13 rounded-full'
                />
                <div>
                    <p>{practitioner.name} {practitioner.lastName}</p>
                    <p className='text-gray-500'>{practitioner.professionalDegree.profession.name}</p>
                </div>
            </div>
            <div>
                <WorkingDaysDisplay
                    monday={workingDays.monday}
                    tuesday={workingDays.tuesday}
                    wednesday={workingDays.wednesday}
                    thursday={workingDays.thursday}
                    friday={workingDays.friday}
                />
            </div>
            <div className='w-3xs'>
                <button
                    className='btn bg-[#078B8C] w-full text-white rounded-[8px]'
                    onClick={() =>
                        router.push(
                            `/paciente/turno/${practitioner.id}`
                        )
                    }
                >
                    <img src="/agenda_nodots_white.svg" />
                    Ver turnos disponibles
                </button>
            </div>
        </div>
    )
}
