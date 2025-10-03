import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export function decodeToken(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token: JWT) {
  //Extraer el tiempo de expiración del token
  const decodedToken = decodeToken(token.accessToken);
  const jwtExpiration = decodedToken.exp;
  //Convertirlo en milisegundos
  const jwtExpirationDate = new Date(jwtExpiration * 1000);
  //Calcular la fecha de expiración
  const refreshTime = new Date(jwtExpirationDate.getTime() - 5 * 60 * 1000);
  //Calcular la fecha actual
  const currentDate = new Date();
  //Si la fecha actual es mayor o igual a la fecha de expiración, el token ha expirado
  return currentDate >= refreshTime;
}

export function sessionRefreshInterval(session: Session) {
  //Extraer el tiempo de expiración del token
  const sessionExpiration = decodeToken(session.user.accessToken);
  //Convertirlo en milisegundos
  const sessionExpirationDate = new Date(sessionExpiration.exp * 1000);
  //Calcular la fecha de expiración - 5 minutos
  //El token se refresca 5 minutos antes de la fecha de expiración
  const sessionRefreshTime = new Date(
    sessionExpirationDate.getTime() - 5 * 60 * 1000
  );
  //Calcular el intervalo de refresco
  //El intervalo de refresco es el tiempo que queda hasta la fecha de expiración menos 5 minutos
  const sessionRefreshInterval = Math.round(
    (sessionRefreshTime.getTime() - Date.now()) / 1000
  );
  return sessionRefreshInterval > 0 ? sessionRefreshInterval : 0;
}

export function isSessionEmpty(session: Session) {
  return Object.keys(session).length === 0 && session.constructor === Object;
}
