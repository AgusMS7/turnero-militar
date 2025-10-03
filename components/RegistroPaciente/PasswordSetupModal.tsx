"use client";

import React, { useState } from "react";
import {
  Patient,
  DocumentTypes,
  PatientCredentialsUpdate,
} from "@/app/definitions/definitions";
import { useUpdatePatientCredentialsMutation } from "@/app/redux/api/patient.api";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
  PasswordSetupSchema,
  PasswordSetupFormData,
} from "@/app/utils/ZodSchemas/PasswordSetupSchema";

interface PasswordSetupModalProps {
  patient: Patient;
  documentType: DocumentTypes;
  onClose: () => void;
}

export default function PasswordSetupModal({
  patient,
  documentType,
  onClose,
}: PasswordSetupModalProps) {
  const router = useRouter();
  const [updateCredentials, { isLoading }] =
    useUpdatePatientCredentialsMutation();

  const [formData, setFormData] = useState<PasswordSetupFormData>({
    email: patient.email || "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    try {
      PasswordSetupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: typeof errors = {};
      error.errors?.forEach((err: any) => {
        const field = err.path[0] as keyof typeof errors;
        if (field) {
          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const credentials: PatientCredentialsUpdate = {
        documentType,
        dni: patient.dni || "",
        email: formData.email,
        password: formData.password,
        sendVerificationEmail: true,
      };

      await updateCredentials({
        id: patient.id,
        credentials,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Credenciales configuradas",
        text: "¡Perfecto! Has configurado tu contraseña y email. Se ha enviado un email de verificación a tu correo. Revisa tu bandeja de entrada y activa tu cuenta para poder iniciar sesión.",
        showConfirmButton: true,
        confirmButtonText: "Ir a Inicio de Sesión",
      }).then(() => {
        router.push("/login");
      });
    } catch (error: any) {
      console.error("Error updating credentials:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron actualizar las credenciales. Inténtalo de nuevo.",
      });
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Configurar Credenciales
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handleInputChange("password")}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Repite la contraseña"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Se enviará un email de verificación a la
              dirección proporcionada.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Configurando..." : "Configurar Credenciales"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
