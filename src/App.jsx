import {
  Accessibility,
  AlertCircle,
  BarChart3,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Home,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Minus,
  MonitorCheck,
  Moon,
  Phone,
  Plus,
  QrCode,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  TicketCheck,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { isSupabaseConfigured } from "./lib/supabaseClient";

const citizenProfile = {
  id: "0912345678",
  name: "Jose Luis Sarabia Calderon",
  email: "jose@example.com",
  phone: "0999999999",
  address: "Guayaquil, Ecuador",
  contact: "Correo electronico",
};

const userTurns = [
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

const queue = [
  { code: "A-017", name: "Martha Leon", procedure: "Renovacion de cedula", minutes: 7 },
  { code: "A-018", name: "Carlos Ibarra", procedure: "Pasaporte ordinario", minutes: 10 },
  { code: "B-006", name: "Lucia Vera", procedure: "Certificado municipal", minutes: 4 },
];

const requirements = {
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

const agencyOptions = [
  { name: "Agencia Centro", distance: "1.2 km", load: 28, estimatedWait: "12 min", recommended: true },
  { name: "Agencia Norte", distance: "4.8 km", load: 46, estimatedWait: "21 min", recommended: false },
  { name: "Agencia Sur", distance: "6.1 km", load: 61, estimatedWait: "32 min", recommended: false },
];

const wcagChecks = [
  "Sin contenido multimedia: no requiere subtitulos, transcripcion ni audiodescripcion.",
  "Todo se puede usar con teclado y foco visible.",
  "Atajos con Alt disponibles y se pueden desactivar.",
  "Labels, ayudas y mensajes de estado en formularios.",
  "No se usan gestos, arrastre ni movimiento del dispositivo.",
  "Texto ampliable hasta 200% y modo alto contraste.",
];

const nonApplicableChecks = [
  "Audio y video: no se usan archivos multimedia, por eso no requiere transcripcion, subtitulos ni audiodescripcion.",
  "Control de audio: no existe audio automatico.",
  "Gestos complejos, arrastre y movimiento del dispositivo: todas las acciones tienen alternativa por boton o teclado.",
  "Destellos: la interfaz no usa parpadeos ni animaciones de riesgo.",
];

const keyboardShortcuts = [
  { keys: "Alt + 1", label: "Solicitar turno", path: "/app/solicitar-turno" },
  { keys: "Alt + 2", label: "Requisitos", path: "/app/requisitos" },
  { keys: "Alt + 3", label: "Mis turnos", path: "/app/mis-turnos" },
  { keys: "Alt + 4", label: "Perfil", path: "/app/perfil" },
  { keys: "Alt + 5", label: "Accesibilidad", path: "/app/accesibilidad" },
];

const helpByPath = {
  "/app/solicitar-turno": "Completa tus datos, elige tramite, agencia, fecha y hora. Luego revisa la informacion antes de confirmar.",
  "/app/requisitos": "Selecciona el tipo de tramite para revisar documentos, costo y tiempo estimado antes de ir a la agencia.",
  "/app/mis-turnos": "Aqui puedes revisar tus turnos y probar las acciones de QR, reagendar o cancelar. Las acciones criticas piden confirmacion.",
  "/app/perfil": "Mantén actualizados tus datos de contacto para recibir comprobantes y avisos sobre tus turnos.",
  "/app/accesibilidad": "Ajusta texto, contraste, movimiento y atajos segun tus necesidades. Los cambios se guardan en este navegador.",
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("gobturnos-theme") || "light");
  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem("gobturnos-font-scale")) || 1);
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem("gobturnos-contrast") === "true");
  const [calmMode, setCalmMode] = useState(() => localStorage.getItem("gobturnos-calm") === "true");
  const [shortcutsEnabled, setShortcutsEnabled] = useState(() => localStorage.getItem("gobturnos-shortcuts") !== "false");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.contrast = highContrast ? "high" : "normal";
    document.documentElement.dataset.motion = calmMode ? "reduced" : "normal";
    document.documentElement.style.setProperty("--font-scale", fontScale.toString());
    localStorage.setItem("gobturnos-theme", theme);
    localStorage.setItem("gobturnos-font-scale", fontScale.toString());
    localStorage.setItem("gobturnos-contrast", highContrast.toString());
    localStorage.setItem("gobturnos-calm", calmMode.toString());
    localStorage.setItem("gobturnos-shortcuts", shortcutsEnabled.toString());
  }, [theme, fontScale, highContrast, calmMode, shortcutsEnabled]);

  const accessibility = {
    theme,
    setTheme,
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    calmMode,
    setCalmMode,
    shortcutsEnabled,
    setShortcutsEnabled,
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/iniciar-sesion" replace />} />
      <Route path="/iniciar-sesion" element={<AuthPage mode="login" />} />
      <Route path="/crear-cuenta" element={<AuthPage mode="signup" />} />
      <Route path="/recuperar-contrasena" element={<AuthPage mode="recovery" />} />
      <Route path="/terminos" element={<TermsPage />} />
      <Route path="/app" element={<AppShell accessibility={accessibility} />}>
        <Route index element={<Navigate to="/app/solicitar-turno" replace />} />
        <Route path="solicitar-turno" element={<ScheduleTurn />} />
        <Route path="requisitos" element={<RequirementsPage />} />
        <Route path="mis-turnos" element={<MyTurns />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="accesibilidad" element={<AccessibilityPage accessibility={accessibility} />} />
        <Route path="ventanilla" element={<InstitutionalAccess role="Funcionario de ventanilla" />} />
        <Route path="supervisor" element={<InstitutionalAccess role="Supervisor / Administrador" />} />
      </Route>
      <Route path="*" element={<Navigate to="/iniciar-sesion" replace />} />
    </Routes>
  );
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isRecovery = mode === "recovery";

  const title = isLogin
    ? "Inicio de sesion"
    : isSignup
      ? "Crear cuenta ciudadana"
      : "Recuperar contrasena";
  const subtitle = isLogin
    ? "Accede al prototipo ciudadano para solicitar turnos, revisar requisitos y gestionar tus datos."
    : isSignup
      ? "Registra tus datos basicos para gestionar turnos propios o de representados."
      : "Flujo visual para recuperar acceso. El envio real de correo se conectara con Supabase.";

  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setNotice("Revisa los campos marcados antes de continuar.");
      form.reportValidity();
      return;
    }
    if (isRecovery) return;
    setNotice("Campos correctos. Entrando al prototipo ciudadano.");
    navigate("/app/solicitar-turno");
  };

  return (
    <main className="auth-layout">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            GT
          </span>
          <div>
            <p className="eyebrow">GobTurnos Inteligente</p>
            <h1 id="auth-title">{title}</h1>
          </div>
        </div>

        <p className="auth-copy">{subtitle}</p>

        <form className="form-stack" onSubmit={submit}>
          {isSignup && (
            <Field
              id="fullName"
              label="Nombres completos"
              icon={<Users aria-hidden="true" />}
              autoComplete="name"
              placeholder="Ej. Maria Solis"
              required
              minLength="5"
              helper="Usa nombres y apellidos, sin abreviaturas."
            />
          )}
          {isSignup && (
            <div className="locked-role" role="note">
              <ShieldCheck aria-hidden="true" />
              <div>
                <strong>Rol de registro: Ciudadano</strong>
                <span>
                  Las cuentas de ventanilla y administracion seran asignadas por la institucion.
                </span>
              </div>
            </div>
          )}
          {!isRecovery && (
            <Field
              id="documentId"
              label="Numero de cedula"
              icon={<FileCheck2 aria-hidden="true" />}
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ej. 0912345678"
              required
              pattern="[0-9]{10}"
              maxLength="10"
              helper="Debe contener 10 digitos numericos."
            />
          )}
          <Field
            id="email"
            label="Correo electronico"
            icon={<Mail aria-hidden="true" />}
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            required
            helper="Usaremos este correo para comprobantes y recuperacion."
          />
          {!isRecovery && (
            <Field
              id="password"
              label="Contrasena"
              icon={<KeyRound aria-hidden="true" />}
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="Minimo 8 caracteres"
              required
              minLength="8"
              helper="No reutilices contrasenas de otros servicios."
            />
          )}
          {isSignup && (
            <label className="terms-check">
              <input type="checkbox" required />
              <span>
                Acepto los <NavLink to="/terminos">terminos y condiciones</NavLink> del sistema.
              </span>
            </label>
          )}
          <button className="primary-button" type="submit">
            {isRecovery ? <Mail aria-hidden="true" /> : isSignup ? <UserPlus aria-hidden="true" /> : <LogIn aria-hidden="true" />}
            {isRecovery ? "Enviar instrucciones" : isSignup ? "Crear cuenta" : "Ingresar al sistema"}
          </button>
          {notice && <p className="form-status" role="status">{notice}</p>}
        </form>

        <div className="auth-links" aria-label="Opciones de cuenta">
          {!isLogin && <NavLink to="/iniciar-sesion">Ya tengo cuenta</NavLink>}
          {!isSignup && <NavLink to="/crear-cuenta">Crear cuenta</NavLink>}
          {!isRecovery && <NavLink to="/recuperar-contrasena">Olvide mi contrasena</NavLink>}
        </div>
        {isLogin && (
          <p className="institutional-note">
            Funcionarios y supervisores ingresan con credenciales institucionales asignadas. No se
            registran desde el formulario publico.
          </p>
        )}
      </section>

      <aside className="auth-brief" aria-label="Resumen del sistema">
        <div className="system-card">
          <div className="status-line">
            <ShieldCheck aria-hidden="true" />
            <span>{isSupabaseConfigured ? "Supabase configurado" : "Supabase pendiente por .env"}</span>
          </div>
          <h2>Turnos claros, sin filas innecesarias</h2>
          <p>
            Prototipo web para validar el proceso ciudadano: solicitar turno, consultar requisitos,
            revisar tiempos estimados y gestionar datos personales con lenguaje simple.
          </p>
          <div className="mini-grid">
            <Metric label="Tiempo estimado" value="4 min" />
            <Metric label="Agencia sugerida" value="Centro" />
            <Metric label="Checklist WCAG" value="En prueba" />
          </div>
        </div>
      </aside>
    </main>
  );
}

