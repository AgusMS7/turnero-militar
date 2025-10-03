"use client";

import React, { useState } from "react";
import { useLazyGetPatientRegistrationStatusQuery } from "@/app/redux/api/patient.api";
import {
  DocumentTypes,
  Patient,
  PatientRegistrationStatus,
} from "@/app/definitions/definitions";
import Swal from "sweetalert2";

interface PatientSearchModalProps {
  onPatientFound: (registrationStatus: PatientRegistrationStatus) => void;
  onClose: () => void;
}

export default function PatientSearchModal({
  onPatientFound,
  onClose,
}: PatientSearchModalProps) {
  const [documentType, setDocumentType] = useState<DocumentTypes>(
    DocumentTypes.dni
  );
  const [documentNumber, setDocumentNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [searchPatientStatus, { isLoading }] =
    useLazyGetPatientRegistrationStatusQuery();

  const handleSearch = async () => {
    if (!documentNumber.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingrese el número de documento",
      });
      return;
    }

    setIsSearching(true);

    try {
      const result = await searchPatientStatus({
        type: documentType,
        number: documentNumber.trim(),
      }).unwrap();

      if (result) {
        onPatientFound(result);

        let message = "";
        let title = "";

        switch (result.status) {
          case "NOT_REGISTERED":
            title = "Paciente no registrado";
            message =
              "No existe ningún paciente con ese documento. Puede proceder con el registro.";
            break;
          case "REGISTERED_NO_PASSWORD":
            title = "Paciente encontrado";
            message = `${result.patient.name} ${result.patient.lastName} - Ya tienes datos en el sistema pero necesitas configurar tu contraseña para completar tu registro.`;
            break;
          case "HAS_PASSWORD":
            title = "Cuenta pendiente de verificación";
            message = `${result.patient.name} ${result.patient.lastName} - Tiene contraseña pero todavía no activó/verificó la cuenta. Por favor, revisa tu email (${result.email}) para verificar tu cuenta y luego inicia sesión.`;
            break;
          case "COMPLETE":
            title = "Paciente ya registrado";
            message = `${result.patient.name} ${result.patient.lastName} - Cuenta con contraseña y está activado. Puede iniciar sesión en lugar de registrarse.`;
            break;
        }

        Swal.fire({
          icon: result.status === "NOT_REGISTERED" ? "info" : "success",
          title: title,
          text: message,
          showConfirmButton: true,
          confirmButtonText: "Continuar",
        });
      }
    } catch (error: any) {
      console.error("Error searching patient status:", error);
      Swal.fire({
        icon: "error",
        title: "Error al buscar paciente",
        text: "No se pudo verificar el estado del paciente",
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Verificar Estado de Registro
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
              onChange={(e) => setDocumentType(e.target.value as DocumentTypes)}
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
              {isLoading || isSearching ? "Verificando..." : "Verificar"}
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
