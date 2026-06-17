import { Accessibility, CalendarClock, ClipboardCheck, LogOut, Moon, Sun, TicketCheck, UserRound } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppNav } from "../components/AppNav";
import { FloatingAccessibilityMenu } from "../components/FloatingAccessibilityMenu";
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

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function isTextEntry(element) {
  return ["INPUT", "SELECT", "TEXTAREA"].includes(element?.tagName) || element?.isContentEditable;
}

function getVisibleFocusableElements() {
  return Array.from(document.querySelectorAll(focusableSelector)).filter((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  });
}

function getReadableLabel(element) {
  if (!element) return "";

  const labelledBy = element.getAttribute("aria-labelledby");
  const labelledText = labelledBy
    ?.split(" ")
    .map((id) => document.getElementById(id)?.innerText?.trim())
    .filter(Boolean)
    .join(". ");
  const explicitLabel = element.id ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.innerText?.trim() : "";
  const text = element.getAttribute("aria-label")
    || labelledText
    || explicitLabel
    || element.placeholder
    || element.title
    || element.innerText
    || element.value
    || element.getAttribute("role")
    || element.tagName;

  return text.replace(/\s+/g, " ").trim().slice(0, 160);
}

export function AppShell({ accessibility }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "GobTurnos";

  useEffect(() => {
    document.title = `${pageTitle} | GobTurnos`;
  }, [pageTitle]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (accessibility.shortcutsEnabled && ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key) && !isTextEntry(document.activeElement)) {
        const focusableElements = getVisibleFocusableElements();
        if (!focusableElements.length) return;

        const currentIndex = focusableElements.indexOf(document.activeElement);
        const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
        const nextIndex = currentIndex === -1
          ? 0
          : (currentIndex + direction + focusableElements.length) % focusableElements.length;

        event.preventDefault();
        focusableElements[nextIndex].focus();
        return;
      }

      if (!accessibility.shortcutsEnabled || !event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      const shortcut = keyboardShortcuts.find((item) => item.keys.endsWith(event.key));
      if (!shortcut) return;

      event.preventDefault();
      navigate(shortcut.path);
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [accessibility.shortcutsEnabled, navigate]);

  useEffect(() => {
    if (!accessibility.audioGuide || !("speechSynthesis" in window)) return undefined;

    let lastSpoken = "";
    let lastSpokenAt = 0;

    const speakElement = (event) => {
      const readableLabel = getReadableLabel(event.target);
      if (!readableLabel) return;
      const now = Date.now();
      if (readableLabel === lastSpoken && now - lastSpokenAt < 1200) return;

      lastSpoken = readableLabel;
      lastSpokenAt = now;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(readableLabel);
      utterance.lang = "es-EC";
      utterance.rate = 0.94;
      window.speechSynthesis.speak(utterance);
    };

    document.addEventListener("focusin", speakElement);
    document.addEventListener("mouseover", speakElement);

    return () => {
      document.removeEventListener("focusin", speakElement);
      document.removeEventListener("mouseover", speakElement);
      window.speechSynthesis.cancel();
    };
  }, [accessibility.audioGuide]);

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
      <FloatingAccessibilityMenu accessibility={accessibility} />
    </div>
  );
}
