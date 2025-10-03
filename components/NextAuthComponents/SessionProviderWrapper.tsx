"use client";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import RefreshTokenHandler from "./RefreshTokenHandler";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";
import { Session } from "next-auth";

export default function SessionProviderWrapper({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null | undefined;
}>) {
  const [sessionInterval, setSessionInterval] = useState<number>(0);
  return (
    <SessionProvider session={session} refetchInterval={sessionInterval}>
      <Provider store={store}>
        {children}
        <RefreshTokenHandler setInterval={setSessionInterval} />
      </Provider>
    </SessionProvider>
  );
}
