import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PractitionerCreate } from "../definitions/definitions";
import { isTokenExpired } from "./tokenFunctions";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "signIn",
      type: "credentials",
      name: "Sign In",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const urlAPI = process.env.NEXT_PUBLIC_API_URL;
          const response = await fetch(`${urlAPI}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
          if (response.ok) {
            const user = await response.json();
            return user;
          } else {
            const errorData = await response.json();
            console.log("Error de credenciales", errorData);
            return { error: errorData.message || "" };
          }
        } catch (error) {
          console.log("Error en la API de autenticación");
          console.log(error);
        }
      },
    }),

    CredentialsProvider({
      id: "signUp-practitioner",
      type: "credentials",
      name: "sign Up doctor",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        lastName: { label: "Lastname", type: "text" },
        gender: { label: "Gender", type: "text" },
        birth: { label: "Birthdate", type: "text" },
        documentType: { label: "Document Type", type: "text" },
        dni: { label: "Document Number", type: "text" },
        phone: { label: "Phone", type: "text" },
        urlImg: { label: "Profile Picture", type: "text" },
        license: { label: "License", type: "text" },
        practitionerRoleId: { label: "Speciality", type: "text" },
        homeService: { label: "Home Service", type: "boolean" },
      },
      async authorize(credentials) {
        const registerData: Partial<PractitionerCreate> = {
          license: credentials?.license,
          homeService: credentials?.homeService === "true",
          name: credentials?.name,
          lastName: credentials?.lastName,
          documentType: credentials?.documentType,
          dni: credentials?.dni,
          gender: credentials?.gender,
          birth: credentials?.gender,
          phone: credentials?.phone,
          email: credentials?.email,
          password: credentials?.password,
          urlImg: credentials?.urlImg,
          practitionerRole: [{ id: credentials!.practitionerRoleId }],
        };
        try {
          const urlAPI = process.env.NEXT_PUBLIC_API_URL;
          const response = await fetch(`${urlAPI}/practitioner`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
          });
          if (response.ok) {
            const user = await response.json();
            return user;
          } else {
            const errorData = await response.json();
            console.log("Error de credenciales", errorData);
            return { error: errorData.message || "" };
          }
        } catch (error) {
          console.log("Error en la API de autenticación");
          console.log(error);
        }
      },
    }),

    CredentialsProvider({
      id: "signUp-patient",
      type: "credentials",
      name: "Registro Paciente",
      credentials: {
        name: { label: "Nombre", type: "text" },
        lastName: { label: "Apellido", type: "text" },
        gender: { label: "Género", type: "text" },
        documentType: { label: "Tipo de documento", type: "text" },
        dni: { label: "DNI", type: "text" },
        birth: { label: "Nacimiento", type: "text" },
        email: { label: "Email", type: "email" },
        phone: { label: "Teléfono", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        console.log("[signUp-patient] Datos recibidos:", credentials);
        try {
          const url = `${process.env.NEXT_PUBLIC_API_URL}/patient`;
          console.log(`[signUp-patient] Llamando a backend: ${url}`);

          // Filtrar solo los campos válidos
          const {
            name,
            lastName,
            gender,
            documentType,
            dni,
            birth,
            email,
            phone,
            password,
          } = credentials as any;

          const cleanPayload = {
            name,
            lastName,
            gender,
            documentType,
            dni,
            birth,
            email,
            phone,
            password,
          };

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cleanPayload),
          });
          console.log(
            `[signUp-patient] Status respuesta backend: ${res.status}`
          );
          let user = null;
          try {
            user = await res.json();
            console.log("[signUp-patient] Respuesta backend:", user);
          } catch (jsonErr) {
            console.log("[signUp-patient] Error parseando JSON:", jsonErr);
          }
          if (res.ok && user) {
            console.log("[signUp-patient] Registro exitoso, usuario:", user);
            return user;
          }
          console.log(
            "[signUp-patient] Registro fallido. Status:",
            res.status,
            "User:",
            user
          );
          return null;
        } catch (err) {
          console.log("[signUp-patient] Error en fetch o backend:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 5, // 5 dias
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user && user.error) {
        throw new Error(user.error);
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.lastName = user.lastName;
        token.email = user.email;
        token.role = user.role;
        token.id = user.id;
        token.urlImg = user.urlImg;
      }
      if (trigger === "update" && session?.user) {
        token.accessToken = session.user.accessToken;
        token.name = session.user.name;
        token.lastName = session.user.lastName;
        token.email = session.email.email;
        token.role = session.user.role;
        token.id = session.user.id;
        token.urlImg = session.user.urlImg;
      }
      if (token.accessToken === undefined) {
        return Promise.resolve(token);
      } else {
        if (isTokenExpired(token)) {
          let newToken = await refreshAccessToken(token);
          return Promise.resolve(newToken);
        } else {
          return token;
        }
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
  },
};

async function refreshAccessToken(token: JWT) {
  try {
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    if (tokenResponse.ok) {
      const refreshedToken = await tokenResponse.json();
      return { ...token, accessToken: refreshedToken.accessToken };
    } else {
      return { ...token, error: "RefreshAccessTokenError" };
    }
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
