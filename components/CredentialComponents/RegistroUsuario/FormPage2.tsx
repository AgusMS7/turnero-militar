"use client";
import { DocumentTypes, PractitionerRole } from "@/app/definitions/definitions";
import { useGetPractitionerSISADataQuery } from "@/app/redux/api/practitioner.api";
import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  values: {
    documentType: string;
    dni: string;
    license: string;
    practitionerRoleId: string;
  };
  errors: FormikErrors<{
    documentType: string;
    dni: string;
    license: string;
    practitionerRoleId: string;
  }>;
  touched: FormikTouched<{
    documentType: string;
    dni: string;
    license: string;
    practitionerRoleId: string;
  }>;
  setFieldValue:Function
}

function FormRow({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col">{children}</div>;
}


export default function FormPage2({
  values,
  errors,
  touched,
  setFieldValue,

}: Props) {
    const [userDNI,setUserDNI]=useState("")

    const {
      data: SISAUser,
      isLoading,
      isError,
      isSuccess,
    } = useGetPractitionerSISADataQuery(userDNI);
    const setSISANameLastName=()=>{
      setFieldValue('name',SISAUser.nombre)
      setFieldValue('lastName',SISAUser.apellido)

    }
    //Setear nombre y apellido del usuario de SISA
    useEffect(()=>{
      if(isSuccess &&SISAUser) setSISANameLastName()
    },[SISAUser]) 
  return (
    <div className="flex flex-col gap-6 mb-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Buscar en SISA</h2>
        <p className="text-gray-600 text-sm">Ingrese su número de documento para buscar sus matrículas profesionales</p>
      </div>
      <div className="flex flex-col content-center items-center gap-4">
        <div className="w-full max-w-md">
          <FormRow>
            <label className="block text-gray-700 font-medium mb-2">
              Número de documento <span className="text-[#ff0000]">*</span>
            </label>
            <Field
              type="text"
              name="dni"
              placeholder="Ej: 12345678"
              className={`border p-3 rounded-lg w-full bg-white shadow-sm transition-all duration-200 focus:ring-2 focus:ring-[#078B8C]/20 focus:border-[#078B8C] ${
                errors.dni && touched.dni 
                  ? "border-red-500 focus:ring-red-500/20" 
                  : "border-[#A4D4D4] hover:border-[#078B8C]/50"
              }`}
            />
            <ErrorMessage
              name="dni"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </FormRow>
        </div>
        {userDNI && (
          <div className="w-full">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Seleccione una Matrícula <span className="text-[#ff0000]">*</span>
              </h3>
              <p className="text-gray-600 text-sm">Elija la matrícula con la que desea registrarse</p>
            </div>
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#078B8C] mb-3"></div>
                <p className="text-gray-600">Cargando matrículas...</p>
              </div>
            )}
            
            {isError && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="text-red-600 font-medium mb-1">Error al cargar matrículas</div>
                  <p className="text-red-500 text-sm">No se pudieron encontrar matrículas asociadas a este documento</p>
                </div>
              </div>
            )}
            
            {isSuccess && SISAUser && SISAUser.matriculasHabilitadas && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {SISAUser.matriculasHabilitadas.map((
                  license: {
                    matricula: string,
                    provincia: string,
                    profesion: string,
                    estado: string
                  }, 
                  index: number
                ) => (
                  <div
                    key={index}
                    className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      values.license === license.matricula
                        ? 'border-[#078B8C] bg-gradient-to-br from-[#078B8C]/5 to-[#078B8C]/10 shadow-md'
                        : 'border-gray-200 bg-white hover:border-[#078B8C]/50 shadow-sm'
                    }`}
                    onClick={() => setFieldValue('license', license.matricula)}
                  >
                    {values.license === license.matricula && (
                      <div className="absolute -top-2 -right-2 bg-[#078B8C] text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="license"
                        value={license.matricula}
                        checked={values.license === license.matricula}
                        onChange={() => setFieldValue('license', license.matricula)}
                        className="mt-2 h-5 w-5 text-[#078B8C] focus:ring-[#078B8C] border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="bg-[#078B8C] text-white px-3 py-1.5 rounded-lg text-sm font-semibold mb-3 inline-block">
                          Matrícula: {license.matricula}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#078B8C] rounded-full"></div>
                            <span className="text-sm text-gray-600">Profesión:</span>
                            <span className="text-sm font-medium text-gray-800">{license.profesion}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#078B8C] rounded-full"></div>
                            <span className="text-sm text-gray-600">Provincia:</span>
                            <span className="text-sm font-medium text-gray-800">{license.provincia}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#078B8C] rounded-full"></div>
                            <span className="text-sm text-gray-600">Estado:</span>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              license.estado.toLowerCase() === 'habilitada' || license.estado.toLowerCase() === 'activa'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : license.estado.toLowerCase() === 'suspendida' || license.estado.toLowerCase() === 'inactiva'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            }`}>
                              {license.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <ErrorMessage
              name="license"
              component="div"
              className="text-red-500 text-sm mt-3 text-center"
            />
          </div>
        )}
        <button
          type="button"
          className="mt-6 px-8 py-3 bg-[#078B8C] hover:bg-[#078B8C]/90 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#078B8C]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={() => setUserDNI(values.dni)}
          disabled={!values.dni || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Buscando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscarme en SISA
            </div>
          )}
        </button>
        
      </div>
    </div>
  );
}