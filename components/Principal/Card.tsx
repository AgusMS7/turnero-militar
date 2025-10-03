import Image from "next/image";

type Props = {
    url: string;
    text: string;
}

export default function Card({url, text}: Props) {
  return (
    <div className="card bg-base-100 w-full max-w-xs sm:w-96 shadow-2xl">
      <figure className="py-6 px-3 flex flex-col gap-6 items-center">
        <Image
          src={url}
          width={120}
          height={120}
          alt=""
          className="w-20 h-20 sm:w-[120px] sm:h-[120px]"
        />
        <h2 className="text-xl sm:text-3xl font-semibold text-center">{text}</h2>
      </figure>
    </div>
  );
}
