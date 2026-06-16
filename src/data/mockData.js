export const citizenProfile = {
  id: "0912345678",
  name: "Jose Luis Sarabia Calderon",
  email: "jose@example.com",
  phone: "0999999999",
  address: "Guayaquil, Ecuador",
  contact: "Correo electronico",
};

export const userTurns = [
  {
    code: "GT-2048",
    citizen: "Jose Luis Sarabia",
    procedure: "Cedulacion",
    agency: "Agencia Centro",
    date: "Viernes 05 Jun",
    hour: "09:30",
    status: "Confirmado",
    wait: "Baja espera",
  },
  {
    code: "GT-2091",
    citizen: "Ami Ocampo",
    procedure: "Pasaporte",
    agency: "Agencia Norte",
    date: "Lunes 08 Jun",
    hour: "11:00",
    status: "Pendiente",
    wait: "Media espera",
  },
];

export const queue = [
  { code: "A-017", name: "Martha Leon", procedure: "Renovacion de cedula", minutes: 7 },
  { code: "A-018", name: "Carlos Ibarra", procedure: "Pasaporte ordinario", minutes: 10 },
  { code: "B-006", name: "Lucia Vera", procedure: "Certificado municipal", minutes: 4 },
];

export const requirements = {
  cedula: [
    "Cedula anterior o denuncia por perdida",
    "Comprobante de pago",
    "Turno confirmado con codigo QR",
  ],
  pasaporte: [
    "Cedula vigente",
    "Comprobante de pago",
    "Presencia obligatoria del solicitante",
  ],
  municipal: [
    "Numero de predio o identificacion",
    "Correo electronico activo",
    "No mantener valores pendientes",
  ],
};

export const agencyOptions = [
  { name: "Agencia Centro", distance: "1.2 km", load: 28, estimatedWait: "12 min", recommended: true },
  { name: "Agencia Norte", distance: "4.8 km", load: 46, estimatedWait: "21 min", recommended: false },
  { name: "Agencia Sur", distance: "6.1 km", load: 61, estimatedWait: "32 min", recommended: false },
];

export const wcagChecks = [
  "Sin contenido multimedia: no requiere subtitulos, transcripcion ni audiodescripcion.",
  "Todo se puede usar con teclado y foco visible.",
  "Atajos con Alt disponibles y se pueden desactivar.",
  "Labels, ayudas y mensajes de estado en formularios.",
  "No se usan gestos, arrastre ni movimiento del dispositivo.",
  "Texto ampliable hasta 200% y modo alto contraste.",
];

export const nonApplicableChecks = [
  "Audio y video: no se usan archivos multimedia, por eso no requiere transcripcion, subtitulos ni audiodescripcion.",
  "Control de audio: no existe audio automatico.",
  "Gestos complejos, arrastre y movimiento del dispositivo: todas las acciones tienen alternativa por boton o teclado.",
  "Destellos: la interfaz no usa parpadeos ni animaciones de riesgo.",
];

export const keyboardShortcuts = [
  { keys: "Alt + 1", label: "Solicitar turno", path: "/app/solicitar-turno" },
  { keys: "Alt + 2", label: "Requisitos", path: "/app/requisitos" },
  { keys: "Alt + 3", label: "Mis turnos", path: "/app/mis-turnos" },
  { keys: "Alt + 4", label: "Perfil", path: "/app/perfil" },
  { keys: "Alt + 5", label: "Accesibilidad", path: "/app/accesibilidad" },
];

export const helpByPath = {
  "/app/solicitar-turno": "Completa tus datos, elige tramite, agencia, fecha y hora. Luego revisa la informacion antes de confirmar.",
  "/app/requisitos": "Selecciona el tipo de tramite para revisar documentos, costo y tiempo estimado antes de ir a la agencia.",
  "/app/mis-turnos": "Aqui puedes revisar tus turnos y probar las acciones de QR, reagendar o cancelar. Las acciones criticas piden confirmacion.",
  "/app/perfil": "Manten actualizados tus datos de contacto para recibir comprobantes y avisos sobre tus turnos.",
  "/app/accesibilidad": "Ajusta texto, contraste, movimiento y atajos segun tus necesidades. Los cambios se guardan en este navegador.",
};
