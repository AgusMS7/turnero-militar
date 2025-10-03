"use client";
import { ChangePassword, TokenWithEntity } from "@/app/definitions/definitions";
import { useChangePasswordMutation } from "@/app/redux/api/authentication.api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const claveSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty({ message: "Debe completar este campo" }),
    newPassword: z
      .string()
      .refine((password) => password.length >= 8, {
        message: "La contraseña debe tener al menos 8 caracteres",
      })
      .refine((password) => password.length <= 20, {
        message: "La contraseña debe tener menos de 20 caracteres",
      })
      .refine((password) => !/\s/.test(password), {
        message: "La contraseña no puede contener espacios en blanco",
      })
      .refine((password) => /[A-Z]/.test(password), {
        message: "La contraseña debe contener al menos una letra mayúscula",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "La contraseña debe contener al menos una letra minúscula",
      })
      .refine((password) => /\d/.test(password), {
        message: "La contraseña debe contener al menos un número",
      })
      .refine((password) => password.length != 0, {
        message: "Debe completar este campo",
      }),
    confirmNewPassword: z
      .string()
      .nonempty({ message: "Debe completar este campo" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "La contraseña no coincide",
    path: ["confirmNewPassword"],
  });

interface Props {
  link: string;
}

export default function CambiarClave({ link }: Props) {
  const router = useRouter();
  const [cambiarClave, setCambiarClave] = useState<ChangePassword>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePassword, string>>
  >({});
  const [changePassword, { isLoading, isSuccess, error }] =
    useChangePasswordMutation();

  const { data: session } = useSession();

  const validarCampos = () => {
    const result = claveSchema.safeParse(cambiarClave);

    if (!result.success) {
      const errores: Partial<Record<keyof ChangePassword, string>> = {};
      result.error.errors.forEach((err) => {
        const campo = err.path[0] as keyof ChangePassword;
        errores[campo] = err.message;
      });
      setErrors(errores);
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  useEffect(() => {
    validarCampos();
  }, [cambiarClave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validarCampos()) {
      const tokenEntity: TokenWithEntity = {
        entity: cambiarClave,
        token: session?.user.accessToken,
      };
      const res = await changePassword(tokenEntity);
    }
  };

  if (isSuccess) {
    Swal.fire({
      title: "¡Contraseña cambiada!",
      text: "Tu contraseña se actualizo correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
      router.push("/paciente/configuracion");
    });
  }

  if (error) {
    Swal.fire({
      title: "La contraseña actual es incorrecta",
      text: "Intente nuevamente",
      confirmButtonText: "Cerrar",
      icon: "error",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="my-20 flex flex-col gap-10 *:w-2/3 *:max-md:w-4/5 text-xl max-md:text-lg text-start [&_p]:text-md"
    >
      {/**Contraseña actual*/}
      <div className="m-auto">
        <label>Constraseña actual</label>
        <div className="border-[#A4D4D4] border p-5 bg-[#F1F1F1] rounded-md flex items-center gap-5 *:opacity-60">
          <Image src={"/password.svg"} alt="" width={20} height={20} />
          <input
            value={cambiarClave?.currentPassword}
            onChange={(e) =>
              setCambiarClave((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            className="w-full focus:ring-0 focus:outline-none"
            type="password"
            placeholder="***********"
            required
          />
        </div>
        {errors.currentPassword && (
          <p className="text-red-500">{errors.currentPassword}</p>
        )}
      </div>
      {/**Contraseña nueva */}
      <div className="m-auto">
        <label>
          Ingresar nueva contraseña<span className="text-[#F00]">*</span>
        </label>
        <div className="border-[#A4D4D4] border p-5 bg-[#F1F1F1] rounded-md flex items-center gap-5 *:opacity-60">
          <Image src={"/password.svg"} alt="" width={20} height={20} />
          <input
            value={cambiarClave.newPassword}
            onChange={(e) =>
              setCambiarClave((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            className="w-full focus:ring-0 focus:outline-none"
            type="password"
            placeholder="***********"
            required
          />
        </div>
        {errors.newPassword && (
          <p className="text-red-500">{errors.newPassword}</p>
        )}
      </div>
      {/**Repetir contraseña */}
      <div className="m-auto">
        <label>
          Repetir nueva contraseña<span className="text-[#F00]">*</span>
        </label>
        <div className="border-[#A4D4D4] border p-5 bg-[#F1F1F1] rounded-md flex items-center gap-5 *:opacity-60">
          <Image src={"/password.svg"} alt="" width={20} height={20} />
          <input
            value={cambiarClave.confirmNewPassword}
            onChange={(e) =>
              setCambiarClave((prev) => ({
                ...prev,
                confirmNewPassword: e.target.value,
              }))
            }
            className="w-full focus:ring-0 focus:outline-none"
            type="password"
            placeholder="***********"
            required
          />
        </div>
        {errors.confirmNewPassword && (
          <p className="text-red-500">{errors.confirmNewPassword}</p>
        )}
      </div>
      <div className="grid grid-cols-2 mt-5 m-auto *:rounded-xl text-center text-2xl max-md:text-lg *:w-6/7 *:h-full *:m-auto">
        <button
          onClick={() => router.push(link)}
          type="button"
          className="py-2 shadow-md shadow-gray-500 border-[#087374] border-2 
        text-center text-[#087374] 
        cursor-pointer
        transition-transform hover:scale-105"
        >
          <h3>Cancelar</h3>
        </button>
        <button
          type="submit"
          className="py-2 shadow-md shadow-gray-500 bg-[#087374] border-[#087374] border-2 
        text-center text-white
        cursor-pointer
        transition-transform hover:scale-105"
        >
          <h3>Cambiar contraseña</h3>
        </button>
      </div>
    </form>
  );
}
