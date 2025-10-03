"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface VerificationProps {
  onChange?: (code: string) => void;
}

export default function Verification({ onChange }: VerificationProps) {
  const numInputs = 6;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (value.length === e.target.maxLength && index < numInputs - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = inputRefs.current.map(input => input?.value || "").join("");
    if (onChange) {
      onChange(code);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
      <div className="flex flex-col gap-10 items-center p-12 w-[440px] bg-[#F1F1F1] rounded-2xl shadow-lg">
        <div className="flex items-center justify-start w-full mb-1">
          <Link href="/">
            <Image src="/arrow-left.svg" alt="regresar" width={12} height={12} />
          </Link>
        </div>
        <div className="w-full flex flex-col gap-1 mb-1">
          <h2 className="text-xl font-bold text-[#078B8C] text-center mb-2 mt-0">
            Verifica tu gmail
          </h2>
          <p className="text-center text-gray-700 text-base leading-relaxed mt-2">
            Introduzca su código. Por seguridad, tiene{" "}
            <strong>10 minutos</strong> para completar, luego desaparecerá.
          </p>
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: numInputs }, (_, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#078B8C] transition"
            />
          ))}
        </div>
      </div>
    </div>
  );
}