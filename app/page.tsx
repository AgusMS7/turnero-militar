"use client";
import React from "react";
import useAuth from "@/app/utils/useAuth";
import PaginaPrincipal from "@/components/Principal/PaginaPrincipal";
const TipoRegistro = () => { //hk
  useAuth();
  return (
    <PaginaPrincipal/>
  );
};

export default TipoRegistro;
