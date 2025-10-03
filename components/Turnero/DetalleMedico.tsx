"use client";
import { useState } from "react";
import { Practitioner } from "@/app/definitions/definitions";
import Image from "next/image";
import Link from "next/link";
import ModalBuscarTurno from "./ModalBuscarTurno/ModalBuscarTurno";
interface Props {
  practitioner: Practitioner;
}
export default function DetalleMedico({ practitioner }: Props) {
  localStorage.setItem("MID", practitioner.id); // Guardar el ID del médico en el sessionStorage
  const [index, setIndex] = useState<number>(0); // Estado para controlar el índice

  const handleNext = () => {
    setIndex((prevIndex) =>
      prevIndex === practitioner.practitionerSocialWorks.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setIndex((prevIndex) =>
      prevIndex === 0
        ? practitioner.practitionerSocialWorks.length - 1
        : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col space-y-4 p-3 rounded-2xl border border-[#A4D4D4] bg-[#F1F1F1] lg:w-[35%] lg:mx-auto">
      <div className="flex justify-between items-center">
        <Image
          src={practitioner.urlImg || "/UserIconPlaceholder.jpg"}
          alt="avatar del médico"
          width={75}
          height={75}
          className="p-0.5 rounded-full shadow-xl border border-slate-500"
        />
        <div>
          <button
            onClick={() => {
              const modal = document.getElementById(
                "buscarTurnoModal"
              ) as HTMLDialogElement;
              modal.showModal();
            }}
            className="btn bg-[#078B8C] rounded-lg text-white"
          >
            ¿Tenes un turno?
          </button>
        </div>
      </div>

      <div className="text-black flex flex-col items-start gap-5">
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="font-semibold">Nombre:</p>
          <p className="text-center border border-[#078B8C] bg-[#A4D4D4] rounded-lg px-4 py-1">
            {practitioner.name}
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <p className="font-semibold">Apellido:</p>
          <p className="text-center border border-[#078B8C] bg-[#A4D4D4] rounded-lg px-4 py-1">
            {practitioner.lastName}
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <p className="font-semibold">Matricula:</p>
          <p className="text-center border border-[#078B8C] bg-[#A4D4D4] rounded-lg px-4 py-1">
            {practitioner.license}
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <p className="font-semibold">Especialidad:</p>
          <p className="text-center border border-[#078B8C] bg-[#A4D4D4] rounded-lg px-4 py-1">
            {practitioner.practitionerRole[0].name}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2">
          <p className="font-semibold">Obra Social:</p>

          <div className="flex">
            <button
              onClick={handlePrevious}
              className="border border-[#078B8C] bg-[#c3ecec] rounded-l-lg p-1"
            >
              <Image
                src="/arrow-left.svg"
                width={10}
                height={10}
                alt="icono de flecha"
              />
            </button>

            <p className="flex gap-2 items-center justify-center text-center border-y border-[#078B8C] bg-[#A4D4D4] px-4 py-1">
              {`${practitioner.practitionerSocialWorks[index].socialWork.name} - $${practitioner.practitionerSocialWorks[index].price}`}
            </p>

            <button
              onClick={handleNext}
              className="border border-[#078B8C] bg-[#c3ecec] rounded-r-lg p-1"
            >
              <Image
                src="/arrow-right.svg"
                width={10}
                height={10}
                alt="icono de flecha"
              />
            </button>
          </div>
        </div>
      </div>
      {/* Ir al turnero del medico */}
      <div className="flex justify-end w-full">
        <Link
          href="/turnero/agenda"
          className="btn bg-[#078B8C] rounded-lg text-white"
        >
          Ir al turnero
        </Link>
      </div>
      {/* Modal para buscar turno */}
      <ModalBuscarTurno practitionerId={practitioner.id} />
    </div>
  );
}
