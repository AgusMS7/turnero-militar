"use client";

import React, { useState } from "react";
import { useLazyGetPatientByDocumentQuery } from "@/app/redux/api/patient.api";
import { DocumentTypes, Patient } from "@/app/definitions/definitions";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import PatientInfoModal from "./PatientInfoModal";

interface PatientSearchProps {
  onClose: () => void;
  practitioner: any;
}

export default function PatientSearch({
  onClose,
  practitioner,
}: PatientSearchProps) {
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [documentType, setDocumentType] = useState<DocumentTypes>(
    DocumentTypes.dni
  );
  const [documentNumber, setDocumentNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);

  const [searchPatient, { isLoading }] = useLazyGetPatientByDocumentQuery();

  const handleSearch = async () => {
    if (!documentNumber.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingrese el número de documento",
      });
      return;
    }

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "No se pudo obtener el token de acceso",
      });
      return;
    }

    setIsSearching(true);

    try {
      const result = await searchPatient({
        token,
        type: documentType,
        number: documentNumber.trim(),
        withAppointments: false,
        withFamilyMembers: false,
      }).unwrap();

      if (result) {
        setFoundPatient(result);
        setShowPatientInfo(true);
        Swal.fire({
          icon: "success",
          title: "Paciente encontrado",
          text: `${result.name} ${result.lastName}`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error: any) {
      console.error("Error searching patient:", error);
      Swal.fire({
        icon: "error",
        title: "Paciente no encontrado",
        text: "No se encontró un paciente con ese documento",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Buscar Paciente
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento
              </label>
              <select
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value as DocumentTypes)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={DocumentTypes.dni}>DNI</option>
                <option value={DocumentTypes.passport}>Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  documentType === DocumentTypes.dni
                    ? "Ej: 42456980"
                    : "Ej: AB123456"
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {documentType === DocumentTypes.dni
                  ? "7 u 8 dígitos"
                  : "6 a 12 caracteres alfanuméricos"}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSearch}
                disabled={isLoading || isSearching}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || isSearching ? "Buscando..." : "Buscar"}
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

      {showPatientInfo && foundPatient && (
        <PatientInfoModal
          patient={foundPatient}
          practitioner={practitioner}
          onClose={() => {
            setShowPatientInfo(false);
            setFoundPatient(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
