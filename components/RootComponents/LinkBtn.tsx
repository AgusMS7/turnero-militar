import Link from "next/link";

interface Props {
  url: string;
  texto: string;
}
export default function LinkBtn({ url, texto }: Props) {
  return (
    <Link
      href={url}
      className="w-full bg-white p-4 text-center rounded-lg shadow"
    >
      <span className="text-black font-semibold text-lg">{texto}</span>
    </Link>
  );
}
