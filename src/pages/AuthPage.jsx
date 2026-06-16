import { FileCheck2, Home, KeyRound, LogIn, Mail, ShieldCheck, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Field } from "../components/FormControls";
import { Metric } from "../components/Metrics";
import { isSupabaseConfigured } from "../lib/supabaseClient";

export function AuthPage({ mode }) {
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
                <span>Las cuentas de ventanilla y administracion seran asignadas por la institucion.</span>
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

export function TermsPage() {
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
