Documentación de Turnero
Introducción
La siguiente documentación explica la opciones dentro de la pantalla “Ajustes”, para acceder a esta pantalla primero se debe crear una cuenta, verificar dicha cuenta y luego iniciar sesión, una vez se este en la pantalla inicial, en la parte inferior derecha esta la opción “Ajustes”.
Edición de datos del medico
1. Componente Raíz
Ubicación:” /app/medico/ajustes/perfil”
Este componente es una página de cliente (`"use client"`) que muestra el perfil de un profesional de salud (practitioner). Su funcionalidad principal es obtener los datos del médico autenticado mediante una consulta a la API y mostrar el formulario de edición de datos personales (`CambioForm`).
Funcionalidad:
- `useSession` de `next-auth`: Obtiene la sesión actual del usuario.
- `useLazyQuery` de `redux`: Permite disparar la consulta `getOnePractitioner` de forma manual.
- `useEffect`: Se utiliza para realizar la consulta apenas se obtiene el `id` del usuario desde la sesión.
- `CambioForm`: Componente visual y funcional que permite editar los datos del médico.
2. CambioForm
Formulario de edición del perfil del médico. Este componente permite visualizar y editar los datos personales como nombre, apellido, email, teléfono y avatar.
Elementos utilizados:
- `useSession`: Obtención de la sesión actual y actualización posterior de los datos del usuario.
- `useUpdatePractitionerMutation`: Mutación para enviar los datos actualizados del médico a la API.
- `AvatarForm`: Componente para visualizar y actualizar el avatar del médico.
- Se utiliza un esquema de `Zod` para validar los campos name`, `lastName`, `email` y `phone`.
Comportamiento del formulario:
- Se cargan los datos iniciales desde el prop `practitioner`.
- Si el usuario hace clic en “Editar”, los campos se habilitan para edición.
- Al enviar el formulario:
    - Se construye un objeto `TokenWithEntity` con los nuevos datos y el token del usuario.
    - Se envía la mutación `updatePractitioner`.
    - Si la actualización es exitosa:
        - Se actualiza la sesión.
        - Se muestra un mensaje de éxito con SweetAlert.
        - Se reinicia el componente de avatar.
        - Se desactiva el modo de edición.
Cambio de Contraseña del Médico
1. Componente Raíz
Ubicación:” /app/medico/ajustes/password”
Este componente representa una página cliente (`"use client"`) en Next.js cuyo único propósito es renderizar el componente `CambioPassword`.
2. CambioPassword
Este componente permite a un médico cambiar su contraseña mediante un formulario con validación y confirmación de seguridad.
Funcionalidad:
- Usa Formik para gestionar el estado del formulario.
- Utiliza validación con Zod para garantizar:
  - Que todos los campos estén completos.
  - Que la nueva contraseña tenga al menos 8 caracteres.
  - Que la confirmación coincida con la nueva contraseña.
- Al enviar, realiza una mutación `usePractitionerChangePasswordMutation` para actualizar la contraseña en el backend.
- Muestra mensajes modales de éxito o error utilizando SweetAlert2.
Horarios de atención
1. Componente Raíz 
Ubicación:” /app/medico/ajustes/turnero”
Este componente se encarga de cargar y mostrar los datos de configuración de turnos y obras sociales de un médico.
Funcionalidad:
- Usa `useLazyGetPractitionerAppointmentQuery` y `useLazyGetAllPractitionerSocialWorksQuery` para cargar turnos y obras sociales.
- Verifica la sesión del usuario con `useSession`.
- Almacena el ID del médico en `localStorage` si no está presente.
- Renderiza errores genéricos con `VistaErrorGenerico` si algo falla.
- Si la carga es exitosa, muestra los componentes.
2. HoraAtencionContainer
Este componente es el contenedor principal para gestionar y mostrar los horarios de atención de un profesional de la salud.
Funcionalidad:
- Muestra un título y una descripción informativa.
- Alterna entre una tabla de horarios (HorarioAtencionTable) y un formulario de modificación (HorarioAtencionForm) basado en un estado interno modifyFlag.
- Utiliza el estado de React (useState) para controlar si se está mostrando la tabla o el formulario.
Props:
- practitionerAppointments: Un arreglo de objetos PractitionerAppointment que representa los turnos disponibles del profesional.
3. HorarioAtencionTable
Este componente muestra una tabla con los horarios de atención del profesional.
Funcionalidad:
- Muestra una tabla con las columnas: Día, Hora Inicio y Hora Fin.
- Debajo de la tabla, se muestra la duración de los turnos en minutos.
- Incluye un botón para modificar los horarios, que activa el modo de edición al cambiar el estado modifyFlag.
Props:
- practitionerAppointments: Lista de turnos del profesional de la salud.
- setModify: Función para cambiar el estado del componente padre y habilitar la edición.
4. HoraAtencionForm
El componente permite a los profesionales de la salud configurar sus horarios de atención para cada día de la semana, especificando las horas de inicio y fin de atención. Además, pueden definir la duración de cada turno.
Props:
- `setModify`: Función para controlar el estado de modificación del formulario.
- `practitionerAppointments`: Lista de horarios del profesional, usada para inicializar el formulario.
Función Interna: `detectActiveDays`
Esta función detecta qué días están activos (es decir, tienen asignado un horario) y genera un arreglo con los días y sus horarios correspondientes.
Estados Iniciales
- Cada día de la semana tiene:
  - `enable`: booleano para indicar si el profesional trabaja ese día.
  - `horaInicio` y `horaFin`: campos tipo `time` para el rango horario.
  - `custom`: valor personalizado, si se necesita una validación adicional.
- `duracionTurno`: duración de los turnos en minutos.
Obra social
1. Componente Raíz 
Ubicación:” /app/medico/ajustes/turnero”
Este componente se encarga de cargar y mostrar los datos de configuración de turnos y obras sociales de un médico.
Funcionalidad:
- Usa `useLazyGetPractitionerAppointmentQuery` y `useLazyGetAllPractitionerSocialWorksQuery` para cargar turnos y obras sociales.
- Verifica la sesión del usuario con `useSession`.
- Almacena el ID del médico en `localStorage` si no está presente.
- Renderiza errores genéricos con `VistaErrorGenerico` si algo falla.
- Si la carga es exitosa, muestra los componentes.
2. Componente HorarioAtencionContainer
Este componente muestra el bloque de horarios de atención del consultorio del médico.
Props:
- `practitionerAppointments`: lista de horarios del médico.
Funcionalidad:
- Usa un estado booleano `modifyFlag` para alternar entre visualización (`HorarioAtencionTable`) y edición (`HorarioAtencionForm`).
3. Componente ObraSocialContainer
Este componente permite mostrar y editar las obras sociales y sus precios asociados.
Props:
- `practitionerSocialWork`: lista de obras sociales y sus precios.
Funcionalidad:
- Usa un estado booleano `modifyFlag` para alternar entre `ObraSocialTable` y `ObraSocialEdit`.
4. Componente ObraSocialTable
Muestra una tabla con las obras sociales y sus respectivos precios.
Props:
- `setModify`: función para habilitar el modo edición.
- `practitionerSocialWork`: lista de datos.
Elementos:
- Tabla con nombre de la obra social y precio.
- Botón "Modificar Precios" para activar edición.
5. Componente ObraSocialEdit
Permite editar precios y gestionar obras sociales (editar/eliminar/agregar).
Props:
- `setModify`: función para salir del modo edición.
- `practitionerSocialWork`: lista de datos.
Funcionalidad:
- Permite seleccionar un registro y abrir un modal (`ObraSocialModal`).
- Usa botones para editar (`/edit.svg`) y eliminar (`DeleteButton`).
- Agrega nuevas obras sociales con `AddButton`.
6. Componente ObraSocialModal
Formulario dentro de un modal para agregar o editar precios de obras sociales.
Props:
- `editData`: si hay datos, el modal está en modo edición; si no, modo creación.
Funcionalidad:
- Usa `Formik` para el formulario y `Zod` para validación.
- Carga obras sociales con `useLazyGetAllSocialWorksQuery`.
- Al enviar:
  - Si hay `editData`, actualiza el precio con `useUpdatePractitionerSocialWorkMutation`.
  - Si no, crea una nueva entrada con `useCreatePractitionerSocialWorkMutation`.
- Usa `SweetAlert2` para mostrar feedback al usuario.
Registro de usuario
1. Componente Raíz
Ubicación:” /app/register ”
Página de registro que carga el componente `RegistroUsuario`. Forma parte del flujo de registro para profesionales médicos.
2. RegistroUsuario
Formulario de registro multistep para médicos. Usa Formik + Zod para validaciones, y permite la creación de usuarios autenticados como médicos.
Funcionalidad:
- Validar campos usando Zod.
- Mostrar errores de registro.
- Dividir el formulario en 3 páginas (datos de acceso, verificación por SISA, datos personales).
- Realizar el registro mediante `signIn("signUp-practitioner", ...)`.
3. FormPage1
Primera página del formulario, permite ingresar el correo, contraseña y confirmar contraseña. 
Funcionalidad:
- Se asegura de que: 
- El formato del email sea correcto.
- Se ingrese una contraseña valida.
- Coincidan entre contraseñas.
- Props esperados:
- `values`: valores actuales del formulario.
- `errors`: errores actuales.
- `touched`: campos tocados.
- `showPassword`, `showConfirmPassword`: estado para mostrar u ocultar contraseñas.
-  `toggleShowPassword`, `toggleShowConfirmPassword`: funciones para alternar visibilidad.
4. FormPage2
Segunda página del formulario. Permite ingresar el número de documento (DNI) y buscar datos de SISA.
Funcionalidad:
- Buscar datos en SISA usando `useGetPractitionerSISADataQuery(dni)`.
- Autocompletar nombre y apellido con los datos obtenidos.
- Listar matrículas para seleccionar.
- Props esperados:
- `values`: valores actuales del formulario.
- `errors`: errores actuales.
- `touched`: campos tocados.
- `setFieldValue`: función para setear valores desde la respuesta de SISA.
5. FormPage3
Tercera página del formulario. Permite ingresar el resto de los datos personales del médico.
Funcionalidad:
- Modificar nombre y apellido (si es que el usuario lo desea)
- Ingresar fecha de nacimiento, teléfono, genero y si se realizan visitas hogareñas
- Props esperados:
- `values`: valores actuales del formulario.
- `errors`: errores actuales.
- `touched`: campos tocados.

6. NavigationBtn
Componente que permite navegar entre las páginas del formulario (`Siguiente`, `Atrás`, `Registrarse`).
Funcionalidad:
- Permitir la navegación entre páginas.
- Envío del formulario desde botón externo con `submitForm()`.
- Props esperados:
- `pageNumber` - número actual de página (1, 2 o 3).
- `setPageNumber` - función para cambiar de página.
- `formRef` - referencia al objeto Formik.
