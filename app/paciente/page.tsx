"use client";
import React, { useState, useEffect } from "react";
import UserSection from "@/components/Paciente/MainPage/UserSection";
import AppointmentsList from "@/components/Paciente/MainPage/AppointmentsList";
import Button from "@/components/Paciente/MainPage/ButtonTurno";
import Header from "@/components/Paciente/MainPage/Header";
import { useSession } from "next-auth/react";

function Page() {
  const { data: userData } = useSession();

  return (
    <div className="w-full bg-gray-100 p-6 max-lg:p-0 flex flex-col items-center min-h-screen">
      <div className="w-full">
        <Header />
        <UserSection
          userName={`${userData?.user.name} ${userData?.user.lastName}`}
        />
        <AppointmentsList />
        <div className="py-8 text-center">
          <Button text="Sacar nuevo turno" href="/paciente/turno" />
        </div>
      </div>
    </div>
  );
}

export default Page;
