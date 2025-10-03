import { signOut } from "next-auth/react";
import { useState } from "react";

export default function SidebarLogoutButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="bg-white border-none justify-start text-[20px] shadow-none hover:bg-[#078B8C] hover:text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
    >
      <div className="flex flex-row gap-x-4">
        <img src={`${!hovered ? "/logout.svg" : "/logout-white.svg"}`} />
        <span>Cerrar sesion</span>
      </div>
    </button>
  );
}

