import React from "react";
import Link from "next/link";

interface ButtonProps {
  text: string;
  className?: string;
  href: string;
}

const Button: React.FC<ButtonProps> = ({ text, className, href }) => {
  return (
    <Link
      className={`bg-[#1C6C68] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-[#155A57] transition-colors ${className}`}
      href={href}
    >
      {text}
    </Link>
  );
};

export default Button;
