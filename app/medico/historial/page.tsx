"use client"
import { HistorialMedico } from "@/components/Medico/Historial/HistorialMedico";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
    const { data: session } = useSession();

    return (
        <HistorialMedico
            userId={session?.user.id}
        />
    );
}
