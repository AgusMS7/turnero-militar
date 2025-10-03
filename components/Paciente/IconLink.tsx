'use client';

import { createElement } from 'react';
import { useRouter } from 'next/navigation';
import { History, Settings, LucideIcon } from 'lucide-react';

type IconName = 'History' | 'Settings';

interface IconLinkProps {
  iconName: IconName;
  text: string;
  href: string;
}

const iconComponents: Record<IconName, LucideIcon> = {
  History,
  Settings,
};

const IconLink: React.FC<IconLinkProps> = ({ iconName, text, href }) => {
  const router = useRouter();
  const IconComponent = iconComponents[iconName];

  if (!IconComponent) {
    return null;
  }

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={handleClick}>
      <div className="bg-[#1C6C68] text-white p-4 rounded-full mb-2">
        {createElement(IconComponent, { size: 32 })}
      </div>
      <span className="text-sm font-bold text-gray-700">{text}</span>
    </div>
  );
};

export default IconLink;