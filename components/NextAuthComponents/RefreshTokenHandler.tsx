"use client";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  isSessionEmpty,
  sessionRefreshInterval,
} from "@/app/utils/tokenFunctions";

interface Props {
  setInterval: React.Dispatch<React.SetStateAction<number>>;
}

export default function RefreshTokenHandler({ setInterval }: Props) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!!session) {
      if (isSessionEmpty(session) || session.user.accessToken === undefined) {
        /*
        Hay ocasiones en donde con NextAuth la sesion expira pero no se
        actualiza el token, causando que la sesion quede con objeto vacio.

        Otra ocasion es que si queda una sesion valida y se apaga el servidor local
        puede ocurrir que la sesion siga siendo valida pero no hay datos del usuario
        ni del token, por lo que se impide el acceso a la aplicacion.

        Desconozco si es un bug de NextAuth, de la API o de la aplicacion, pero
        en ambos casos se fuerza a cerrar la sesion y redirigir al login.
        */
        signOut({ redirect: true, callbackUrl: "/login" });
      } else {
        const interval = sessionRefreshInterval(session);
        setInterval(interval);
      }
    }
  }, [session]);

  return null;
}
