import React from 'react'

interface Props{
  monday:boolean,
  tuesday:boolean,
  wednesday:boolean,
  thursday:boolean,
  friday:boolean,
}

export function WorkingDaysDisplay ({monday,tuesday,wednesday,thursday,friday}:Props) {



  return (
    <div className='flex flex-row gap-2'>
      <div className={`${monday?"bg-blue-400":"bg-gray-400 disabled"} flex items-center justify-center w-7 h-7 rounded-3xl`}>{/*Lunes*/}
        L
      </div>
      <div className={`${tuesday?"bg-blue-400":"bg-gray-400 disabled"} flex items-center justify-center w-7 h-7 rounded-3xl`}>{/*Martes*/}
        M
      </div>
      <div className={`${wednesday?"bg-blue-400":"bg-gray-400 disabled"} flex items-center justify-center w-7 h-7 rounded-3xl`}>{/*Miercoles*/}
        M
      </div>
      <div className={`${thursday?"bg-blue-400":"bg-gray-400 disabled"} flex items-center justify-center w-7 h-7 rounded-3xl`}>{/*Jueves*/}
        J
      </div>
      <div className={`${friday?"bg-blue-400":"bg-gray-400 disabled"} flex items-center justify-center w-7 h-7 rounded-3xl`}>{/*Viernes*/}
        V
      </div>
    </div>
  )
}
