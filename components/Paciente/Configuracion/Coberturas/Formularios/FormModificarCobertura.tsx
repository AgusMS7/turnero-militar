"use client";
import {
  SocialWorkEnrollment,
  TokenWithEntity,
} from "@/app/definitions/definitions";
import {
  useGetPatientByIdQuery,
  useUpdatePatientByIdMutation,
} from "@/app/redux/api/patient.api";
import { useGetAllSocialWorksQuery } from "@/app/redux/api/socialWork.api";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";

interface CambiarObraSocial {
  id: string;
  socialWorkEnrollment: {
    id: string;
    memberNum: string;
    plan: string;
    socialWork: {
      id: string;
    };
  };
}

const pacienteSchema = z.object({
  id: z.string().min(1, "Debe seleccionar una opción"),
  socialWorkEnrollment: z.object({
    memberNum: z.string().min(1, "Debe completar este campo"),
    plan: z.string().min(1, "Debe completar este campo"),
    socialWork: z.object({
      id: z.string().min(1, "Debe seleccionar una opción"),
    }),
  }),
});

export default function FormModificarCobertura() {
  const { data: sesion } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const { data: pacienteTraido, isSuccess: pacienteEncontrado } =
    useGetPatientByIdQuery({
      id: id as string,
      token: sesion?.user.accessToken,
    });
  const { data: obrasSociales } = useGetAllSocialWorksQuery(
    sesion?.user.accessToken
  );
  const [updatePatientById, { isError: errorAlAgregar, isSuccess: agregada }] =
    useUpdatePatientByIdMutation();
  const [paciente, setPaciente] = useState<CambiarObraSocial>({
    id: "",
    socialWorkEnrollment: {
      id: "",
      memberNum: "",
      plan: "",
      socialWork: {
        id: "",
      },
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pacienteEncontrado && pacienteTraido) {
      setPaciente({
        id: pacienteTraido?.id as string,
        socialWorkEnrollment: {
          id: pacienteTraido?.socialWorkEnrollment?.id as string,
          memberNum: pacienteTraido?.socialWorkEnrollment?.memberNum as string,
          plan: pacienteTraido?.socialWorkEnrollment?.plan as string,
          socialWork: {
            id: pacienteTraido?.socialWorkEnrollment?.socialWork?.id as string,
          },
        },
      });
    }
  }, [pacienteTraido, pacienteEncontrado]);

  const validarCampos = () => {
    const result = pacienteSchema.safeParse(paciente);

    if (!result.success) {
      let errores: Record<string, string> = {};

      result.error.errors.forEach((err) => {
        const path = err.path.join(".");
        errores[path] = err.message;
      });

      setErrors(errores);

      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  useEffect(() => {
    validarCampos();
  }, [paciente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validarCampos()) {
      const tokenWithEntity: TokenWithEntity = {
        token: sesion?.user.accessToken,
        entity: paciente,
      };

      await updatePatientById(tokenWithEntity);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe completar todos los campos",
        confirmButtonText: "Aceptar",
      });
    }
  };

  if (errorAlAgregar) {
    Swal.fire({
      icon: "error",
      title: "Error. Intente nuevamente más tarde",
      text: "Ocurrio un error al agregar su cobertura",
      confirmButtonText: "Aceptar",
    });
  }

  if (agregada) {
    Swal.fire({
      icon: "success",
      title: "Operacion exitosa",
      text: "Su cobertura se agrego correctamente",
      confirmButtonText: "Aceptar",
      willClose: () => {
        router.push("/paciente/configuracion/cobertura");
      },
    });
  }

  return (
    <form
      className="max-md:w-full xl:w-2xl rounded-2xl m-auto text-start text-xl p-5 h-full flex flex-col gap-5 *:m-auto [&_div]:w-full 
      [&_h3]:text-red-500
        [&_label]:font-bold
        [&_input]:border-[#A4D4D4] [&_input]:w-full [&_input]:border [&_input]:p-5 
        [&_input]:bg-[#F1F1F1] [&_input]:rounded-md [&_input]:focus:outline-none
        [&_select]:border-[#A4D4D4] [&_select]:w-full [&_select]:border [&_select]:p-5 
        [&_select]:bg-[#F1F1F1] [&_select]:rounded-md [&_select]:focus:outline-none
        "
      onSubmit={handleSubmit}
    >
      {/**Paciente y Obra social */}
      <div className="flex flex-col gap-5">
        <div>
          <label>
            Paciente: {pacienteTraido?.name} {pacienteTraido?.lastName}
          </label>
        </div>
        <div>
          <label>Obra Social</label>
          <select
            value={paciente.socialWorkEnrollment.socialWork.id}
            onChange={(e) =>
              setPaciente((prev) => {
                return {
                  ...prev,
                  socialWorkEnrollment: {
                    ...prev.socialWorkEnrollment,
                    socialWork: {
                      ...prev.socialWorkEnrollment.socialWork,
                      id: e.target.value,
                    },
                  },
                };
              })
            }
          >
            <option disabled value="">
              --Seleccionar--
            </option>
            {obrasSociales &&
              obrasSociales.socialWorks
                .filter((obra) => obra.name != "Particular")
                .map((obra) => (
                  <option key={obra.id} value={obra.id}>
                    {obra.name}
                  </option>
                ))}
          </select>
          {errors["socialWorkEnrollment.socialWork.id"] && (
            <h3>{errors["socialWorkEnrollment.socialWork.id"]}</h3>
          )}
        </div>
      </div>

      {/**Numero y Plan */}
      <div className="flex gap-5 max-lg:flex-col">
        <div>
          <label>Numero de Socio</label>
          <input
            value={paciente.socialWorkEnrollment.memberNum}
            onChange={(e) =>
              setPaciente((prev) => {
                return {
                  ...prev,
                  socialWorkEnrollment: {
                    ...prev.socialWorkEnrollment,
                    memberNum: e.target.value,
                  },
                };
              })
            }
            type="number"
          />
          {errors["socialWorkEnrollment.memberNum"] && (
            <h3>{errors["socialWorkEnrollment.memberNum"]}</h3>
          )}
        </div>
        <div>
          <label>Plan</label>
          <input
            value={paciente.socialWorkEnrollment.plan}
            onChange={(e) =>
              setPaciente((prev) => {
                return {
                  ...prev,
                  socialWorkEnrollment: {
                    ...prev.socialWorkEnrollment,
                    plan: e.target.value,
                  },
                };
              })
            }
            type="text"
          />
          {errors["socialWorkEnrollment.plan"] && (
            <h3>{errors["socialWorkEnrollment.plan"]}</h3>
          )}
        </div>
      </div>
      <div className="flex p-5">
        <button
          type="submit"
          className="m-auto bg-[#087374] text-white p-2 w-xl rounded-lg font-bold"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