function AppShell({ accessibility }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle =
    {
      "/app/solicitar-turno": "Solicitud de turno",
      "/app/requisitos": "Consulta de requisitos",
      "/app/mis-turnos": "Mis turnos",
      "/app/perfil": "Perfil y datos personales",
      "/app/accesibilidad": "Accesibilidad",
      "/app/ventanilla": "Atencion de ventanilla",
      "/app/supervisor": "Monitoreo",
    }[location.pathname] || "GobTurnos";

  useEffect(() => {
    document.title = `${pageTitle} | GobTurnos`;
  }, [pageTitle]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (!accessibility.shortcutsEnabled || !event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const shortcut = keyboardShortcuts.find((item) => item.keys.endsWith(event.key));
      if (!shortcut) return;
      event.preventDefault();
      navigate(shortcut.path);
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [accessibility.shortcutsEnabled, navigate]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <aside className="sidebar" aria-label="Navegacion principal">
        <div className="brand-lockup compact">
          <span className="brand-mark" aria-hidden="true">
            GT
          </span>
          <div>
            <strong>GobTurnos</strong>
            <small>Inteligente</small>
          </div>
        </div>
        <nav className="nav-list">
          <AppNav to="/app/solicitar-turno" icon={<CalendarClock />} label="Solicitar turno" />
          <AppNav to="/app/requisitos" icon={<ClipboardCheck />} label="Requisitos" />
          <AppNav to="/app/mis-turnos" icon={<TicketCheck />} label="Mis turnos" />
          <AppNav to="/app/perfil" icon={<UserRound />} label="Perfil" />
          <AppNav to="/app/accesibilidad" icon={<Accessibility />} label="Accesibilidad" />
        </nav>
        <button className="ghost-button logout" onClick={() => navigate("/iniciar-sesion")}>
          <LogOut aria-hidden="true" />
          Salir
        </button>
      </aside>

      <div className="content-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Prototipo ciudadano</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              aria-label={accessibility.theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              onClick={() => accessibility.setTheme(accessibility.theme === "dark" ? "light" : "dark")}
            >
              {accessibility.theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
            <span className="live-pill" role="status">
              <span aria-hidden="true" />
              Prototipo local
            </span>
          </div>
        </header>
        <main id="contenido" className="page-content">
          <section className="help-strip" aria-labelledby="page-help-title">
            <strong id="page-help-title">Ayuda de esta pantalla</strong>
            <p>{helpByPath[location.pathname] || "Usa el menu lateral o los atajos Alt + numero para moverte por el prototipo."}</p>
          </section>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ScheduleTurn() {
  const [status, setStatus] = useState("");
  const [useProfileData, setUseProfileData] = useState(false);
  const selectedAgency = agencyOptions[0];

  const confirmTurn = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setStatus("Hay datos incompletos o con formato incorrecto.");
      form.reportValidity();
      return;
    }
    setStatus("Datos revisados. En la version conectada se guardara el turno y se emitira el codigo QR.");
  };

  return (
    <section className="work-grid two-columns">
      <article className="work-panel" aria-labelledby="schedule-form-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">RF1 Solicitud de turno</p>
            <h2 id="schedule-form-title">Elige donde y cuando atenderte</h2>
          </div>
          <CalendarClock aria-hidden="true" />
        </div>
        <p className="panel-copy">
          Completar este formulario deberia tomar alrededor de 4 minutos. Los campos marcados como
          obligatorios se validan antes de continuar.
        </p>
        <form className="form-grid" onSubmit={confirmTurn}>
          <label className="terms-check span-2 use-profile-check">
            <input type="checkbox" checked={useProfileData} onChange={() => setUseProfileData(!useProfileData)} />
            <span>Usar mis datos guardados para evitar escribirlos otra vez.</span>
          </label>
          <Field id="cedula" label="Numero de cedula" defaultValue={useProfileData ? citizenProfile.id : ""} inputMode="numeric" autoComplete="off" required pattern="[0-9]{10}" maxLength="10" helper="Ingrese 10 digitos." error="La cedula debe tener exactamente 10 digitos numericos." />
          <Field id="nombres" label="Nombres completos" defaultValue={useProfileData ? citizenProfile.name : ""} autoComplete="name" required minLength="5" helper="Nombre y apellido del ciudadano." error="Escribe nombre y apellido completos." />
          <Field id="correo" label="Correo electronico" defaultValue={useProfileData ? citizenProfile.email : ""} type="email" autoComplete="email" required helper="Debe tener formato correo@dominio." error="Ingresa un correo valido, por ejemplo nombre@correo.com." />
          <Field id="telefono" label="Numero telefonico" defaultValue={useProfileData ? citizenProfile.phone : ""} type="tel" autoComplete="tel" required pattern="[0-9+ ]{7,15}" helper="Solo numeros, espacios o signo +." error="Ingresa entre 7 y 15 caracteres usando numeros, espacios o signo +." />
          <SelectField id="tramite" label="Tipo de tramite" options={["Cedulacion", "Pasaporte", "Certificado municipal"]} />
          <SelectField id="agencia" label="Agencia" options={["Agencia Centro", "Agencia Norte", "Agencia Sur"]} />
          <Field id="fecha" label="Fecha" type="date" required />
          <SelectField id="hora" label="Hora disponible" options={["09:30", "10:15", "11:00", "14:30"]} />
          <button className="primary-button span-2" type="submit">
            <QrCode aria-hidden="true" />
            Revisar datos del turno
          </button>
          {status && <p className="form-status span-2" role="status">{status}</p>}
        </form>
      </article>

      <aside className="insight-panel" aria-labelledby="ai-title">
        <div className="ai-orbit" aria-hidden="true">
          <Sparkles />
        </div>
        <p className="eyebrow">Sugerencia visible</p>
        <h2 id="ai-title">Mejor opcion: {selectedAgency.name}, 09:30</h2>
        <p>
          Se muestra una recomendacion simple con distancia, carga y espera estimada para que el
          ciudadano no dependa solo del color.
        </p>
        <div className="summary-card">
          <span>Espera estimada</span>
          <strong>{selectedAgency.estimatedWait}</strong>
          <small>Duracion aproximada del tramite: 20 min.</small>
        </div>
        <div className="agency-list">
          {agencyOptions.map((agency) => (
            <div className="agency-row" key={agency.name}>
              <div>
                <strong>{agency.name}</strong>
                <span>{agency.distance} - espera {agency.estimatedWait}</span>
              </div>
              <meter min="0" max="100" value={agency.load} aria-label={`Carga ${agency.name}: ${agency.load}%`} />
              {agency.recommended && <span className="tag">Sugerida</span>}
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

function RequirementsPage() {
  return (
    <section className="work-grid two-columns">
      <article className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">RF2 Consulta de requisitos</p>
            <h2>Buscar requisitos</h2>
          </div>
          <Search aria-hidden="true" />
        </div>
        <p className="panel-copy">
          Esta consulta evita viajes innecesarios. El usuario puede revisar documentos, costo y
          tiempo aproximado antes de confirmar un turno.
        </p>
        <form className="form-stack">
          <SelectField id="req-tramite" label="Tipo de tramite" options={["Cedula", "Pasaporte", "Certificado municipal"]} />
          <SelectField id="subcategoria" label="Subcategoria" options={["Primera vez", "Renovacion", "Perdida"]} />
          <SelectField id="provincia" label="Provincia o agencia" options={["Guayas - Centro", "Pichincha - Norte", "Azuay - Matriz"]} />
          <button className="secondary-button" type="button">
            <FileText aria-hidden="true" />
            Consultar requisitos
          </button>
        </form>
      </article>

      <article className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Resultado</p>
            <h2>Documentos obligatorios</h2>
          </div>
          <Bot aria-hidden="true" />
        </div>
        <ul className="check-list">
          {requirements.cedula.map((item) => (
            <li key={item}>
              <CheckCircle2 aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <div className="assistant-note" role="status">
          <Bot aria-hidden="true" />
          <p>
            Ayuda: para renovacion por perdida, lleva tambien la denuncia o constancia
            correspondiente. Costo estimado: $16. Tiempo aproximado de atencion: 20 minutos.
          </p>
        </div>
      </article>
    </section>
  );
}

function ProfilePage() {
  const [status, setStatus] = useState("");

  const saveProfile = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setStatus("No se guardo: corrige los campos senalados.");
      form.reportValidity();
      return;
    }
    setStatus("Datos revisados. En la version conectada se actualizaran en tu perfil ciudadano.");
  };

  return (
    <section className="work-grid two-columns">
      <article className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">RF7 Perfil ciudadano</p>
            <h2>Mis datos de contacto</h2>
          </div>
          <UserRound aria-hidden="true" />
        </div>
        <p className="panel-copy">
          Mantener estos datos actualizados permite recibir comprobantes y avisos sobre cambios de
          turno. No se muestran detalles tecnicos de seguridad porque no aportan a la tarea del ciudadano.
        </p>
        <form className="form-grid" onSubmit={saveProfile}>
          <Field id="profile-id" label="Numero de cedula" defaultValue={citizenProfile.id} inputMode="numeric" pattern="[0-9]{10}" maxLength="10" required helper="Identificador principal, no editable en produccion sin validacion institucional." error="La cedula debe tener 10 digitos." />
          <Field id="profile-name" label="Nombres completos" defaultValue={citizenProfile.name} autoComplete="name" required minLength="5" error="Escribe nombre y apellido completos." />
          <Field id="profile-email" label="Correo electronico" type="email" defaultValue={citizenProfile.email} autoComplete="email" required error="Ingresa un correo valido." />
          <Field id="profile-phone" label="Numero telefonico" type="tel" defaultValue={citizenProfile.phone} autoComplete="tel" pattern="[0-9+ ]{7,15}" required error="Ingresa un telefono valido." />
          <Field id="profile-address" label="Direccion referencial" defaultValue={citizenProfile.address} autoComplete="street-address" minLength="6" error="La direccion debe tener al menos 6 caracteres." />
          <SelectField id="profile-contact" label="Canal preferido" options={["Correo electronico", "SMS", "WhatsApp"]} />
          <button className="primary-button span-2" type="submit">
            <Save aria-hidden="true" />
            Guardar cambios
          </button>
          {status && <p className="form-status span-2" role="status">{status}</p>}
        </form>
      </article>

      <aside className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Uso para el ciudadano</p>
            <h2>Para que sirven estos datos</h2>
          </div>
          <Mail aria-hidden="true" />
        </div>
        <ul className="security-list practical-list">
          <li><CheckCircle2 aria-hidden="true" /> Enviar comprobantes y recordatorios.</li>
          <li><CheckCircle2 aria-hidden="true" /> Avisar cambios de fecha, agencia u horario.</li>
          <li><CheckCircle2 aria-hidden="true" /> Reusar datos y evitar escribirlos en cada tramite.</li>
          <li><CheckCircle2 aria-hidden="true" /> Mantener un historial consultable de atenciones.</li>
        </ul>
      </aside>
    </section>
  );
}

function AccessibilityPage({ accessibility }) {
  const {
    theme,
    setTheme,
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    calmMode,
    setCalmMode,
    shortcutsEnabled,
    setShortcutsEnabled,
  } = accessibility;
  const decrease = () => setFontScale(Math.max(0.9, Number((fontScale - 0.1).toFixed(1))));
  const increase = () => setFontScale(Math.min(2, Number((fontScale + 0.1).toFixed(1))));

  return (
    <section className="work-grid two-columns">
      <article className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Checklist WCAG 2.2</p>
            <h2>Preferencias de accesibilidad</h2>
          </div>
          <Accessibility aria-hidden="true" />
        </div>
        <div className="accessibility-controls">
          <div className="control-row">
            <div>
              <strong>Tamano de letra</strong>
              <span>Actual: {Math.round(fontScale * 100)}%. Se permite hasta 200%.</span>
            </div>
            <div className="stepper" aria-label="Cambiar tamano de letra">
              <button className="icon-button" type="button" onClick={decrease} aria-label="Disminuir letra">
                <Minus aria-hidden="true" />
              </button>
              <button className="icon-button" type="button" onClick={increase} aria-label="Aumentar letra">
                <Plus aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="control-row">
            <div>
              <strong>Modo visual</strong>
              <span>{theme === "dark" ? "Oscuro activo" : "Claro activo"}</span>
            </div>
            <button
              type="button"
              className={`switch ${theme === "dark" ? "is-on" : ""}`}
              role="switch"
              aria-checked={theme === "dark"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <span aria-hidden="true" />
              {theme === "dark" ? "Oscuro" : "Claro"}
            </button>
          </div>

          <div className="control-row">
            <div>
              <strong>Alto contraste</strong>
              <span>{highContrast ? "Activo para mejorar legibilidad" : "Disponible para baja vision"}</span>
            </div>
            <button
              type="button"
              className={`switch ${highContrast ? "is-on" : ""}`}
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast(!highContrast)}
            >
              <span aria-hidden="true" />
              {highContrast ? "Activo" : "Inactivo"}
            </button>
          </div>

          <div className="control-row">
            <div>
              <strong>Pausar movimiento</strong>
              <span>{calmMode ? "Actualizaciones visuales pausadas" : "Reduce distracciones si lo necesitas"}</span>
            </div>
            <button
              type="button"
              className={`switch ${calmMode ? "is-on" : ""}`}
              role="switch"
              aria-checked={calmMode}
              onClick={() => setCalmMode(!calmMode)}
            >
              <span aria-hidden="true" />
              {calmMode ? "Pausado" : "Normal"}
            </button>
          </div>

          <div className="control-row">
            <div>
              <strong>Atajos de teclado</strong>
              <span>{shortcutsEnabled ? "Activos con combinaciones Alt + numero" : "Desactivados para evitar acciones accidentales"}</span>
            </div>
            <button
              type="button"
              className={`switch ${shortcutsEnabled ? "is-on" : ""}`}
              role="switch"
              aria-checked={shortcutsEnabled}
              onClick={() => setShortcutsEnabled(!shortcutsEnabled)}
            >
              <span aria-hidden="true" />
              {shortcutsEnabled ? "Activos" : "Inactivos"}
            </button>
          </div>

          <div className="shortcut-panel" aria-label="Lista de atajos disponibles">
            {keyboardShortcuts.map((shortcut) => (
              <div className="shortcut-row" key={shortcut.keys}>
                <kbd>{shortcut.keys}</kbd>
                <span>{shortcut.label}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <aside className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Revision rapida</p>
            <h2>Evidencia para la prueba</h2>
          </div>
          <CheckCircle2 aria-hidden="true" />
        </div>
        <ul className="check-list">
          {wcagChecks.map((item) => (
            <li key={item}><CheckCircle2 aria-hidden="true" /> {item}</li>
          ))}
        </ul>
        <div className="non-applicable-box">
          <h3>Criterios no aplicables en este prototipo</h3>
          <ul className="check-list compact-list">
            {nonApplicableChecks.map((item) => (
              <li key={item}><AlertCircle aria-hidden="true" /> {item}</li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}

function MyTurns() {
  const [pendingAction, setPendingAction] = useState(null);

  const askConfirmation = (turn, action) => {
    setPendingAction({ turn, action });
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    setPendingAction(null);
  };

  return (
    <section className="work-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">RF3 Administracion de turnos</p>
          <h2>Mis turnos registrados</h2>
        </div>
        <TicketCheck aria-hidden="true" />
      </div>
      <p className="panel-copy">
        Las acciones aparecen con texto e icono para no depender solo del color. Cancelar o
        reagendar debera pedir confirmacion antes de guardar cambios reales.
      </p>
      {pendingAction && (
        <div className="confirmation-box" role="alert">
          <div>
            <strong>Confirma la accion</strong>
            <p>
              Vas a {pendingAction.action} el turno {pendingAction.turn.code} de {pendingAction.turn.procedure}.
              Esta accion se guardara cuando el sistema este conectado.
            </p>
          </div>
          <div className="confirmation-actions">
            <button className="secondary-button" type="button" onClick={() => setPendingAction(null)}>
              Volver
            </button>
            <button className={pendingAction.action === "cancelar" ? "danger-button" : "primary-button"} type="button" onClick={confirmAction}>
              Confirmar
            </button>
          </div>
        </div>
      )}
      <table className="turn-table">
        <caption>Listado de turnos registrados del ciudadano</caption>
        <thead>
          <tr>
            <th scope="col">Codigo</th>
            <th scope="col">Tramite</th>
            <th scope="col">Agencia</th>
            <th scope="col">Fecha</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {userTurns.map((turn) => (
            <tr key={turn.code}>
              <th scope="row">{turn.code}</th>
              <td>{turn.procedure}</td>
              <td>{turn.agency}</td>
              <td>{turn.date}, {turn.hour}</td>
              <td><span className="status-badge">{turn.status}</span></td>
              <td>
                <div className="row-actions">
                  <button className="icon-button" aria-label={`Ver QR del turno ${turn.code}`}>
                    <QrCode aria-hidden="true" />
                  </button>
                  <button className="text-button" type="button" onClick={() => askConfirmation(turn, "reagendar")}>Reagendar</button>
                  <button className="danger-button" type="button" onClick={() => askConfirmation(turn, "cancelar")}>Cancelar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function CounterPage() {
  return (
    <section className="work-grid counter-layout">
      <article className="now-serving">
        <p className="eyebrow">Ventanilla 03</p>
        <h2>A-017</h2>
        <p>Martha Leon - Renovacion de cedula</p>
        <div className="counter-actions">
          <button className="primary-button" type="button">
            <Phone aria-hidden="true" />
            Llamar siguiente
          </button>
          <button className="secondary-button" type="button">
            <AlertCircle aria-hidden="true" />
            Marcar ausente
          </button>
          <button className="secondary-button" type="button">
            <CheckCircle2 aria-hidden="true" />
            Finalizar atencion
          </button>
        </div>
      </article>
      <article className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Cola actual</p>
            <h2>Ciudadanos en espera</h2>
          </div>
          <Clock3 aria-hidden="true" />
        </div>
        <div className="queue-list">
          {queue.map((item) => (
            <div className="queue-item" key={item.code}>
              <strong>{item.code}</strong>
              <div>
                <span>{item.name}</span>
                <small>{item.procedure}</small>
              </div>
              <span>{item.minutes} min</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function SupervisorPage() {
  return (
    <section className="dashboard-grid">
      <MetricCard icon={<Users />} label="Ciudadanos en sala" value="42" trend="+18% ultima hora" />
      <MetricCard icon={<MonitorCheck />} label="Ventanillas activas" value="6/8" trend="2 en pausa" />
      <MetricCard icon={<Clock3 />} label="Espera promedio" value="14 min" trend="Meta: 15 min" />
      <MetricCard icon={<Sparkles />} label="Alerta IA" value="14:00" trend="Subira 40% la demanda" />
      <article className="work-panel wide">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">RF8 Monitoreo</p>
            <h2>Rendimiento por ventanilla</h2>
          </div>
          <BarChart3 aria-hidden="true" />
        </div>
        <div className="bar-chart" aria-label="Tiempos promedio por ventanilla">
          {[9, 12, 18, 11, 15, 8].map((value, index) => (
            <div className="bar-column" key={value + index}>
              <span style={{ height: `${value * 9}px` }} />
              <strong>V{index + 1}</strong>
              <small>{value}m</small>
            </div>
          ))}
        </div>
      </article>
      <article className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Acciones</p>
            <h2>Recomendacion operativa</h2>
          </div>
          <Sparkles aria-hidden="true" />
        </div>
        <p className="recommendation">
          Habilitar dos ventanillas adicionales para cedulacion antes de las 14:00 y mover un
          funcionario desde certificados, donde la carga esta baja.
        </p>
        <button className="secondary-button" type="button">
          <FileText aria-hidden="true" />
          Exportar reporte diario
        </button>
      </article>
    </section>
  );
}

function InstitutionalAccess({ role }) {
  return (
    <section className="work-panel access-denied">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Acceso institucional</p>
          <h2>{role}</h2>
        </div>
        <ShieldCheck aria-hidden="true" />
      </div>
      <p>
        Este modulo no aparece en el menu ciudadano para evitar confusiones. En la version conectada,
        funcionarios y supervisores entraran con credenciales institucionales.
      </p>
      <NavLink className="secondary-button" to="/app/solicitar-turno">
        Volver al panel ciudadano
      </NavLink>
    </section>
  );
}

function TermsPage() {
  return (
    <main className="terms-page">
      <article className="terms-card">
        <NavLink className="back-link" to="/iniciar-sesion">
          <Home aria-hidden="true" />
          Volver al inicio de sesion
        </NavLink>
        <h1>Terminos y condiciones</h1>
        <p>
          GobTurnos Inteligente administra datos personales solo para solicitud, atencion,
          consulta y seguimiento de turnos gubernamentales.
        </p>
        <h2>Uso de datos</h2>
        <p>
          Los datos de cedula, contacto y tramite se utilizaran para identificar al ciudadano,
          enviar recordatorios y mantener trazabilidad del servicio.
        </p>
        <h2>Uso de IA</h2>
        <p>
          Las recomendaciones inteligentes son apoyo orientativo. No reemplazan la validacion del
          funcionario ni decisiones institucionales obligatorias.
        </p>
        <h2>Seguridad</h2>
        <p>
          Las claves privadas, tokens de servicio y secretos LLM no deben publicarse en el cliente.
          La conexion real usara variables de entorno y politicas RLS en Supabase.
        </p>
      </article>
    </main>
  );
}

function Field({ id, label, icon, type = "text", helper, ...props }) {
  const { error, ...inputProps } = props;
  const helpId = helper ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <div className="input-wrap">
        {icon}
        <input id={id} name={id} type={type} aria-describedby={describedBy} {...inputProps} />
      </div>
      {helper && <small id={helpId} className="field-help">{helper}</small>}
      {error && <small id={errorId} className="field-error">{error}</small>}
    </label>
  );
}

function SelectField({ id, label, options }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} name={id}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function AppNav({ to, icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
      {icon}
      <span>{label}</span>
      <ChevronRight aria-hidden="true" />
    </NavLink>
  );
}

function Metric({ label, value }) {
  return (
    <div className="mini-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MetricCard({ icon, label, value, trend }) {
  return (
    <article className="metric-card">
      <div className="metric-icon" aria-hidden="true">
        {icon}
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </article>
  );
}

export default App;
