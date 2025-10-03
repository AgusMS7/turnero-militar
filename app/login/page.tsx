"use client";
import FormIngreso from "@/components/CredentialComponents/FormularioIngreso/FormIngreso";
import RecuperarPassword from "@/components/CredentialComponents/FormularioIngreso/RecuperarPassword";
import Image from "next/image";
import { use, useState } from "react";
import useAuth from "@/app/utils/useAuth";

export default function Login({
  searchParams,
}: {
  searchParams: Promise<{ message: string } | undefined>;
}) {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { message } = use(searchParams) || {};

  useAuth();

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#E4ECEC]">
      <Image src={"/image-ingreso.png"} alt="image" width={480} height={142} />
      {showResetPassword ? (
        <RecuperarPassword
          onForgotPassword={() => setShowResetPassword(false)}
        />
      ) : (
        <>
          <h1 className="mt-3 font-semibold text-base text-[#1F1F1F]">
            Ingresa tus datos para iniciar sesión
          </h1>
          {message && (
            <p className="text-red-600 text-sm text-center mt-2">{message}</p>
          )}
          <FormIngreso onForgotPassword={setShowResetPassword} />
        </>
      )}
    </div>
  );
}
