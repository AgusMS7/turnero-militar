// components/InfoCard.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  linkText: string;
  href: string;
  iconBgColor: string;
}

export const InfoCard = ({
  icon,
  title,
  description,
  linkText,
  href,
  iconBgColor,
}: InfoCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconBgColor}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 my-2">{description}</p>
      <Link href={href} passHref>
        <button className="mt-4 px-6 py-2 rounded-md font-medium text-white bg-teal-500 hover:bg-teal-600 transition-colors">
          {linkText}
        </button>
      </Link>
    </div>
  );
};