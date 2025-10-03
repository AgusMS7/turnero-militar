import { FormikErrors, FormikTouched } from 'formik';
import React from 'react'

interface Props {
    currentSteap: number
    setCurrentSteap: Function
    formikRef: React.RefObject<any>;
    errors: FormikErrors<{
        //page1
        urlImg: string;
        name: string;
        surename: string;
        email: string;
        birthDate: string;
        gender: string;
        phone: string;
        documentType: string;
        documentNumber: string;
        //page1
        //page2
        specialtyId: string;
        license: string;
        monday: {
            enable: boolean;
            openingHour: string;
            closinghour: string;
            custom: string;
        };
        tuesday: {
            enable: boolean;
            openingHour: string;
            closinghour: string;
            custom: string;
        };
        wednesday: {
            enable: boolean;
            openingHour: string;
            closinghour: string;
            custom: string;
        };
        thursday: {
            enable: boolean;
            openingHour: string;
            closinghour: string;
            custom: string;
        };
        friday: {
            enable: boolean;
            openingHour: string;
            closinghour: string;
            custom: string;
        };
        duracionDeTurno: string;
        //page2
        //page3
        ccessUsername: string;
        password: string;
        confirmPassword: string;
        //page3
    }>;
    touched: FormikTouched<{}>;
}
export function NavigationButtons({ currentSteap, setCurrentSteap, formikRef, errors, touched }: Props) {
    const currentPageHasErrors = () => {
        if (currentSteap == 0) {//Reviso en que pagina estamos
            //Para que se cosidere que el usuario completo todos los campos, este debe tocar 7 como minimo, despues reviso cada uno de los posibles errores en la primera pagina
            //si almenos uno existe entonces no se puede pasar, si todos no existen y tambien se cumple la condicion de tocado minimo entonces se pasa a la siguiente pagina.
            if (Object.keys(touched).length >= 7 && !(errors.name || errors.surename || errors.email || errors.birthDate || errors.gender || errors.phone || errors.documentNumber)) {
                setCurrentSteap(currentSteap + 1)
            } else {
                //Si no se cumple la condicion intento subir el form, esto va a fallar porque faltan campos, con lo que se le marcara al usuario lo que falta.
                formikRef.current?.submitForm()
            }
        }
        if (currentSteap == 1) {
            if (Object.keys(touched).length >= 9 && !(errors.specialtyId || errors.license || errors.monday || errors.tuesday || errors.wednesday || errors.thursday || errors.friday || errors.duracionDeTurno)) {
                setCurrentSteap(currentSteap + 1)
            } else {
                formikRef.current?.submitForm()
            }
        }

    }
    return (
        <div className='flex flex-row gap-6 justify-center mb-2.5'>
            <button
                type='button'
                className='btn rounded-2xl md:w-56 text-[#078B8C] bg-white border-gray-500' disabled={currentSteap == 0} onClick={() => setCurrentSteap(currentSteap - 1)}>
                Volver
            </button>
            {
                currentSteap == 2 ?
                    <button
                        type='button'
                        onClick={() => {
                            formikRef.current?.submitForm()
                        }} className='btn rounded-2xl md:w-56 text-white bg-[#078B8C] border-gray-500'>
                        Crear Profesional
                    </button> :
                    <button
                        type='button'
                        onClick={currentPageHasErrors} className='btn rounded-2xl md:w-56 text-white bg-[#078B8C] border-gray-500'>
                        Continuar
                    </button>
            }
        </div>
    )
}
