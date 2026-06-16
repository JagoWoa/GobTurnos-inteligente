import { Accessibility, CalendarClock, ClipboardCheck, LogOut, Moon, Sun, TicketCheck, UserRound } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppNav } from "../components/AppNav";
import { helpByPath, keyboardShortcuts } from "../data/mockData";

const pageTitles = {
  "/app/solicitar-turno": "Solicitud de turno",
  "/app/requisitos": "Consulta de requisitos",
  "/app/mis-turnos": "Mis turnos",
  "/app/perfil": "Perfil y datos personales",
  "/app/accesibilidad": "Accesibilidad",
  "/app/ventanilla": "Atencion de ventanilla",
  "/app/supervisor": "Monitoreo",
};

export function AppShell({ accessibility }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "GobTurnos";

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
