"use client";
import { use } from "react";
import Image from "next/image";
import FormRecoverPassword from "@/components/CredentialComponents/RecoverPassword/FormRecoverPassword";
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const token = use(searchParams) || {};
  return (
    <div>
      <FormRecoverPassword token={token.token} />
    </div>
  );
}