import React, { useEffect, useState } from "react";
import {
  useGetAllPractitionersQuery,
  useGetOnePractitionerQuery,
  useLazySearchPractitionersQuery,
} from "@/app/redux/api/practitioner.api";
import { useSession } from "next-auth/react";
import PractitionerCard from "./PractitionerCard";
import { useRouter } from "next/navigation";

const Limit = 6;

export default function Dashboard() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const token = session?.user.accessToken;

  const [currentPage, setCurrentPage] = useState(1);

  const [busqueda, setBusqueda] = useState("");

  const [userId, setUserId] = useState("");

  const [
    trigger,
    { data: medicos = [], isLoading: isLoadingPractitionerSearch },
  ] = useLazySearchPractitionersQuery();

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
    data: practitioners,
    isLoading,
    isSuccess,
    isError,
  } = useGetAllPractitionersQuery({
    token: session?.user?.accessToken,
    entity: {
      page: currentPage,
      limit: Limit,
    },
  });

  useEffect(() => {
    setCurrentPage(1);
    const delayDebounce = setTimeout(() => {
      if (busqueda.trim() !== "" && token) {
        trigger({
          params: {
            name: busqueda,
            page: currentPage,
            limit: Limit,
          },
          token,
        });
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [busqueda, trigger]);

  if (session?.user?.role != "admin")
    return <div>Debes ser un administrador para acceder</div>;
  if (!session) return <div>Inicia sesion para acceder</div>;
  return (
    <div className=" h-screen box-border p-5 text-[20px] w-full">
      <div className="flex flex-col md:flex-row w-full h-full ">
        <div className="w-full h-full">
          <div className="flex flex-col md:flex-row md:h-20 justify-around items-center gap-2">
            <p>
              <b>Administrador</b>
            </p>
            <div className="input flex flex-row rounded-2xl bg-[#F1F1F1]">
              <img src="/search_black.svg" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar Medico..."
                className=""
              />
            </div>
            <div className="flex flex-row justify-between items-center xl:gap-32 lg:gap-22">

              <button
                className="btn bg-[#078B8C] border-none rounded-2xl text-white hover:bg-[#539999] "
                onClick={() => {
                  router.push(
                    `/administrator/nuevoProfesional`
                  )
                }}
              >
                <div className="flex flex-row content-start gap-x-2">
                  <img src="/add-white.svg" className="w-5 h-5" />
                  <span className="text-sm md:text-base">
                    Agregar profesional
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
            {busqueda.length === 0 ? ( //Si el texto de busqueda esta vacio significa que el usuario no esta buscando nada
              isLoading ? ( //por tanto se ejecunta la logica normal
                <div>Cargando...</div>
              ) : isSuccess ? (
                practitioners?.data.map((practitioner, key) => (
                  <PractitionerCard practitioner={practitioner} key={key} />
                ))
              ) : (
                <div>Ocurrio un error, por favor recargue la pagina</div>
              )
            ) : //Si el largo de la palabra de busqueda es mayor a 0 ejecutamos la busqueda
            medicos.length === 0 && !isLoadingPractitionerSearch ? ( //Si incluso despues de que se ejecute la busqueda el tamaño del array de medicos es cero entonce no encontro nada
              <div>No se encontro ningun medico</div>
            ) : (
              <div>
                <p>Resultados de la busqueda:</p>
                {medicos?.map((practitioner, key) => (
                  <PractitionerCard practitioner={practitioner} key={key} />
                ))}
              </div>
            )}
          </div>
          <div className="w-full flex flex-row justify-center items-center mt-5 gap-4">
            <button
              className={`btn w-10 relative ${
                currentPage <= 1 ? "bg-gray-500" : "bg-[#078B8C]"
              }`}
              disabled={currentPage <= 1}
              onClick={() => {
                setCurrentPage(currentPage - 1);
              }}
            >
              <img className="absolute" src="/arrow-left-white.svg" />
            </button>
            <div>
              {currentPage}-{practitioners?.meta.totalPages}
            </div>
            <button
              className={`btn w-10 relative ${
                currentPage >=
                (practitioners?.meta.totalPages
                  ? practitioners?.meta.totalPages
                  : -1)
                  ? "bg-gray-500"
                  : "bg-[#078B8C]"
              }`}
              disabled={
                currentPage >=
                (practitioners?.meta.totalPages
                  ? practitioners?.meta.totalPages
                  : -1)
              }
              onClick={() => {
                setCurrentPage(currentPage + 1);
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
