"use client";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isSessionEmpty } from "./tokenFunctions";

export default function useAuth() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<Session | null>(null);

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
        if (session?.user.error == "RefreshAccessTokenError") {
          setIsAuthenticated(false);
          signOut({ redirect: true, callbackUrl: "/login" });
        } else {
          setIsAuthenticated(true);
          setSessionData(session);

          // Setteamos el MID en localStorage
          if (session?.user?.id) {
            localStorage.setItem("MID", session.user.id);
          }

          // Redirección según rol
          const userRole = session?.user?.role;
          let redirectUrl = "/medico/home";
          if (userRole === "admin") redirectUrl = "/administrator";
          else if (userRole === "secretary") redirectUrl = "/secretaria";
          else if (userRole === "patient") redirectUrl = "/paciente";

          switch (pathname) {
            case "/register":
            case "/login":
            case "/":
              router.replace(redirectUrl);
              break;
          }
        }
      }
    } else if (session == null) {
      if (
        pathname !== "/" &&
        pathname !== "/login" &&
        pathname !== "/register"
      ) {
        setIsAuthenticated(false);
        setSessionData(null);
        router.push("/");
      }
    }
  }, [session,pathname, router]);

  return {
    isAuthenticated,
    sessionData,
  };
}
