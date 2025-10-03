"use client";
import React, { useEffect } from "react";
import { use } from "react";
import VerifyContainer from "@/components/VerificarComponents/VerifyContainer";
import Aviso from "@/components/verificacion/aviso/aviso";

export default function Verify({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = use(searchParams);
  const [verifyStatus, setVerifyStatus] = React.useState<string>("LOADING");
  const [showAviso, setShowAviso] = React.useState(false);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          console.log("Email verified successfully.");
          setVerifyStatus("OK");
          setTimeout(() => setShowAviso(true), 1000);
        } else {
          console.log("Failed to verify email. Please check the token and try again.");
          setVerifyStatus("ERROR");
        }
      });
    } else {
      setVerifyStatus("ERROR");
      console.log("No token provided for email verification.");
    }
  }, [token]);

  return (
    <>
      <VerifyContainer statusCode={verifyStatus} />
      {verifyStatus === "OK" && showAviso && (
        <Aviso
          title="¡Verificación exitosa!"
          message="Su email ha sido verificado exitosamente."
          onRedClick={() => {
            setShowAviso(false);
            window.location.href = "/";
          }}
          onGreenClick={() => {
            setShowAviso(false);
            window.location.href = "/medico/ajustes";
          }}
        />
      )}
    </>
  );
}