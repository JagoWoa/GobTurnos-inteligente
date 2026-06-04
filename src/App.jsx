import {
  Accessibility,
  AlertCircle,
  BarChart3,
  Bell,
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
  { name: "Agencia Centro", distance: "1.2 km", load: 28, recommended: true },
  { name: "Agencia Norte", distance: "4.8 km", load: 46, recommended: false },
  { name: "Agencia Sur", distance: "6.1 km", load: 61, recommended: false },
];

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("gobturnos-theme") || "light");
  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem("gobturnos-font-scale")) || 1);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--font-scale", fontScale.toString());
    localStorage.setItem("gobturnos-theme", theme);
    localStorage.setItem("gobturnos-font-scale", fontScale.toString());
  }, [theme, fontScale]);

  const accessibility = { theme, setTheme, fontScale, setFontScale };

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
    ? "Accede para solicitar turnos, revisar requisitos o atender desde ventanilla."
    : isSignup
      ? "Registra tus datos basicos para gestionar turnos propios o de representados."
      : "Te enviaremos instrucciones para restablecer el acceso cuando Supabase Auth este conectado.";

  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setNotice("Revisa los campos marcados antes de continuar.");
      form.reportValidity();
      return;
    }
    if (isRecovery) return;
    setNotice("Validacion local correcta. La autenticacion real se conectara con Supabase Auth.");
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
          <h2>Turnos sin filas innecesarias</h2>
          <p>
            La interfaz prioriza accesibilidad WCAG 2.2, lenguaje ciudadano y sugerencias
            inteligentes para elegir horarios con menor espera.
          </p>
          <div className="mini-grid">
            <Metric label="Espera estimada" value="12 min" />
            <Metric label="Agencia sugerida" value="Centro" />
            <Metric label="Accesibilidad" value="A + AA" />
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
            <p className="eyebrow">Sistema web institucional</p>
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
              En linea
            </span>
            <button className="icon-button" aria-label="Ver notificaciones">
              <Bell aria-hidden="true" />
            </button>
          </div>
        </header>
        <main id="contenido" className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ScheduleTurn() {
  const [status, setStatus] = useState("");

  const confirmTurn = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setStatus("Hay datos incompletos o con formato incorrecto.");
      form.reportValidity();
      return;
    }
    setStatus("Turno validado localmente. Listo para guardar cuando conectemos Supabase.");
  };

  return (
    <section className="work-grid two-columns">
      <article className="work-panel" aria-labelledby="schedule-form-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">RF1 Gestion de turnos</p>
            <h2 id="schedule-form-title">Datos del turno</h2>
          </div>
          <CalendarClock aria-hidden="true" />
        </div>
        <form className="form-grid" onSubmit={confirmTurn}>
          <Field id="cedula" label="Numero de cedula" inputMode="numeric" autoComplete="off" required pattern="[0-9]{10}" maxLength="10" helper="Ingrese 10 digitos." />
          <Field id="nombres" label="Nombres completos" autoComplete="name" required minLength="5" helper="Nombre y apellido del ciudadano." />
          <Field id="correo" label="Correo electronico" type="email" autoComplete="email" required helper="Debe tener formato correo@dominio." />
          <Field id="telefono" label="Numero telefonico" type="tel" autoComplete="tel" required pattern="[0-9+ ]{7,15}" helper="Solo numeros, espacios o signo +." />
          <SelectField id="tramite" label="Tipo de tramite" options={["Cedulacion", "Pasaporte", "Certificado municipal"]} />
          <SelectField id="agencia" label="Agencia" options={["Agencia Centro", "Agencia Norte", "Agencia Sur"]} />
          <Field id="fecha" label="Fecha" type="date" required />
          <SelectField id="hora" label="Hora disponible" options={["09:30", "10:15", "11:00", "14:30"]} />
          <button className="primary-button span-2" type="submit">
            <QrCode aria-hidden="true" />
            Confirmar y generar QR
          </button>
          {status && <p className="form-status span-2" role="status">{status}</p>}
        </form>
      </article>

      <aside className="insight-panel" aria-labelledby="ai-title">
        <div className="ai-orbit" aria-hidden="true">
          <Sparkles />
        </div>
        <p className="eyebrow">IA recomendada</p>
        <h2 id="ai-title">Horario sugerido: 09:30 AM</h2>
        <p>
          Recomendacion basada en menor congestion estimada, tiempos promedio de atencion y
          disponibilidad por agencia.
        </p>
        <div className="agency-list">
          {agencyOptions.map((agency) => (
            <div className="agency-row" key={agency.name}>
              <div>
                <strong>{agency.name}</strong>
                <span>{agency.distance} de distancia</span>
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
            Asistente: para renovacion por perdida, lleva tambien la denuncia o constancia
            correspondiente. Costo estimado: $16. Tiempo aproximado: 20 minutos.
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
    setStatus("Perfil validado. Al conectar Supabase se guardara en la tabla protegida por RLS.");
  };

  return (
    <section className="work-grid two-columns">
      <article className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">RF7 Gestion de perfil</p>
            <h2>Datos propios</h2>
          </div>
          <UserRound aria-hidden="true" />
        </div>
        <form className="form-grid" onSubmit={saveProfile}>
          <Field id="profile-id" label="Numero de cedula" defaultValue="0912345678" inputMode="numeric" pattern="[0-9]{10}" maxLength="10" required helper="Identificador principal, no editable en produccion sin validacion institucional." />
          <Field id="profile-name" label="Nombres completos" defaultValue="Jose Luis Sarabia Calderon" autoComplete="name" required minLength="5" />
          <Field id="profile-email" label="Correo electronico" type="email" defaultValue="jose@example.com" autoComplete="email" required />
          <Field id="profile-phone" label="Numero telefonico" type="tel" defaultValue="0999999999" autoComplete="tel" pattern="[0-9+ ]{7,15}" required />
          <Field id="profile-address" label="Direccion referencial" defaultValue="Guayaquil, Ecuador" autoComplete="street-address" minLength="6" />
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
            <p className="eyebrow">Seguridad de datos</p>
            <h2>Proteccion prevista</h2>
          </div>
          <ShieldCheck aria-hidden="true" />
        </div>
        <ul className="security-list">
          <li><LockIcon /> Campos validados antes de enviar.</li>
          <li><LockIcon /> Escritura futura solo para el usuario autenticado.</li>
          <li><LockIcon /> RLS obligatorio en tablas publicas de Supabase.</li>
          <li><LockIcon /> Secretos LLM y service_role fuera del cliente.</li>
        </ul>
      </aside>
    </section>
  );
}

function AccessibilityPage({ accessibility }) {
  const { theme, setTheme, fontScale, setFontScale } = accessibility;
  const decrease = () => setFontScale(Math.max(0.9, Number((fontScale - 0.1).toFixed(1))));
  const increase = () => setFontScale(Math.min(1.3, Number((fontScale + 0.1).toFixed(1))));

  return (
    <section className="work-grid two-columns">
      <article className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">WCAG 2.2 A + AA</p>
            <h2>Preferencias de accesibilidad</h2>
          </div>
          <Accessibility aria-hidden="true" />
        </div>
        <div className="accessibility-controls">
          <div className="control-row">
            <div>
              <strong>Tamano de letra</strong>
              <span>Actual: {Math.round(fontScale * 100)}%</span>
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
        </div>
      </article>

      <aside className="work-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Revision rapida</p>
            <h2>Criterios aplicados</h2>
          </div>
          <CheckCircle2 aria-hidden="true" />
        </div>
        <ul className="check-list">
          <li><CheckCircle2 aria-hidden="true" /> Foco visible para teclado.</li>
          <li><CheckCircle2 aria-hidden="true" /> Labels asociados a formularios.</li>
          <li><CheckCircle2 aria-hidden="true" /> Contraste de controles e iconos.</li>
          <li><CheckCircle2 aria-hidden="true" /> Modo claro/oscuro persistente.</li>
        </ul>
      </aside>
    </section>
  );
}

function MyTurns() {
  return (
    <section className="work-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">RF3 Administracion de turnos</p>
          <h2>Turnos registrados</h2>
        </div>
        <TicketCheck aria-hidden="true" />
      </div>
      <div className="turn-table" role="table" aria-label="Listado de turnos">
        <div className="table-row table-head" role="row">
          <span role="columnheader">Codigo</span>
          <span role="columnheader">Tramite</span>
          <span role="columnheader">Agencia</span>
          <span role="columnheader">Fecha</span>
          <span role="columnheader">Estado</span>
          <span role="columnheader">Acciones</span>
        </div>
        {userTurns.map((turn) => (
          <div className="table-row" role="row" key={turn.code}>
            <strong role="cell">{turn.code}</strong>
            <span role="cell">{turn.procedure}</span>
            <span role="cell">{turn.agency}</span>
            <span role="cell">
              {turn.date}, {turn.hour}
            </span>
            <span role="cell" className="status-badge">
              {turn.status}
            </span>
            <span role="cell" className="row-actions">
              <button className="icon-button" aria-label={`Ver QR del turno ${turn.code}`}>
                <QrCode aria-hidden="true" />
              </button>
              <button className="text-button">Reagendar</button>
              <button className="danger-button">Cancelar</button>
            </span>
          </div>
        ))}
      </div>
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
        Este modulo no forma parte del menu ciudadano. Cuando conectemos Supabase, el acceso se
        habilitara solo para cuentas institucionales con rol protegido por politicas de seguridad.
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

function LockIcon() {
  return <ShieldCheck aria-hidden="true" />;
}

function Field({ id, label, icon, type = "text", helper, ...props }) {
  const helpId = helper ? `${id}-help` : undefined;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <div className="input-wrap">
        {icon}
        <input id={id} name={id} type={type} aria-describedby={helpId} {...props} />
      </div>
      {helper && <small id={helpId} className="field-help">{helper}</small>}
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
