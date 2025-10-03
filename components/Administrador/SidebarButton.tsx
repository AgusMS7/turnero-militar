import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
  text: string;
  link: string;
  primaryIconPath: string;
  secondaryIconPath: string;
}
export default function SidebarButton({
  text,
  link,
  primaryIconPath,
  secondaryIconPath,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const pathName = usePathname()

  return (
    <Link
      href={link}
      className={`border-none justify-start h-fit text-start text-[20px] shadow-none hover:bg-[#078B8C] hover:text-white ${pathName == link ? "bg-[#078B8C] text-white" : "bg-white text-black"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="grid grid-cols-[1fr_5fr] items-center gap-2">
        <img src={`${!hovered && !(pathName == link) ? primaryIconPath : secondaryIconPath}`} />
        <span>{text}</span>
      </div>
    </Link>
  );
}
