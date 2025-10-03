"use client";

import React from "react";
import { Patient, DocumentTypes } from "@/app/definitions/definitions";

interface PatientConfirmationModalProps {
  patient: Patient;
  documentType: DocumentTypes;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PatientConfirmationModal({
  patient,
  documentType,
  onConfirm,
  onCancel,
}: PatientConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Confirmar Identidad
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              Se encontró un paciente con este documento. ¿Es usted?
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Nombre:</span>
              <span className="text-gray-900">
                {patient.name} {patient.lastName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Documento:</span>
              <span className="text-gray-900">
                {documentType.toUpperCase()}: {patient.dni}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">
                {patient.email || "No registrado"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Teléfono:</span>
              <span className="text-gray-900">
                {patient.phone || "No registrado"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Sí, soy yo
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              No, no soy yo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
