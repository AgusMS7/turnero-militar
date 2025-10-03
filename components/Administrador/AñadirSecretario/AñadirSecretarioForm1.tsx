import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";


interface Props {
  setFieldValue: Function;
  values: {
    urlImg: string;
    name: string;
    surename: string;
    email: string;
    birthDate: string;
    gender: string;
    phone: string;
    documentType: string;
    documentNumber: string;
  };
  errors: FormikErrors<{
    urlImg: string;
    name: string;
    surename: string;
    email: string;
    birthDate: string;
    gender: string;
    phone: string;
    documentType: string;
    documentNumber: string;
  }>;
  touched: FormikTouched<{
    urlImg: string;
    name: string;
    surename: string;
    email: string;
    birthDate: string;
    gender: string;
    phone: string;
    documentType: string;
    documentNumber: string;
  }>;
}

export function AñadirSecretarioForm1({ setFieldValue, values, errors, touched }: Props) {

  const { data: session, update } = useSession();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null)
  const [imgUrl, setImgUrl] = useState("/UserIconPlaceholder.jpg")

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!session) return;

      // Llamada al hosting para subir la imagen
      const formData = new FormData();
      formData.append("image", selectedFile);

      const hostRes = await fetch(
        "https://api-full-salud.vercel.app/api/auth/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
          body: formData,
        }
      );

      if (hostRes.ok) {
        const { url } = await hostRes.json();
        setFieldValue("urlImg", url)
        setImgUrl(url)

      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !session) return;

    // Llamada al hosting para subir la imagen
    const formData = new FormData();
    formData.append("image", file);

    const hostRes = await fetch(
      "https://api-full-salud.vercel.app/api/auth/upload",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
        body: formData,
      }
    );

    if (hostRes.ok) {
      const { url } = await hostRes.json();
      setFieldValue("urlImg", url)
      setImgUrl(url)

    }
  };
  return (
    <div className="flex flex-col justify-center xl:pl-60 md:pl-25 xl:pr-60 md:pr-25 gap-8">
      <div className="flex flex-row items-center justify-center gap-10">
        <div className="flex flex-col items-center">
          <img className="md:w-50 lg:w-40 w-30 md:h-50 lg:h-40 h-30 rounded-full" src={imgUrl} />
          <p className="text-2xs text-gray-400">(Opcional)</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3.5">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn xl:text-xl text-sm  bg-[#078B8C] text-white rounded-3xl"
          >
            <img src="/arrow-up-white.svg" />
            <p>Subir imagen</p>
          </button>
        </div>
        <ErrorMessage
          name="urlImg"
          component="div"
          className="text-[#ff0000] text-sm "
        />
      </div>

      <div>
        <label className="text-xl" htmlFor="name">Nombre</label>
        <Field
          type="text"
          name="name"
          placeholder="Ingresa tu nombre"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${errors.name && touched.name && "border border-red-500"
            }`}
        />

        <ErrorMessage
          name="name"
          component="div"
          className="text-[#ff0000] text-sm "
        />
      </div>
      <div>
        <label className="text-xl" htmlFor="surename">Apellido</label>
        <Field
          type="text"
          name="surename"
          placeholder="Ingresa tu apellido"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${errors.surename && touched.surename && "border border-red-500"
            }`}
        />

        <ErrorMessage
          name="surename"
          component="div"
          className="text-[#ff0000] text-sm "
        />
      </div>
      <div>
        <label className="text-xl" htmlFor="email">Email</label>
        <Field
          type="email"
          name="email"
          placeholder="ejemplo1234@gmail.com"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${errors.email && touched.email && "border border-red-500"
            }`}
        />

        <ErrorMessage
          name="email"
          component="div"
          className="text-[#ff0000] text-sm "
        />
      </div>
      <div>
        <label className="text-xl" htmlFor="surename">Fecha de nacimeinto</label>
        <Field
          type="date"
          name="birthDate"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${errors.birthDate && touched.birthDate && "border border-red-500"
            }`}
        />

        <ErrorMessage
          name="birthDate"
          component="div"
          className="text-[#ff0000] text-sm "
        />
      </div>
      <div>
        <label className="text-xl" htmlFor="specialtyId">Genero</label>
        <Field
          as="select"
          name="gender"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${errors.gender && touched.gender && "border border-red-500"
            }`}
        >
          <option value="">Seleccione...</option>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Prefiero no decir</option>
        </Field>
        <ErrorMessage
          name="gender"
          component="div"
          className="text-[#ff0000] text-sm "
        />
      </div>
      <div>
        <label className="text-xl" htmlFor="phone">Telefono</label>
        <Field
          type="text"
          name="phone"
          placeholder="Ingresa tu numero"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${errors.phone && touched.phone && "border border-red-500"
            }`}
        />
        <ErrorMessage
          name="phone"
          component="div"
          className="text-[#ff0000] text-sm "
        />
      </div>
      <div>
        <label className="text-xl" htmlFor="documentNumber">Numero de Documento</label>
        <Field
          type="text"
          name="documentNumber"
          placeholder="Numero"
          className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${errors.documentNumber && touched.documentNumber && "border border-red-500"
            }`}
        />
        <ErrorMessage
          name="documentNumber"
          component="div"
          className="text-[#ff0000] text-sm "
        />
      </div>

    </div>
  )
}
