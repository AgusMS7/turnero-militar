"use client";
import {
  DocumentTypes,
  Gender,
  PatientRegistrationStatus,
} from "@/app/definitions/definitions";
import { Formik, FormikProps } from "formik";
import Image from "next/image";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";
import { RegistroPacienteSchema } from "@/app/utils/ZodSchemas/RegistroPacienteSchema";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";
import PatientSearchModal from "./PatientSearchModal";
import PatientConfirmationModal from "./PatientConfirmationModal";
import PasswordSetupModal from "./PasswordSetupModal";

export default function FormularioRegistro() {
  const initialValues = {
    name: "",
    lastName: "",
    gender: Gender.male,
    documentType: DocumentTypes.dni,
    dni: "",
    birth: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const router = useRouter();
  const formikRef = useRef<FormikProps<typeof initialValues>>(null);
  const [showPatientSearch, setShowPatientSearch] = useState<boolean>(false);
  const [showPatientConfirmation, setShowPatientConfirmation] =
    useState<boolean>(false);
  const [showPasswordSetup, setShowPasswordSetup] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] =
    useState<PatientRegistrationStatus | null>(null);

  const handlePatientFound = (
    registrationStatus: PatientRegistrationStatus
  ) => {
    if (!formikRef.current) return;

    const { setFieldValue } = formikRef.current;

    switch (registrationStatus.status) {
      case "NOT_REGISTERED":
        // El paciente no existe, permite el registro normal
        setShowPatientSearch(false);
        break;

      case "REGISTERED_NO_PASSWORD":
        // El paciente existe pero necesita completar el registro - muestra el modal de confirmación
        setSelectedPatient(registrationStatus);
        setShowPatientSearch(false);
        setShowPatientConfirmation(true);
        break;

      case "HAS_PASSWORD":
        // El paciente tiene contraseña pero necesita verificar su email, redirige al login
        Swal.fire({
          icon: "info",
          title: "Cuenta pendiente de verificación",
          text: `Por favor, revisa tu email (${registrationStatus.email}) para verificar tu cuenta y luego inicia sesión.`,
          showConfirmButton: true,
          confirmButtonText: "Continuar",
        }).then(() => {
          router.push("/login");
        });
        setShowPatientSearch(false);
        break;

      case "COMPLETE":
        // El paciente ya está registrado, redirige al login
        Swal.fire({
          icon: "info",
          title: "Usuario ya registrado",
          text: "Este paciente ya tiene una cuenta activa. Será redirigido al login.",
          showConfirmButton: true,
          confirmButtonText: "Continuar",
        }).then(() => {
          router.push("/login");
        });
        setShowPatientSearch(false);
        break;
    }
  };

  const handlePatientConfirmation = (confirmed: boolean) => {
    if (confirmed && selectedPatient) {
      setShowPatientConfirmation(false);
      setShowPasswordSetup(true);
    } else {
      setShowPatientConfirmation(false);
      setSelectedPatient(null);
      // Reabre el modal de búsqueda de paciente si el usuario dice "No, no soy yo"
      setShowPatientSearch(true);
    }
  };

  const handlePasswordSetupComplete = () => {
    setShowPasswordSetup(false);
    setSelectedPatient(null);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-teal-800 p-2 sm:p-8">
      <div className="flex flex-col items-center bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <Image src="/logo.png" alt="Logo" width={170} height={170} />
        <h1 className="text-2xl text-black font-bold text-center mb-4">
          Te damos la bienvenida
        </h1>
        <p className="text-black text-xl text-center mb-4 mx-5">
          Crea una cuenta y gestiona tus turnos desde un mismo lugar
        </p>

        <div className="w-full mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-blue-800 mb-1">
                ¿Ya tienes datos en el sistema?
              </h3>
              <p className="text-sm text-blue-600">
                Verifica si ya estás registrado con tu documento
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPatientSearch(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Verificar Documento
            </button>
          </div>
        </div>

        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(RegistroPacienteSchema)}
          onSubmit={async (data, { setSubmitting, resetForm }) => {
            const payload = {
              name: data.name,
              lastName: data.lastName,
              gender: data.gender,
              documentType: data.documentType,
              dni: data.dni,
              birth: data.birth,
              email: data.email,
              phone: data.phone,
              password: data.password,
            };
            const result = await signIn("signUp-patient", {
              ...payload,
            });
            if (result?.error) {
              Swal.fire({
                icon: "error",
                title: "Ocurrió un error",
                text: `${result?.error}`,
                timer: 6000,
                timerProgressBar: true,
              });
            } else {
              Swal.fire({
                icon: "success",
                title: "Registro exitoso",
                text: "¡Tu cuenta fue creada correctamente!, Se te enviara un email de confirmación para activar tu cuenta.",
              }).then(() => {
                router.push("/login");
              });
              resetForm();
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              className="w-full flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">Nombre</legend>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">
                    Apellido
                  </legend>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Apellido"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  />
                  {errors.lastName && touched.lastName && (
                    <div className="text-red-500 text-sm">
                      {errors.lastName}
                    </div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">Género</legend>
                  <select
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  >
                    <option value={Gender.male}>Masculino</option>
                    <option value={Gender.female}>Femenino</option>
                    <option value={Gender.other}>Otro</option>
                    <option value={Gender.rather_not_say}>
                      Prefiero no decir
                    </option>
                  </select>
                  {errors.gender && touched.gender && (
                    <div className="text-red-500 text-sm">{errors.gender}</div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">
                    Tipo de Documento
                  </legend>
                  <select
                    name="documentType"
                    value={values.documentType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  >
                    <option value={DocumentTypes.dni}>DNI</option>
                    <option value={DocumentTypes.passport}>Pasaporte</option>
                  </select>
                  {errors.documentType && touched.documentType && (
                    <div className="text-red-500 text-sm">
                      {errors.documentType}
                    </div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">
                    Número de documento
                  </legend>
                  <input
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    value={values.dni}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  />
                  {errors.dni && touched.dni && (
                    <div className="text-red-500 text-sm">{errors.dni}</div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">
                    Fecha de Nacimiento
                  </legend>
                  <input
                    type="date"
                    name="birth"
                    placeholder="Fecha de nacimiento"
                    value={values.birth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  />
                  {errors.birth && touched.birth && (
                    <div className="text-red-500 text-sm">{errors.birth}</div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">
                    Teléfono
                  </legend>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  />
                  {errors.phone && touched.phone && (
                    <div className="text-red-500 text-sm">{errors.phone}</div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">Email</legend>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">
                    Contraseña
                  </legend>
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-sm">
                      {errors.password}
                    </div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold mb-1">
                    Repetir Contraseña
                  </legend>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input input-bordered w-full"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </div>
                  )}
                </fieldset>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-teal-700 text-white p-2 rounded w-40"
                  disabled={isSubmitting}
                >
                  Registrarse
                </button>
              </div>
            </form>
          )}
        </Formik>
        <div className="w-full justify-end">

        <a
            href="/login"
              className="mt-2 text-sm flex justify-end underline cursor-pointer text-blue-500"
            >
              ¿Ya tenes cuenta? Inicia sesion aqui
            </a>
        </div>
      </div>

      {showPatientSearch && (
        <PatientSearchModal
          onPatientFound={handlePatientFound}
          onClose={() => setShowPatientSearch(false)}
        />
      )}

      {showPatientConfirmation && selectedPatient && (
        <PatientConfirmationModal
          patient={selectedPatient.patient}
          documentType={
            (selectedPatient.patient.documentType as DocumentTypes) ||
            DocumentTypes.dni
          }
          onConfirm={() => handlePatientConfirmation(true)}
          onCancel={() => handlePatientConfirmation(false)}
        />
      )}

      {showPasswordSetup && selectedPatient && (
        <PasswordSetupModal
          patient={selectedPatient.patient}
          documentType={
            (selectedPatient.patient.documentType as DocumentTypes) ||
            DocumentTypes.dni
          }
          onClose={handlePasswordSetupComplete}
        />
      )}
    </div>
  );
}
