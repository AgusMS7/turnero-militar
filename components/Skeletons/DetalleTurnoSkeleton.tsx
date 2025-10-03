"use client";
import { Lexend, Lato } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

interface SkeletonFieldProps {
  width: string;
  latoClass?: string;
}

function SkeletonField({ width, latoClass = "" }: SkeletonFieldProps) {
  return (
    <div className={`${width}`}>
      <div
        className={`h-4 bg-gray-300 rounded mb-2 animate-pulse ${latoClass}`}
      />
      <div
        className={`h-12 bg-gray-200 rounded-lg animate-pulse ${latoClass}`}
      />
    </div>
  );
}

export default function DetalleTurnoSkeleton() {
  return (
    <div className="flex justify-center items-center p-10">
      <div className="flex flex-col gap-6 p-6 border border-gray-600 rounded-xl w-full max-w-4xl">
        <div className="space-y-6">
          {/* Header con botón de volver skeleton */}
          <div className="flex items-center gap-4">
            <div className="size-10 bg-gray-200 rounded-full animate-pulse" />
            <div
              className={`h-8 w-64 bg-gray-300 rounded animate-pulse ${lexend.className}`}
            />
          </div>

          {/* Sección de información del paciente skeleton */}
          <div className="space-y-4">
            <div
              className={`h-6 w-48 bg-gray-300 rounded animate-pulse ${lexend.className}`}
            />
            <div className="grid grid-cols-2 gap-4">
              <SkeletonField width="w-full" latoClass={lato.className} />
              <SkeletonField width="w-full" latoClass={lato.className} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SkeletonField width="w-full" latoClass={lato.className} />
              <SkeletonField width="w-full" latoClass={lato.className} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SkeletonField width="w-full" latoClass={lato.className} />
              <SkeletonField width="w-full" latoClass={lato.className} />
            </div>
          </div>

          {/* Sección de información del profesional skeleton */}
          <div className="space-y-4">
            <div
              className={`h-6 w-56 bg-gray-300 rounded animate-pulse ${lexend.className}`}
            />
            <div className="grid grid-cols-2 gap-4">
              <SkeletonField width="w-full" latoClass={lato.className} />
              <SkeletonField width="w-full" latoClass={lato.className} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SkeletonField width="w-full" latoClass={lato.className} />
              <SkeletonField width="w-full" latoClass={lato.className} />
            </div>
          </div>

          {/* Sección de detalles del turno skeleton */}
          <div className="space-y-4">
            <div
              className={`h-6 w-40 bg-gray-300 rounded animate-pulse ${lexend.className}`}
            />
            <div className="grid grid-cols-2 gap-4">
              <SkeletonField width="w-full" latoClass={lato.className} />
              <SkeletonField width="w-full" latoClass={lato.className} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SkeletonField width="w-full" latoClass={lato.className} />
              <div className="w-full">
                <div
                  className={`h-4 bg-gray-300 rounded mb-2 animate-pulse ${lato.className}`}
                />
                <div
                  className={`h-12 bg-gray-200 rounded-lg animate-pulse ${lato.className}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción skeleton */}
        <div className="pt-4">
          <div className="flex flex-col justify-between p-4 gap-6 mb-8">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-12 w-full bg-gray-300 rounded-lg" />
              <div className="h-12 w-full bg-gray-300 rounded-lg" />
              <div className="h-12 w-full bg-gray-300 rounded-lg" />
              <div className="h-12 w-full bg-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
