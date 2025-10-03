import { useGetProfessionaDegreePaginatedQuery} from "@/app/redux/api/professionalDegree.api";
import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import { useSession } from "next-auth/react";

interface Props{
  values:{
    specialtyId:string;
    license:string;
    monday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    tuesday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    wednesday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    thursday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    friday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    duracionTurno:string;
  };
  errors:FormikErrors<{
    specialtyId:string;
    license:string;
    monday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    tuesday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    wednesday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    thursday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    friday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    duracionTurno:string;
  }>;
  touched:FormikTouched<{
    specialtyId:string;
    license:string;
    monday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    tuesday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    wednesday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    thursday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    friday:{
      enable:boolean;
      openingHour:string;
      closinghour:string;
      custom:string;
    };
    duracionTurno:string;
  }>;
}

export function AñadirProfesionalForm2({values,errors,touched}:Props){
  const { data: session } = useSession();
  const token = session?.user.accessToken

  const{
        data:professionalDegrees,
        isLoading: profDegreeLoad,
        isError: profDegreeError,
      } = useGetProfessionaDegreePaginatedQuery({
        token:token,
        entity:{
          page:1,
          limit:50,
        }
      })
  return (
    <div className="flex flex-col justify-center md:pl-60 xl:pl-40 md:pr-60 xl:pr-40 gap-3">
        <div>
          <label className="text-xl" htmlFor="specialtyId">Especialidad Medica</label>
          <Field
              as="select"
              name="specialtyId"
              className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
              errors.specialtyId && touched.specialtyId && "border border-red-500"
            }`}
            >
              <option>Seleccione...</option>
              {profDegreeLoad?
                  <option disabled={true}>Cargando...</option>
                :profDegreeError?
                  <option disabled={true}>Ocurrio un error</option>
                :
                  professionalDegrees?.data.map((profDegree)=>( 
                  <option key={profDegree.id} value={profDegree.id}>{profDegree.profession.name}</option>
                  ))
              }
            </Field>
          <ErrorMessage
            name="specialtyId"
            component="div"
            className="text-[#ff0000] text-sm "
          />
        </div>
        <div>
          <label className="text-xl" htmlFor="license">Numero de matricula profesional</label>
          <Field
            type="text"
            name="license"
            placeholder="Ingresa una matricula"
            className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
            errors.license && touched.license && "border border-red-500"
          }`}
          />

          <ErrorMessage
            name="license"
            component="div"
            className="text-[#ff0000] text-sm "
          />
        </div>
        <div className="flex flex-col justify-center gap-5">{/*Horas de atencion*/}
          <p className="text-2xl text-center">Horarios</p>
          <div className="flex flex-col md:gap-10 gap-20">
            <div className="flex md:flex-row flex-col w-full h-15 md:items-center items-start">{/*Lunes*/}
              <span className="flex flex-row w-60 gap-2 items-center">
                <Field
                  type="checkbox"
                  name="monday.enable"
                  className="toggle checked:bg-[#087374] checked:text-white toggle-md"
                />
                <p className="text-xl">Lunes</p>
              </span>
              <div
                className={values.monday.enable ? "block space-y-2" : "hidden"}
              >
                <div className="flex flex-row  gap-1 items-center  ">
                  <Field
                    type="time"
                    name="monday.openingHour"
                    min="07:00"
                    max="23:00"
                    className={`border-gray-400 text-2xl input input-md w-32  ${
                      errors.monday?.openingHour &&
                      touched.monday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                  <span className="text-2xl text-gray-400">a</span>
                  <Field
                    type="time"
                    name="monday.closinghour"
                    min="07:00"
                    max="23:00"
                    className={`text-2xl input input-md w-32  ${
                      errors.monday?.openingHour &&
                      touched.monday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                </div>
                <div className="flex flex-col text-center">
                  {errors.monday?.openingHour && touched.monday?.openingHour && (
                    <span className="text-red-500 text-sm">
                      {errors.monday.openingHour}
                    </span>
                  )}
                  {errors.monday?.closinghour && touched.monday?.closinghour && (
                    <span className="text-red-500 text-sm">
                      {errors.monday.closinghour}
                    </span>
                  )}
                  <span className="text-red-500 text-sm">
                    {errors.monday?.custom || ""}
                  </span>
                </div>
              </div>
            </div>{/*Lunes*/}
            <div className="flex md:flex-row flex-col w-full h-15 md:items-center items-start">{/*Martes*/}
              <span className="flex flex-row w-60 gap-2 items-center">
                <Field
                  type="checkbox"
                  name="tuesday.enable"
                  className="toggle checked:bg-[#087374] checked:text-white toggle-md"
                />
                <p className="text-xl">Martes</p>
              </span>
              <div
                className={values.tuesday.enable ? "block space-y-2" : "hidden"}
              >
                <div className="flex gap-1 items-center  ">
                  <Field
                    type="time"
                    name="tuesday.openingHour"
                    min="07:00"
                    max="23:00"
                    className={`border-gray-400 text-2xl input input-md w-32  ${
                      errors.tuesday?.openingHour &&
                      touched.tuesday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                  <span className="text-2xl text-gray-400">a</span>
                  <Field
                    type="time"
                    name="tuesday.closinghour"
                    min="07:00"
                    max="23:00"
                    className={`text-2xl input input-md w-32  ${
                      errors.tuesday?.openingHour &&
                      touched.tuesday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                </div>
                <div className="flex flex-col text-center">
                  {errors.tuesday?.openingHour && touched.tuesday?.openingHour && (
                    <span className="text-red-500 text-sm">
                      {errors.tuesday.openingHour}
                    </span>
                  )}
                  {errors.tuesday?.closinghour && touched.tuesday?.closinghour && (
                    <span className="text-red-500 text-sm">
                      {errors.tuesday.closinghour}
                    </span>
                  )}
                  <span className="text-red-500 text-sm">
                    {errors.tuesday?.custom || ""}
                  </span>
                </div>
              </div>
            </div>{/*Martes*/}
            <div className="flex md:flex-row flex-col w-full h-15 md:items-center items-start">{/*Miercoles*/}
              <span className="flex flex-row w-60 gap-2 items-center">
                <Field
                  type="checkbox"
                  name="wednesday.enable"
                  className="toggle checked:bg-[#087374] checked:text-white toggle-md"
                />
                <p className="text-xl">Miercoles</p>
              </span>
              <div
                className={values.wednesday.enable ? "block space-y-2" : "hidden"}
              >
                <div className="flex gap-1 items-center  ">
                  <Field
                    type="time"
                    name="wednesday.openingHour"
                    min="07:00"
                    max="23:00"
                    className={`border-gray-400 text-2xl input input-md w-32  ${
                      errors.wednesday?.openingHour &&
                      touched.wednesday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                  <span className="text-2xl text-gray-400">a</span>
                  <Field
                    type="time"
                    name="wednesday.closinghour"
                    min="07:00"
                    max="23:00"
                    className={`text-2xl input input-md w-32  ${
                      errors.wednesday?.openingHour &&
                      touched.wednesday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                </div>
                <div className="flex flex-col text-center">
                  {errors.wednesday?.openingHour && touched.wednesday?.openingHour && (
                    <span className="text-red-500 text-sm">
                      {errors.wednesday.openingHour}
                    </span>
                  )}
                  {errors.wednesday?.closinghour && touched.wednesday?.closinghour && (
                    <span className="text-red-500 text-sm">
                      {errors.wednesday.closinghour}
                    </span>
                  )}
                  <span className="text-red-500 text-sm">
                    {errors.wednesday?.custom || ""}
                  </span>
                </div>
              </div>
            </div>{/*Miercoles*/}
            <div className="flex md:flex-row flex-col w-full h-15 md:items-center items-start">{/*Jueves*/}
              <span className="flex flex-row w-60 gap-2 items-center">
                <Field
                  type="checkbox"
                  name="thursday.enable"
                  className="toggle checked:bg-[#087374] checked:text-white toggle-md"
                />
                <p className="text-xl">Jueves</p>
              </span>
              <div
                className={values.thursday.enable ? "block space-y-2" : "hidden"}
              >
                <div className="flex gap-1 items-center  ">
                  <Field
                    type="time"
                    name="thursday.openingHour"
                    min="07:00"
                    max="23:00"
                    className={`border-gray-400 text-2xl input input-md w-32  ${
                      errors.thursday?.openingHour &&
                      touched.thursday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                  <span className="text-2xl text-gray-400">a</span>
                  <Field
                    type="time"
                    name="thursday.closinghour"
                    min="07:00"
                    max="23:00"
                    className={`text-2xl input input-md w-32  ${
                      errors.thursday?.openingHour &&
                      touched.thursday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                </div>
                <div className="flex flex-col text-center">
                  {errors.thursday?.openingHour && touched.thursday?.openingHour && (
                    <span className="text-red-500 text-sm">
                      {errors.thursday.openingHour}
                    </span>
                  )}
                  {errors.thursday?.closinghour && touched.thursday?.closinghour && (
                    <span className="text-red-500 text-sm">
                      {errors.thursday.closinghour}
                    </span>
                  )}
                  <span className="text-red-500 text-sm">
                    {errors.thursday?.custom || ""}
                  </span>
                </div>
              </div>
            </div>{/*Jueves*/}
            <div className="flex md:flex-row flex-col w-full h-15 md:items-center items-start">{/*Viernes*/}
              <span className="flex flex-row w-60 gap-2 items-center">
                <Field
                  type="checkbox"
                  name="friday.enable"
                  className="toggle checked:bg-[#087374] checked:text-white toggle-md"
                />
                <p className="text-xl">Viernes</p>
              </span>
              <div
                className={values.friday.enable ? "block space-y-2" : "hidden"}
              >
                <div className="flex gap-1 items-center  ">
                  <Field
                    type="time"
                    name="friday.openingHour"
                    min="07:00"
                    max="23:00"
                    className={`border-gray-400 text-2xl input input-md w-32  ${
                      errors.friday?.openingHour &&
                      touched.friday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                  <span className="text-2xl text-gray-400">a</span>
                  <Field
                    type="time"
                    name="friday.closinghour"
                    min="07:00"
                    max="23:00"
                    className={`text-2xl input input-md w-32  ${
                      errors.friday?.openingHour &&
                      touched.friday?.closinghour &&
                      "border border-red-500"
                    }`}
                  />
                </div>
                <div className="flex flex-col text-center">
                  {errors.friday?.openingHour && touched.friday?.openingHour && (
                    <span className="text-red-500 text-sm">
                      {errors.friday.openingHour}
                    </span>
                  )}
                  {errors.friday?.closinghour && touched.friday?.closinghour && (
                    <span className="text-red-500 text-sm">
                      {errors.friday.closinghour}
                    </span>
                  )}
                  <span className="text-red-500 text-sm">
                    {errors.friday?.custom || ""}
                  </span>
                </div>
              </div>
            </div>{/*Viernes*/}
            <div className="flex flex-row items-center justify-center gap-3">
              <span className="text-gray-700">Duracion del turno</span>
              <Field as="select" name="duracionTurno" className="select">
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1 hora y 30 minutos</option>
                <option value="120">2 horas</option>
              </Field>
            </div>
          </div>
        </div>
    </div>
  )
}
