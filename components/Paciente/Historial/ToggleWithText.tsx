import React from 'react'
interface Props {
    bodyText:string, //Texto que se va a mostrar en el boton
    activationCondition:string, //Condicion para que el boton cambie de blanco a negro
    activationValue:string, //Valor guardado en un useState que el la condicion de boton activo
    changeActivationValueFunction:Function //Funcion para cambiar el valor de activacion
}

export function ToggleWithText ({bodyText,activationCondition,activationValue,changeActivationValueFunction}:Props) {
    return (
        <div 
            className={`flex justify-center items-center text-xs w-18 border-2 rounded-[8px] cursor-pointer ${activationValue==activationCondition?"bg-black  text-white border-black":"bg-white text-black border-gray-500"}`}
            onClick={()=>changeActivationValueFunction(activationCondition)}//Hacemos que el valor de activacion sea igual a la condicion para que la condicion se cumpla y el boton se ponga negro
        >
            <b>{bodyText}</b>
        </div>
    )
}
