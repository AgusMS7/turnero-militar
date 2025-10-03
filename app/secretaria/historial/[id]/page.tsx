"use client"
import { HistorialMedico } from "@/components/Medico/Historial/HistorialMedico";
import { useParams } from "next/navigation";


export default function PaginaSecretaria() {
    const params = useParams()
    if(!params.id) return
    return <HistorialMedico userId={params.id?.toString()} />
}
