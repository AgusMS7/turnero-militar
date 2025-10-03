import React, { useEffect, useState } from "react";
import {
  useGetAllPractitionersQuery,
  useGetOnePractitionerQuery,
  useLazySearchPractitionersQuery,
} from "@/app/redux/api/practitioner.api";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import SecretaryCard from "./SecretaryCard";
import { useGetAllSecretariesQuery } from "@/app/redux/api/secretary.api";

const Limit = 6

export default function SecretaryDashboard() {

  const router = useRouter();

  const { data: session, status } = useSession();

  const token = session?.user.accessToken;

  const [currentPage, setCurrentPage] = useState(1)

  const [busqueda, setBusqueda] = useState("");

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("MID") || session?.user?.id || "";
    setUserId(id);
  }, []);

  const {
    //Traerse al admin para mostrar la imagen
    data: practitioner,
    isLoading: isLoadingPractitioner,
    isError: isErrorPractitioner,
    isSuccess: isSuccessPractitioner,
  } = useGetOnePractitionerQuery({
    token: session?.user?.accessToken,
    id: userId,
  });

  const {
    data: secretaries,
    isLoading,
    isSuccess,
    isError,
  } = useGetAllSecretariesQuery({
    token: session?.user?.accessToken,
    entity: {
      page: currentPage,
      limit: Limit,
    },
  });


  if (session?.user?.role != "admin")
    return <div>Debes ser un administrador para acceder</div>;
  if (!session) return <div>Inicia sesion para acceder</div>;
  return (
    <div className=" h-screen box-border p-5 text-[20px] w-full ">
      <div className="flex flex-col md:flex-row w-full h-full ">
        <div className="w-full h-full">
          <div className="flex flex-col md:flex-row md:h-20 justify-between items-center gap-2 xl:pl-15 xl:pr-15 ">
            <p>
              <b>Administrador</b>
            </p>
            <div className="flex flex-row justify-center items-center gap-32">
              <button
                className="btn bg-[#078B8C] border-none rounded-2xl text-white hover:bg-[#539999] "
                onClick={() => {
                  router.push(
                    `/administrator/nuevoSecretario`
                  )
                }}
              >
                <div className="flex flex-row content-start gap-x-2">
                  <img src="/add-white.svg" className="w-5 h-5" />
                  <span className="text-sm md:text-base">
                    Agregar Secretaria
                  </span>
                </div>
              </button>
              <img
                className="w-15 h-15 rounded-full"
                src={`${practitioner?.urlImg
                  ? practitioner?.urlImg
                  : "/UserIconPlaceholder.jpg"
                  }`}
              />
            </div>
          </div>
          <div className="h-full max-h-10/12 flex-1 flex flex-col px-4 py-10  p-4 bg-[#078B8C33] rounded-2xl overflow-auto">
            {
              isLoading ?
                (
                  <div>Cargando...</div>
                ) :
                isError ?
                  (
                    <div>Ocurrio un error</div>
                  ) :
                  (
                    secretaries?.secretaries.map((secretary, key) => (
                      <SecretaryCard secretary={secretary} key={key} />
                    ))
                  )
            }
          </div>
          <div className="w-full flex flex-row justify-center items-center mt-0.5 gap-4 ">
            <button
              className={`btn w-10 relative ${currentPage <= 1 ? "bg-gray-500" : "bg-[#078B8C]"}`}
              disabled={currentPage <= 1}
              onClick={() => {
                setCurrentPage(currentPage - 1)
              }}
            >
              <img className="absolute" src="/arrow-left-white.svg" />
            </button>
            <div>
              {currentPage}-{secretaries?.total ? Math.ceil(secretaries.total / Limit) : -1}
            </div>
            <button
              className={`btn w-10 relative ${currentPage >= (secretaries?.total ? Math.ceil(secretaries.total / Limit) : -1) ? "bg-gray-500" : "bg-[#078B8C]"}`}
              disabled={currentPage >= (secretaries?.total ? Math.ceil(secretaries.total / Limit) : -1)}
              onClick={() => {
                setCurrentPage(currentPage + 1)
              }}
            >
              <img className="absolute" src="/arrow-right-white.svg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
