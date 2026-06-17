import { Accessibility, BookOpenCheck, Eye, Keyboard, Minus, MousePointer2, Plus, Type, Volume2 } from "lucide-react";
import { useState } from "react";

function MiniSwitch({ icon, label, active, onToggle }) {
  return (
    <button type="button" className={`floating-option ${active ? "is-active" : ""}`} aria-pressed={active} onClick={onToggle}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function FloatingAccessibilityMenu({ accessibility }) {
  const [open, setOpen] = useState(false);
  const {
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    audioGuide,
    setAudioGuide,
    shortcutsEnabled,
    setShortcutsEnabled,
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
    <div className={`floating-accessibility ${open ? "is-open" : ""}`}>
      {open && (
        <section className="floating-accessibility-panel" id="floating-accessibility-panel" aria-label="Menu flotante de accesibilidad">
          <div className="floating-panel-heading">
            <div>
              <strong>Accesibilidad</strong>
              <span>Ajustes rapidos del sitio</span>
            </div>
            <Accessibility aria-hidden="true" />
          </div>

          <div className="floating-font-row" aria-label="Cambiar tamano de letra">
            <button type="button" className="icon-button" onClick={decrease} aria-label="Disminuir letra">
              <Minus aria-hidden="true" />
            </button>
            <span>{Math.round(fontScale * 100)}%</span>
            <button type="button" className="icon-button" onClick={increase} aria-label="Aumentar letra">
              <Plus aria-hidden="true" />
            </button>
          </div>

          <div className="floating-options-grid">
            <MiniSwitch icon={<Eye aria-hidden="true" />} label="Alto contraste" active={highContrast} onToggle={() => setHighContrast(!highContrast)} />
            <MiniSwitch icon={<Type aria-hidden="true" />} label="Mas espaciado" active={letterSpacing} onToggle={() => setLetterSpacing(!letterSpacing)} />
            <MiniSwitch icon={<BookOpenCheck aria-hidden="true" />} label="Modo dislexia" active={dyslexiaMode} onToggle={() => setDyslexiaMode(!dyslexiaMode)} />
            <MiniSwitch icon={<Eye aria-hidden="true" />} label="Modo daltonico" active={colorBlindMode} onToggle={() => setColorBlindMode(!colorBlindMode)} />
            <MiniSwitch icon={<Volume2 aria-hidden="true" />} label="Audio guia" active={audioGuide} onToggle={() => setAudioGuide(!audioGuide)} />
            <MiniSwitch icon={<Keyboard aria-hidden="true" />} label="Atajos teclado" active={shortcutsEnabled} onToggle={() => setShortcutsEnabled(!shortcutsEnabled)} />
          </div>

          <p className="floating-hint">
            Con atajos activos: Alt + numero cambia de pantalla y las flechas mueven el foco. Enter o Espacio activa controles.
          </p>
        </section>
      )}

      <button
        type="button"
        className="floating-accessibility-button"
        aria-label={open ? "Cerrar menu de accesibilidad" : "Abrir menu de accesibilidad"}
        aria-expanded={open}
        aria-controls="floating-accessibility-panel"
        onClick={() => setOpen(!open)}
      >
        <MousePointer2 aria-hidden="true" />
        <Accessibility aria-hidden="true" />
      </button>
    </div>
  );
}
