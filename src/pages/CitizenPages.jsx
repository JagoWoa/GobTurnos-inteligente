import {
  Accessibility,
  AlertCircle,
  Bot,
  CalendarClock,
  CheckCircle2,
  FileText,
  Mail,
  Minus,
  Plus,
  QrCode,
  Save,
  Search,
  Sparkles,
  TicketCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Field, SelectField } from "../components/FormControls";
import { PreferenceSwitch } from "../components/PreferenceSwitch";
import {
  agencyOptions,
  citizenProfile,
  keyboardShortcuts,
  nonApplicableChecks,
  requirements,
  userTurns,
  wcagChecks,
} from "../data/mockData";

export function ScheduleTurn() {
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

export function RequirementsPage() {
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

export function ProfilePage() {
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

export function AccessibilityPage({ accessibility }) {
  const {
    theme,
    setTheme,
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    shortcutsEnabled,
    setShortcutsEnabled,
    audioGuide,
    setAudioGuide,
    letterSpacing,
    setLetterSpacing,
    dyslexiaMode,
    setDyslexiaMode,
    colorBlindMode,
    setColorBlindMode,
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
            <button type="button" className={`switch ${theme === "dark" ? "is-on" : ""}`} role="switch" aria-checked={theme === "dark"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <span aria-hidden="true" />
              {theme === "dark" ? "Oscuro" : "Claro"}
            </button>
          </div>

          <PreferenceSwitch label="Alto contraste" active={highContrast} onToggle={() => setHighContrast(!highContrast)} activeText="Activo para mejorar legibilidad" inactiveText="Disponible para baja vision" onLabel="Activo" offLabel="Inactivo" />
          <PreferenceSwitch label="Atajos de teclado" active={shortcutsEnabled} onToggle={() => setShortcutsEnabled(!shortcutsEnabled)} activeText="Activos: Alt + numero y flechas para mover el foco" inactiveText="Desactivados para evitar acciones accidentales" onLabel="Activos" offLabel="Inactivos" />
          <PreferenceSwitch label="Audio descripcion" active={audioGuide} onToggle={() => setAudioGuide(!audioGuide)} activeText="Lee en voz alta el control al pasar encima o enfocarlo" inactiveText="Disponible para apoyo auditivo durante la navegacion" onLabel="Activa" offLabel="Inactiva" />
          <PreferenceSwitch label="Separar aun mas las letras" active={letterSpacing} onToggle={() => setLetterSpacing(!letterSpacing)} activeText="Espaciado amplio entre letras y palabras" inactiveText="Ayuda a lectura lenta o baja vision" onLabel="Amplio" offLabel="Normal" />
          <PreferenceSwitch label="Modo dislexia" active={dyslexiaMode} onToggle={() => setDyslexiaMode(!dyslexiaMode)} activeText="Tipografia simple, mas altura de linea y lectura mas calmada" inactiveText="Disponible para mejorar reconocimiento de texto" onLabel="Activo" offLabel="Inactivo" />
          <PreferenceSwitch label="Modo daltonico" active={colorBlindMode} onToggle={() => setColorBlindMode(!colorBlindMode)} activeText="Paleta azul/naranja y estados reforzados con texto" inactiveText="Evita depender solo de verde/rojo" onLabel="Activo" offLabel="Inactivo" />

          <div className="shortcut-panel" aria-label="Lista de atajos disponibles">
            {keyboardShortcuts.map((shortcut) => (
              <div className="shortcut-row" key={shortcut.keys}>
                <kbd>{shortcut.keys}</kbd>
                <span>{shortcut.label}</span>
              </div>
            ))}
            <div className="shortcut-row">
              <kbd>Flechas</kbd>
              <span>Mover foco si la navegacion con flechas esta activa.</span>
            </div>
            <div className="shortcut-row">
              <kbd>Enter</kbd>
              <span>Activar el boton, enlace o control enfocado.</span>
            </div>
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

export function MyTurns() {
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
