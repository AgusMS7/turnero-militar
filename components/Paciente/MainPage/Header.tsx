import Image from "next/image";

const Header = () => {
  return (
    <header className="w-4/5 max-lg:w-full max-lg:mt-5 m-auto">
      <h1 className="text-2xl max-sm:w-4/5 m-auto font-bold text-center mb-4">
        Hospital Militar de Mendoza
      </h1>
      <div className="flex justify-center">
        <Image
          src="/HospitalMilitarFrente.png"
          alt="HospitalMilitar"
          width={1447}
          height={485}
        />
      </div>
    </header>
  );
};

export default Header;
