"use client";
import Campo from "./Campo";
import CampoEditable from "./CampoEditable";
import PanelHorarios from "./PanelHorarios";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  useGetOnePractitionerQuery,
  useUpdatePractitionerMutation,
} from "@/app/redux/api/practitioner.api";
import { Lexend, Lato } from "next/font/google";
import { TimeSlot, AppointmentSlot } from "@/app/definitions/definitions";
import Image from "next/image";

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

interface InfoMedicoProps {
  useSessionUser?: boolean;
  backUrl?: string;
  fullWidth?: boolean;
}

export default function InfoMedico({
  useSessionUser = false,
  backUrl,
  fullWidth = false,
}: InfoMedicoProps) {
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

  const sessionId = session?.user?.id || "";
  const id = useSessionUser ? sessionId : urlId;

  const {
    data: medico,
    isError,
    isLoading,
  } = useGetOnePractitionerQuery({ id, token });
  const [updatePractitioner, { isLoading: isSaving }] =
    useUpdatePractitionerMutation();

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [initialTimeSlots, setInitialTimeSlots] = useState<TimeSlot[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  // State para los campos editables
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [initialEmail, setInitialEmail] = useState<string>("");
  const [initialPhone, setInitialPhone] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    setMsg(null);

    // Inicializar los horarios cuando los datos del médico están cargados
    if (medico?.appointmentSlots) {
      const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const slots: TimeSlot[] = DAYS.map((day) => {
        const appointmentSlots = (medico.appointmentSlots ||
          []) as AppointmentSlot[];
        const appointmentSlot = appointmentSlots.find(
          (s: AppointmentSlot) => s.day === day
        );
        const schedule = appointmentSlot?.schedules?.[0];
        return {
          day,
          startTime: schedule?.openingHour?.slice(0, 5) ?? "09:00",
          endTime: schedule?.closeHour?.slice(0, 5) ?? "17:00",
          available: !!appointmentSlot && !appointmentSlot.unavailable,
          appointmentSlotId: appointmentSlot?.id,
          scheduleId: schedule?.id,
        };
      });

      setTimeSlots(slots);
      // Deep copy para evitar referencias compartidas y que se compare correctamente los slots
      setInitialTimeSlots(JSON.parse(JSON.stringify(slots)));
    }

    // Inicializar email y teléfono
    if (medico) {
      const medicoEmail = medico.email || "";
      const medicoPhone = medico.phone || "";
      setEmail(medicoEmail);
      setPhone(medicoPhone);
      setInitialEmail(medicoEmail);
      setInitialPhone(medicoPhone);
    }
  }, [medico]);

  // Función para verificar si un día ha cambiado
  const hasSlotChanged = (current: TimeSlot, initial: TimeSlot): boolean => {
    return (
      current.available !== initial.available ||
      current.startTime !== initial.startTime ||
      current.endTime !== initial.endTime
    );
  };

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
    if (!medico) return;

    if (email && !isValidEmail(email)) {
      setMsg("Por favor, ingrese un email válido");
      return;
    }
    if (phone && !isValidPhone(phone)) {
      setMsg("Por favor, ingrese un número de teléfono válido");
      return;
    }

    // Obtener solo los días que han cambiado
    const changedSlots = timeSlots.filter((current) => {
      const initial = initialTimeSlots.find((init) => init.day === current.day);
      return initial ? hasSlotChanged(current, initial) : current.available;
    });

    const hasScheduleChanges = changedSlots.length > 0;
    const hasContactChanges = email !== initialEmail || phone !== initialPhone;

    if (!hasScheduleChanges && !hasContactChanges) {
      setMsg("No hay cambios para guardar");
      return;
    }

    try {
      const updateData: any = { id: medico.id };

      // Enviar todos los slots cambiados con información de horario
      if (hasScheduleChanges) {
        const appointmentSlot = changedSlots.map((slot) => {
          const appointmentSlotData: any = {
            durationAppointment: 30,
            unavailable: !slot.available,
            day: slot.day,
            branchId: "88888888-8888-8888-8888-888888888888",
            schedules: [
              {
                openingHour: slot.startTime,
                closeHour: slot.endTime,
                ...(slot.scheduleId && { id: slot.scheduleId }),
              },
            ],
            practitionerId: medico.id,
          };

          if (slot.appointmentSlotId) {
            appointmentSlotData.id = slot.appointmentSlotId;
          }

          return appointmentSlotData;
        });
        updateData.appointmentSlot = appointmentSlot;
      }

      if (hasContactChanges) {
        if (email !== initialEmail) {
          updateData.email = email;
        }
        if (phone !== initialPhone) {
          updateData.phone = phone;
        }
      }

      await updatePractitioner({
        token,
        entity: updateData,
      }).unwrap();

      if (hasScheduleChanges) {
        setInitialTimeSlots(JSON.parse(JSON.stringify(timeSlots)));
      }
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
  if (isError || !medico) return <h1>No se encontró al médico</h1>;

  return (
    <div
      className={`flex justify-center items-center p-10 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      <div
        className={`flex flex-col gap-6 p-6 border border-gray-600 rounded-xl ${
          fullWidth ? "w-full max-w-4xl" : "w-3/5"
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
              value={medico.name || ""}
              latoClass={lato.className}
            />
            <Campo
              width="w-full"
              label="Apellido"
              value={medico.lastName || ""}
              latoClass={lato.className}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Campo
              width="w-full"
              label="Especialidad"
              value={medico.professionalDegree?.profession?.name || ""}
              latoClass={lato.className}
            />
            <Campo
              width="w-full"
              label="N° Matrícula"
              value={medico.license || ""}
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

        <PanelHorarios
          appointmentSlots={medico.appointmentSlots}
          editable={true}
          onSlotsChange={(slots) => setTimeSlots(slots)}
          lexendClass={lexend.className}
          latoClass={lato.className}
        />

        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={
              isSaving ||
              (!hasChanges &&
                timeSlots.every((current) => {
                  const initial = initialTimeSlots.find(
                    (init) => init.day === current.day
                  );
                  return initial
                    ? !hasSlotChanged(current, initial)
                    : !current.available;
                }))
            }
            className={`bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors ${
              lato.className
            } ${isSaving ? "opacity-60 cursor-not-allowed" : ""} ${
              !hasChanges &&
              timeSlots.every((current) => {
                const initial = initialTimeSlots.find(
                  (init) => init.day === current.day
                );
                return initial
                  ? !hasSlotChanged(current, initial)
                  : !current.available;
              })
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
          {msg && (
            <span
              className={`text-sm ${
                msg.includes("Error") ? "text-red-600" : "text-gray-600"
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
