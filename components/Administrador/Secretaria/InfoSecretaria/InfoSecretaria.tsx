"use client";
import { useGetOneSecretaryQuery, useUpdateSecretaryMutation } from "@/app/redux/api/secretary.api";
import Campo from "@/components/Secretaria/InfoMedico/Campo";
import CampoEditable from "@/components/Secretaria/InfoMedico/CampoEditable";
import { useSession } from "next-auth/react";
import { Lato, Lexend } from "next/font/google";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

interface InfoSecretariaProps {
  useSessionUser?: boolean;
  backUrl?: string;
  fullWidth?: boolean;
}

export default function InfoSecretaria({
  useSessionUser = false,
  backUrl,
  fullWidth = false,
}: InfoSecretariaProps) {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  // Determina el ID a usar, si viene de la URL o de la sesión
  const urlId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const sessionId = session?.user.id || "";

  const {
    data: secretaria,
    isError,
    isLoading,
  } = useGetOneSecretaryQuery({ id: useSessionUser? urlId:  sessionId, token });
  const [updateSecretary, { isLoading: isSaving }] =
    useUpdateSecretaryMutation();

  const [msg, setMsg] = useState<string | null>(null);

  // State para los campos editables
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [initialEmail, setInitialEmail] = useState<string>("");
  const [initialPhone, setInitialPhone] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    setMsg(null);

    // Inicializar email y teléfono
    if (secretaria) {
      const medicoEmail = secretaria.email || "";
      const medicoPhone = secretaria.phone || "";
      setEmail(medicoEmail);
      setPhone(medicoPhone);
      setInitialEmail(medicoEmail);
      setInitialPhone(medicoPhone);
    }
  }, [secretaria]);


  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    setHasChanges(newEmail !== initialEmail || phone !== initialPhone);
  };

  const handlePhoneChange = (newPhone: string) => {
    setPhone(newPhone);
    setHasChanges(email !== initialEmail || newPhone !== initialPhone);
  };

  const handleEmailSave = (newEmail: string) => {
    if (!isValidEmail(newEmail)) {
      setMsg("Por favor, ingrese un email válido");
      return;
    }
    setEmail(newEmail);
    setHasChanges(newEmail !== initialEmail || phone !== initialPhone);
  };

  const handlePhoneSave = (newPhone: string) => {
    if (!isValidPhone(newPhone)) {
      setMsg("Por favor, ingrese un número de teléfono válido");
      return;
    }
    setPhone(newPhone);
    setHasChanges(email !== initialEmail || newPhone !== initialPhone);
  };

  const handleSave = async () => {
    if (!secretaria) return;

    if (email && !isValidEmail(email)) {
      setMsg("Por favor, ingrese un email válido");
      return;
    }
    if (phone && !isValidPhone(phone)) {
      setMsg("Por favor, ingrese un número de teléfono válido");
      return;
    }

    const hasContactChanges = email !== initialEmail || phone !== initialPhone;

    if (!hasContactChanges) {
      setMsg("No hay cambios para guardar");
      return;
    }

    try {
      const updateData: any = {};

      if (hasContactChanges) {
        if (email !== initialEmail) {
          updateData.email = email;
        }
        if (phone !== initialPhone) {
          updateData.phone = phone;
        }
      }

      await updateSecretary({
        token,
        entity: {
          id: secretaria.id,
          body: updateData,
        },
      }).unwrap();

      if (hasContactChanges) {
        setInitialEmail(email);
        setInitialPhone(phone);
        setHasChanges(false);
      }

      setMsg("Cambios guardados correctamente");
    } catch (e: any) {
      setMsg("Error al guardar los cambios");
      console.error(e);
    }
  };

  if (isLoading) return <h1>Cargando…</h1>;
  if (isError || !secretaria) return <h1>No se encontró al Secretaria</h1>;

  return (
    <div
      className={`flex justify-center items-center p-10 ${fullWidth ? "w-full" : ""
        }`}
    >
      <div
        className={`flex flex-col gap-6 p-6 border border-gray-600 rounded-xl ${fullWidth ? "w-full max-w-4xl" : "w-3/5"
          }`}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {backUrl && (
              <button
                onClick={() => router.push(backUrl)}
                className="flex items-center justify-center size-10 hover:bg-teal-600/20 rounded-full transition-colors"
                title="Volver"
              >
                <Image
                  src="/arrow-left.svg"
                  alt="Volver"
                  width={20}
                  height={20}
                />
              </button>
            )}
            <h1
              className={`text-3xl font-bold text-gray-800 ${lexend.className}`}
            >
              Información general
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Campo
              width="w-full"
              label="Nombre"
              value={secretaria.name || ""}
              latoClass={lato.className}
            />
            <Campo
              width="w-full"
              label="Apellido"
              value={secretaria.lastName || ""}
              latoClass={lato.className}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Campo
              width="w-full"
              label="N° Dni"
              value={secretaria.dni || ""}
              latoClass={lato.className}
            />
          </div>

          <CampoEditable
            width="w-full"
            label="Número telefónico"
            value={phone}
            latoClass={lato.className}
            editable={true}
            type="tel"
            placeholder="Ej: +54 11 1234-5678"
            onEdit={handlePhoneChange}
            onSave={handlePhoneSave}
          />

          <CampoEditable
            width="w-full"
            label="Correo electrónico"
            value={email}
            latoClass={lato.className}
            editable={true}
            type="email"
            placeholder="Ej: medico@hospital.com"
            onEdit={handleEmailChange}
            onSave={handleEmailSave}
          />
        </div>
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors ${lato.className
              } ${isSaving ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
          {msg && (
            <span
              className={`text-sm ${msg.includes("Error") ? "text-red-600" : "text-gray-600"
                } ${lato.className}`}
            >
              {msg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
