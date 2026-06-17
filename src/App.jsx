import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { AuthPage, TermsPage } from "./pages/AuthPage";
import { AccessibilityPage, MyTurns, ProfilePage, RequirementsPage, ScheduleTurn } from "./pages/CitizenPages";
import { InstitutionalAccess } from "./pages/InstitutionalAccess";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("gobturnos-theme") || "light");
  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem("gobturnos-font-scale")) || 1);
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem("gobturnos-contrast") === "true");
  const [shortcutsEnabled, setShortcutsEnabled] = useState(() => localStorage.getItem("gobturnos-shortcuts") !== "false");
  const [audioGuide, setAudioGuide] = useState(() => localStorage.getItem("gobturnos-audio-guide") === "true");
  const [letterSpacing, setLetterSpacing] = useState(() => localStorage.getItem("gobturnos-letter-spacing") === "true");
  const [dyslexiaMode, setDyslexiaMode] = useState(() => localStorage.getItem("gobturnos-dyslexia") === "true");
  const [colorBlindMode, setColorBlindMode] = useState(() => localStorage.getItem("gobturnos-color-blind") === "true");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.contrast = highContrast ? "high" : "normal";
    document.documentElement.dataset.spacing = letterSpacing ? "wide" : "normal";
    document.documentElement.dataset.dyslexia = dyslexiaMode ? "on" : "off";
    document.documentElement.dataset.colorMode = colorBlindMode ? "daltonic" : "normal";
    document.documentElement.style.setProperty("--font-scale", fontScale.toString());
    localStorage.setItem("gobturnos-theme", theme);
    localStorage.setItem("gobturnos-font-scale", fontScale.toString());
    localStorage.setItem("gobturnos-contrast", highContrast.toString());
    localStorage.setItem("gobturnos-shortcuts", shortcutsEnabled.toString());
    localStorage.setItem("gobturnos-audio-guide", audioGuide.toString());
    localStorage.setItem("gobturnos-letter-spacing", letterSpacing.toString());
    localStorage.setItem("gobturnos-dyslexia", dyslexiaMode.toString());
    localStorage.setItem("gobturnos-color-blind", colorBlindMode.toString());
  }, [theme, fontScale, highContrast, shortcutsEnabled, audioGuide, letterSpacing, dyslexiaMode, colorBlindMode]);

  const accessibility = {
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

export default App;
