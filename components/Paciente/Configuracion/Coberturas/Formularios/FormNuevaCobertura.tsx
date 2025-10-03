"use client";
import {
  Patient,
  SocialWorkEnrollment,
  TokenWithEntity,
} from "@/app/definitions/definitions";
import {
  useGetPatientWithFamilyGroupQuery,
  useLazyGetPatientByIdQuery,
  useUpdatePatientByIdMutation,
} from "@/app/redux/api/patient.api";
import { useGetAllSocialWorksQuery } from "@/app/redux/api/socialWork.api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";

interface CambiarObraSocial {
  id: string;
  socialWorkEnrollment: {
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

export default function FormNuevaCobertura() {
  const { data: sesion } = useSession();
  const router = useRouter();
  const { data: pacientePrincipal } = useGetPatientWithFamilyGroupQuery({
    id: sesion?.user.id,
    token: sesion?.user.accessToken,
  });
  const [buscarIntegrante] = useLazyGetPatientByIdQuery();
  const { data: obrasSociales } = useGetAllSocialWorksQuery(
    sesion?.user.accessToken
  );
  const [updatePatientById, { isError: errorAlAgregar, isSuccess: agregada }] =
    useUpdatePatientByIdMutation();
  const [paciente, setPaciente] = useState<CambiarObraSocial>({
    id: "",
    socialWorkEnrollment: {
      memberNum: "",
      plan: "",
      socialWork: {
        id: "",
      },
    },
  });
  const [integrantesGrupoFiltrados, setIntegrantesGrupoFiltrados] = useState<
    Patient[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const buscarDatosPacientes = async () => {
      if (!pacientePrincipal) return;

      const todosIntegrantes = [
        pacientePrincipal,
        ...(pacientePrincipal.familyMembers || []),
      ];

      const resultados = await Promise.all(
        todosIntegrantes.map(async (integrante) => {
          const response = await buscarIntegrante({
            token: sesion?.user.accessToken,
            id: integrante.id,
          });

          if (response.data) {
            return response.data;
          }

          return null;
        })
      );

      const filtrados: Patient[] = resultados.filter(
        (integrante) =>
          integrante?.socialWorkEnrollment?.socialWork?.name == "Particular"
      ) as Patient[];
      setIntegrantesGrupoFiltrados(filtrados);
    };

    buscarDatosPacientes();
  }, [pacientePrincipal]);

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
      className="w-2xl max-lg:w-full rounded-2xl m-auto text-start text-xl p-5 flex flex-col gap-5 *:m-auto [&_div]:w-full 
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
          <label>Paciente</label>
          <select
            value={paciente.id}
            onChange={(e) =>
              setPaciente((prev) => {
                return { ...prev, id: e.target.value };
              })
            }
          >
            <option value="">--Seleccionar--</option>
            {integrantesGrupoFiltrados.length > 0 &&
              integrantesGrupoFiltrados.map((integrante) => (
                <option key={integrante.id} value={integrante.id}>
                  {integrante.name} {integrante.lastName}
                </option>
              ))}
          </select>
          {errors["id"] && <h3>{errors["id"]}</h3>}
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
            <option value="">--Seleccionar--</option>
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
      <div className="flex max-lg:flex-col gap-5">
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
          className="m-auto bg-[#087374] text-white p-2 w-2xl rounded-lg font-bold"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
