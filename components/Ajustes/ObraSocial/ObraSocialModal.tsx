"use client";
import { PractitionerSocialWork } from "@/app/definitions/definitions";
import {
  useCreatePractitionerSocialWorkMutation,
  useUpdatePractitionerSocialWorkMutation,
} from "@/app/redux/api/practitionerSocialWork.api";
import { useLazyGetAllSocialWorksQuery } from "@/app/redux/api/socialWork.api";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { z, ZodError } from "zod";

interface Props {
  editData: PractitionerSocialWork | null;
}

const obraSocialSchema = z.object({
  socialWorkId: z
    .string({ required_error: "Campo Requerido" })
    .min(1, { message: "Debe seleccionar una obra social" }),
  price: z
    .number({ required_error: "El precio es requerido" })
    .nonnegative("El precio debe ser mayor a 0"),
});

export default function ObraSocialModal({ editData }: Props) {
  const [trigger, { data: socialWorks, isLoading, isError }] =
    useLazyGetAllSocialWorksQuery();
  const { data: session } = useSession();

  const [createPractitionerSocialWork] =
    useCreatePractitionerSocialWorkMutation();
  const [updatePractitionerSocialWork] =
    useUpdatePractitionerSocialWorkMutation();

  useEffect(() => {
    const token: string = session?.user.accessToken || "";
    trigger(token);
  }, [session]);
  return (
    <dialog id="obraSocialModal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <Formik
          initialValues={{
            socialWorkId: editData?.socialWorkId || "",
            price: editData?.price || 0,
          }}
          enableReinitialize
          validate={(values) => {
            try {
              obraSocialSchema.parse(values);
              return {};
            } catch (errors) {
              if (errors instanceof ZodError) {
                // Declarar el tipo explícito para formErrors
                const formErrors: Record<string, string> = {};

                errors.issues.forEach((issue) => {
                  const key = issue.path[0]; // TypeScript ahora entiende que es string
                  if (typeof key === "string") {
                    formErrors[key] = issue.message;
                  }
                });
                return formErrors;
              }
            }
          }}
          onSubmit={(values) => {
            const practitionerSocialWork: Partial<PractitionerSocialWork> = {
              practitionerId: session?.user.id,
              socialWorkId: values.socialWorkId,
              price: values.price,
            };
            const modal = document.getElementById(
              "obraSocialModal"
            ) as HTMLDialogElement;
            modal.close();
            Swal.fire({
              title: "Procesando solicitud",
              icon: "info",
              text: "Por favor espere...",
              showConfirmButton: false,
              allowOutsideClick: false,
              didOpen: async () => {
                
                if (editData) {
                  await updatePractitionerSocialWork({
                    token: session?.user.accessToken || "",
                    entity: { id: editData.id, price: values.price },
                  })
                    .unwrap()
                    .then(() => {
                      Swal.close();
                      Swal.fire({
                        title: "Éxito",
                        text: "Obra social actualizada correctamente",
                        icon: "success",
                      });
                    })
                    .catch((error) => {
                      Swal.close();
                      Swal.fire({
                        title: "Error",
                        text: "Error al actualizar la obra social",
                        icon: "error",
                      });
                    });
                } else {
                  await createPractitionerSocialWork({
                    token: session?.user.accessToken || "",
                    entity: practitionerSocialWork,
                  })
                    .unwrap()
                    .then(() => {
                      Swal.fire({
                        title: "Éxito",
                        text: "Obra social agregada correctamente",
                        icon: "success",
                      });
                      const modal = document.getElementById(
                        "obraSocialModal"
                      ) as HTMLDialogElement;
                      modal.close();
                    })
                    .catch((error) => {
                      Swal.fire({
                        title: "Error",
                        text: "Error al agregar la obra social",
                        icon: "error",
                      });
                    });
                }
              },
            });
          }}
        >
          <Form className="flex flex-col gap-4">
            <div>
              <label>Selecciona una obra social</label>
              <Field
                as="select"
                name="socialWorkId"
                className="select select-bordered w-full max-w-xs"
              >
                <option value="">Seleccione una obra social</option>
                {isLoading && <option value="">Cargando...</option>}
                {isError && <option value="">Error al cargar</option>}
                {socialWorks?.socialWorks.map((socialWork) => (
                  <option key={socialWork.id} value={socialWork.id}>
                    {socialWork.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="socialWorkId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label>Precio</label>
              <Field
                type="number"
                name="price"
                className="input input-bordered w-full max-w-xs"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full btn rounded-lg bg-[#48a7a8] text-white font-bold"
              >
                {editData ? "Modificar Obra Social" : "Agregar Obra Social"}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </dialog>
  );
}
