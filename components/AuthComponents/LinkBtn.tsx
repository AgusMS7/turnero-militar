import Link from "next/link";

interface Props {
  url: string;
  texto: string;
}
export default function LinkBtn({ url, texto }: Props) {
  return (
    <Link
      href={url}
      className={`w-full bg-[#078B8C] p-4 text-center rounded-lg`}
    >
      <span className="text-white font-semibold text-lg">{texto}</span>
    </Link>
  );
}
