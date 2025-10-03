import Image from "next/image";
import { Lexend, Lato } from "next/font/google";
import { AppointmentSlot } from "@/app/definitions/definitions";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

type Props = {
  nombre: string;
  especialidad: string;
  url: string | null;
  appointmentSlots?: AppointmentSlot[];
};

export default function Medico({ nombre, especialidad, url, appointmentSlots = [] }: Props) {
  return (
    <div className="py-14 px-14 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between max-md:flex-col gap-8">
        <div className="flex items-center gap-6 flex-1">
          <div className="w-[200px] h-[200px] max-lg:w-full max-lg:h-full bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {url ? (
              <Image
                src={url}
                alt={`Dr ${nombre}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            ) : (
              `${nombre?.[0]}${nombre?.split(" ")[1]?.[0] || ""}`
            )}
          </div>
          <div>
            <h1 className={`text-gray-900 font-semibold text-4xl max-lg:text-3xl ${lexend.className}`}>
              Dr {nombre}
            </h1>
            <p className={`text-gray-600 font-normal text-3xl max-lg:text-2xl ${lato.className}`}>
              {especialidad || "Especialidad"}
            </p>
          </div>
        </div>
        
        {appointmentSlots.length > 0 && (
         <div className="flex flex-col items-end justify-center">
            <p className="text-gray-700 text-lg font-medium mb-2">Días de atención:</p>
            <div className="flex gap-2">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => {
                  const dayMap: Record<string, string> = {
                    'lunes': 'monday',
                    'martes': 'tuesday',
                    'miércoles': 'wednesday',
                    'jueves': 'thursday',
                    'viernes': 'friday'
                  };
                  
                  const englishDay = dayMap[day.toLowerCase()] || day.toLowerCase();
                  const daySlot = appointmentSlots.find(slot => 
                    slot.day?.toLowerCase() === englishDay.toLowerCase()
                  );
                  
                  const isAvailable = daySlot && !daySlot.unavailable;
                  const dayInitial = day[0];
                  
                  return (
                    <div 
                      key={day}
                      className={`${
                        isAvailable 
                          ? "bg-teal-700" 
                          : "bg-gray-400"
                      } flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 text-white font-medium transition-colors duration-200`}
                      title={day}
                    >
                      {dayInitial}
                    </div>
                  );
                })}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
