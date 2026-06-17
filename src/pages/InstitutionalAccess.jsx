import { ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

export function InstitutionalAccess({ role }) {
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
