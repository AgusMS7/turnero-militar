// components/DoctorHeader.tsx
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface DoctorHeaderProps {
  name: string;
  specialty: string;
  genre: string;
  schedule: string;
  email: string;
  phone: string;
  imageSrc: string;
}


export const MedicoHeader = ({
  name,
  specialty,
  genre,
  email,
  phone,
  imageSrc,
}: DoctorHeaderProps) => {
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6">
      <div className="rounded-full overflow-hidden w-24 h-24">      
        <Image
          src={imageSrc || '/UserIconPlaceholder.jpg'}
          alt={"/UserIconPlaceholder.jpg"}
          width={96}
          height={96}
          objectFit="cover"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800">{((specialty != "Paciente") && (genre == "male" ? "Dr" : "Dra"))} {name}</h2>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span className="bg-gray-200 px-2 py-1 rounded-full text-xs font-medium mr-2">
            {specialty}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span>{email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span>+{phone}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Hospital Militar</span>
          </div>
        </div>
      </div>
    </div>
  );
};