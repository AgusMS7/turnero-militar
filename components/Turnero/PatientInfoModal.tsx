"use client";

import React, { useState } from "react";
import {
  Patient,
  SocialWork,
  AppointmentCreate,
  TurnStatus,
  DocumentTypes,
} from "@/app/definitions/definitions";
import { useCreateAppointmentMutation } from "@/app/redux/api/appointment.api";
import { useGetAllSocialWorksQuery } from "@/app/redux/api/socialWork.api";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

interface PatientInfoModalProps {
  patient: Patient;
  practitioner: any;
  onClose: () => void;
}

export default function PatientInfoModal({
  patient,
  practitioner,
  onClose,
}: PatientInfoModalProps) {
  const { data: session } = useSession();
  const [selectedSocialWork, setSelectedSocialWork] = useState<string>(
    patient.socialWorkEnrollment?.socialWork?.id || "particular"
  );
  const [isCreating, setIsCreating] = useState(false);

  const { data: todasObras } = useGetAllSocialWorksQuery(
    session?.user.accessToken
  );

  const [createTurn, { error: errorCreate }] = useCreateAppointmentMutation();

  const handleCreateAppointment = async () => {
    if (!session?.user?.accessToken) {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "No se pudo obtener el token de acceso",
      });
      return;
    }

    setIsCreating(true);

    const appointment: Partial<AppointmentCreate> = {
      date: localStorage.getItem("fechaTurno") || "",
      hour: localStorage.getItem("horaTurno") || "",
      status: TurnStatus.pending,
      practitionerId: practitioner.id,
      patientId: patient.id, // Usar patientId para pacientes existentes
      scheduleId: localStorage.getItem("scheduleId") || "",
      slotId: localStorage.getItem("slotId") || "",
    };

    Swal.fire({
      title: "Solicitando Turno",
      text: "Espere un momento",
      icon: "info",
      showConfirmButton: false,
      didOpen: async () => {
        try {
          console.log("Appointment data:", appointment);
          const result = await createTurn({
            appointment: appointment,
            token: session?.user?.accessToken,
          }).unwrap();

          if (errorCreate) {
            Swal.close();
            Swal.fire({
              title: "Error",
              text: "No se pudo solicitar el turno",
              icon: "error",
            });
            console.log("Error en createAppointment", errorCreate);
          } else if (result) {
            Swal.close();
            Swal.fire({
              title: "Solicitud Exitosa",
              text: "El turno fue solicitado con éxito",
              icon: "success",
              didClose: () => {
                if (session?.user?.role === "secretary") {
                  const practitionerId = localStorage.getItem("MID");
                  window.location.replace(
                    `/secretaria/medico/agenda/${practitionerId}`
                  );
                } else {
                  window.location.replace(
                    `/${session ? "medico" : "turnero"}/${result.id}`
                  );
                }
              },
            });
          }
        } catch (e: any) {
          Swal.close();
          Swal.fire({
            title: "Error",
            text: "No se pudo solicitar el turno",
            icon: "error",
          });
          console.error("Error al crear el turno:", e);
          if (e.data) {
            console.error("Detalle del error (400 Bad Request):", e.data);
          } else {
            console.error("No se pudo obtener el detalle del error.");
          }
        } finally {
          setIsCreating(false);
        }
      },
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Información del Paciente
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Patient Information Display */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-gray-800 mb-2">
              Datos del Paciente
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Nombre:</span>
                <p className="text-gray-800">
                  {patient.name || "No disponible"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Apellido:</span>
                <p className="text-gray-800">
                  {patient.lastName || "No disponible"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">DNI:</span>
                <p className="text-gray-800">
                  {patient.dni || "No disponible"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Fecha de Nacimiento:
                </span>
                <p className="text-gray-800">{formatDate(patient.birth)}</p>
              </div>
            </div>
          </div>

          {/* Social Work Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Obra Social
            </label>
            <select
              value={selectedSocialWork}
              onChange={(e) => setSelectedSocialWork(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* Show patient's current social work if they have one */}
              {patient.socialWorkEnrollment?.socialWork && (
                <option value={patient.socialWorkEnrollment.socialWork.id}>
                  {patient.socialWorkEnrollment.socialWork.name}
                </option>
              )}
              {/* Only show Particular option if patient doesn't already have it */}
              {patient.socialWorkEnrollment?.socialWork?.name !==
                "Particular" && <option value="particular">Particular</option>}
            </select>
          </div>

          {/* Member Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Número de Afiliado
            </label>
            <input
              type="text"
              value={
                selectedSocialWork === "particular"
                  ? ""
                  : patient.socialWorkEnrollment?.memberNum || ""
              }
              placeholder="XXX-XXXX-XXXX/XX"
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">
              {selectedSocialWork === "particular"
                ? "Particular seleccionado - no se requiere número de afiliado"
                : "Número de afiliado del paciente (solo lectura)"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreateAppointment}
              disabled={isCreating}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creando Turno..." : "Confirmar y Crear Turno"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
