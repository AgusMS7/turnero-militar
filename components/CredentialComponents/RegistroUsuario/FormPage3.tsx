"use client";
import { DocumentTypes, Gender, PractitionerRole } from "@/app/definitions/definitions";
import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import { useGetAllPractitionerRolesQuery } from "@/app/redux/api/practitionerRole.api";
interface Props {
  values: {
    name: string;
    lastName: string;
    birth: string;
    phone: string;
    gender: string;
    homeService: boolean;
  };
  errors: FormikErrors<{
    name: string;
    lastName: string;
    birth: string;
    phone: string;
    gender: string;
    homeService: string;
  }>;
  touched: FormikTouched<{
    name: boolean;
    lastName: boolean;
    birth: boolean;
    phone: boolean;
    gender: boolean;
    HomeService: boolean;
  }>;
}

function FormRow({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col">{children}</div>;
}

export default function FormPage3({ values, errors, touched }: Props) {
  const {
    data: specialities,
    isLoading,
    isError,
    isSuccess,
  } = useGetAllPractitionerRolesQuery();
  return (
    <div className="flex flex-col space-y-2">
      <span className="text-center font-bold text-xl ">
        Ingresa tus datos personales
      </span>
      <FormRow>
        <label className="block text-gray-700">
          Nombre <span className="text-[#ff0000]">*</span>
        </label>
        <Field
          name="name"
          type="text"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
            errors.name && touched.name && "border border-red-500"
          }`}
        />
        <ErrorMessage
          name="name"
          component="div"
          className="text-red-500 text-sm"
        />
      </FormRow>
      <FormRow>
        <label className="block text-gray-700">
          Apellido <span className="text-[#ff0000]">*</span>
        </label>
        <Field
          name="lastName"
          type="text"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
            errors.lastName && touched.lastName && "border border-red-500"
          }`}
        />
        <ErrorMessage
          name="lastName"
          component="div"
          className="text-red-500 text-sm"
        />
      </FormRow>
      <FormRow>
        <label className="block text-gray-700">
          Fecha de Nacimiento <span className="text-[#ff0000]">*</span>
        </label>
        <Field
          name="birth"
          type="date"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
            errors.birth && touched.birth && "border border-red-500"
          }`}
        />
        <ErrorMessage
          name="birth"
          component="div"
          className="text-red-500 text-sm"
        />
      </FormRow>
      <FormRow>
        <label className="block text-gray-700">
          Teléfono <span className="text-[#ff0000]">*</span>
        </label>
        <Field
          name="phone"
          type="text"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
            errors.phone && touched.phone && "border border-red-500"
          }`}
        />
        <ErrorMessage
          name="phone"
          component="div"
          className="text-red-500 text-sm"
        />
      </FormRow>
      <FormRow>
        <label className="block text-gray-700">
          Genero <span className="text-[#ff0000]">*</span>
        </label>
        <Field
          as="select"
          name="gender"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
            errors.gender && touched.gender && "border border-red-500"
          }`}
        >
          <option value="">Seleccione un género</option>
          <option value={Gender.male}>Masculino</option>
          <option value={Gender.female}>Femenino</option>
          <option value={Gender.other}>Otro</option>
        </Field>
        <ErrorMessage
          name="gender"
          component="div"
          className="text-red-500 text-sm"
        />
      </FormRow>
      <div className="flex flex-row gap-2">
        <label className="block text-gray-700">
          Realizas visitas hogareñas?<span className="text-[#ff0000]">*</span>
        </label>
        <Field
          type="checkbox"
          name="homeService"
          className="checkbox checkbox-primary"
        />
        <ErrorMessage
          name="homeService"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </div>
  );
}
