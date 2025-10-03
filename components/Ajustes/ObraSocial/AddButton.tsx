import { PractitionerSocialWork } from "@/app/definitions/definitions";
import Image from "next/image";
import { SetStateAction } from "react";
interface Props {
  setPractitionerEdit: React.Dispatch<SetStateAction<PractitionerSocialWork | null>>;
}
export default function AddButton({setPractitionerEdit}: Props) {
  return (
    <button onClick={() => {
        setPractitionerEdit(null);
        const modal=document.getElementById("obraSocialModal") as HTMLDialogElement;
        modal.showModal();
    }} className="btn bg-inherit border-2 border-[#48a7a8] ">
      <Image src="/add.svg" alt="add" width={20} height={20} />
    </button>
  );
}
