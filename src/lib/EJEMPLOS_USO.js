// EJEMPLOS DE USO DE FUNCIONES SUPABASE EN COMPONENTES

// ============================================
// 1. USO EN UN COMPONENTE DE LOGIN
// ============================================
import { signIn } from "./auth";
import { useState } from "react";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      const session = await signIn(email, password);
      console.log("Login exitoso:", session);
      // Redirigir al dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Iniciando..." : "Iniciar sesión"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

// ============================================
// 2. USO DEL CONTEXT SUPABASE EN CUALQUIER COMPONENTE
// ============================================
import { useSupabase } from "./SupabaseContext";

function MiComponente() {
  const { user, userTurns, loading, isSupabaseReady } = useSupabase();

  if (!isSupabaseReady) {
    return <p>Supabase no está configurado. Por favor configura el .env</p>;
  }

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (!user) {
    return <p>Por favor inicia sesión</p>;
  }

  return (
    <div>
      <h2>Bienvenido, {user.email}</h2>
      <h3>Tus turnos ({userTurns.length}):</h3>
      {userTurns.map((turn) => (
        <div key={turn.id}>
          <p>Código: {turn.code}</p>
          <p>Trámite: {turn.procedure}</p>
          <p>Fecha: {turn.scheduled_date}</p>
          <p>Estado: {turn.status}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// 3. CREAR UN NUEVO TURNO
// ============================================
import { saveTurn } from "./turns";
import { useSupabase } from "./SupabaseContext";

function SolicitudTurno() {
  const { user, setUserTurns, isSupabaseReady } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSaveTurn(procedureData) {
    if (!isSupabaseReady || !user) {
      setError("Debes tener Supabase configurado y estar autenticado");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const turnData = {
        userId: user.id,
        code: `GT-${Math.random().toString().slice(2, 6)}`,
        procedure: procedureData.procedure,
        agency: procedureData.agency,
        scheduledDate: procedureData.date,
        status: "Confirmado",
      };

      await saveTurn(turnData);
      
      // Recargar turnos del usuario
      const { getUserTurns } = require("./turns");
      const updatedTurns = await getUserTurns(user.id);
      setUserTurns(updatedTurns);
      
      alert("¡Turno creado exitosamente!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={() => handleSaveTurn({ procedure: "Cedula", agency: "Centro", date: new Date() })}>
        {loading ? "Guardando..." : "Solicitar turno"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

// ============================================
// 4. USAR EN DASHBOARD DE SUPERVISOR
// ============================================
import { getSupervisorStats, getTurnsByStatus, callTurn } from "./supervisor";

function SupervisorDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingTurns, setPendingTurns] = useState([]);
  const agency = "Agencia Centro"; // O del usuario actual

  useEffect(() => {
    async function loadData() {
      try {
        const stats = await getSupervisorStats(agency);
        setStats(stats);

        const turns = await getTurnsByStatus(agency, "Confirmado");
        setPendingTurns(turns);
      } catch (err) {
        console.error("Error cargando stats:", err);
      }
    }
    loadData();
  }, []);

  async function handleCallTurn(turnId) {
    try {
      await callTurn(turnId);
      alert("Turno llamado");
      // Recargar turnos
    } catch (err) {
      console.error("Error llamando turno:", err);
    }
  }

  return (
    <div>
      {stats && (
        <div>
          <p>Total: {stats.totalTurns}</p>
          <p>Atendidos: {stats.completedTurns}</p>
          <p>Pendientes: {stats.pendingTurns}</p>
        </div>
      )}
      <div>
        {pendingTurns.map((turn) => (
          <div key={turn.id}>
            <p>{turn.code} - {turn.users.full_name}</p>
            <button onClick={() => handleCallTurn(turn.id)}>Llamar turno</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 5. ACTUALIZAR PERFIL DEL USUARIO
// ============================================
import { updateUserProfile } from "./profile";

function EditarPerfil() {
  const { user } = useSupabase();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateUserProfile(user.id, {
        fullName,
        phone,
        documentType: "Cedula",
        documentNumber: "1234567890",
      });
      alert("Perfil actualizado");
    } catch (err) {
      console.error("Error actualizando perfil:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}

export { LoginComponent, MiComponente, SolicitudTurno, SupervisorDashboard, EditarPerfil };
