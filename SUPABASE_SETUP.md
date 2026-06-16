# 🚀 Guía de Integración Supabase - GobTurnos Inteligente

## ✅ COMPLETADO HASTA AHORA

1. ✅ Archivo `.env` configurado con credenciales Supabase
2. ✅ Cliente Supabase inicializado (`src/lib/supabaseClient.js`)
3. ✅ Funciones de Autenticación (`src/lib/auth.js`)
4. ✅ Funciones de Turnos (`src/lib/turns.js`)
5. ✅ Funciones de Procedimientos (`src/lib/procedures.js`)
6. ✅ Funciones de Perfil (`src/lib/profile.js`)
7. ✅ Funciones de Supervisor (`src/lib/supervisor.js`)
8. ✅ Context Supabase (`src/lib/SupabaseContext.jsx`)
9. ✅ Main.jsx actualizado con SupabaseProvider

---

## 🔧 PASOS PENDIENTES EN SUPABASE

### PASO 1: Crear las tablas
En tu panel de Supabase (https://app.supabase.com):
1. Ve a **SQL Editor**
2. Haz clic en **New query**
3. Ejecuta este SQL:

```sql
-- Tabla de usuarios
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  phone text,
  document_type text,
  document_number text unique,
  accessibility_preferences jsonb default '{}',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Tabla de procedimientos
create table if not exists procedures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  agency text not null,
  requirements text[],
  duration_minutes integer,
  available_slots integer,
  created_at timestamp default now()
);

-- Tabla de turnos
create table if not exists turns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  code text unique not null,
  procedure_id uuid references procedures(id),
  procedure text not null,
  agency text not null,
  scheduled_date timestamp not null,
  status text default 'Confirmado',
  queue_position integer,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Tabla de supervisor
create table if not exists supervisor_dashboard (
  id uuid primary key default gen_random_uuid(),
  supervisor_email text not null,
  agency text not null,
  total_turns_today integer default 0,
  completed_turns integer default 0,
  pending_turns integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

### PASO 2: Activar RLS (Seguridad)
1. Ve a **Authentication → Policies** en Supabase
2. Haz clic en la tabla `users` → **New Policy**
3. Selecciona "For SELECT"
4. Condición: `auth.uid() = id` (Los usuarios solo ven su perfil)
5. Repite para tabla `turns` con condición: `auth.uid() = user_id`

### PASO 3: Habilitar Auth
1. Ve a **Authentication → Providers**
2. Asegúrate de que "Email" esté habilitado

---

## 📝 CÓMO USAR EN TUS COMPONENTES

### Ejemplo 1: Acceder al usuario actual y sus turnos

```jsx
import { useSupabase } from "./lib/SupabaseContext";

function MiComponente() {
  const { user, userTurns, loading } = useSupabase();

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>Por favor inicia sesión</p>;

  return (
    <div>
      <h2>Bienvenido, {user.email}</h2>
      <ul>
        {userTurns.map((turn) => (
          <li key={turn.id}>{turn.code} - {turn.status}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Ejemplo 2: Crear un nuevo turno

```jsx
import { saveTurn } from "./lib/turns";
import { useSupabase } from "./lib/SupabaseContext";

function SolicitudTurno() {
  const { user, setUserTurns } = useSupabase();

  async function handleRequest() {
    const turnData = {
      userId: user.id,
      code: "GT-" + Date.now(),
      procedure: "Cedula",
      agency: "Agencia Centro",
      scheduledDate: new Date(),
      status: "Confirmado"
    };
    
    await saveTurn(turnData);
    // Recargar turnos
    const updated = await getUserTurns(user.id);
    setUserTurns(updated);
  }

  return <button onClick={handleRequest}>Solicitar turno</button>;
}
```

### Ejemplo 3: Dashboard del Supervisor

```jsx
import { getSupervisorStats, getTurnsByStatus } from "./lib/supervisor";
import { useEffect, useState } from "react";

function Supervisor() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getSupervisorStats("Agencia Centro");
      setStats(data);
    }
    load();
  }, []);

  return (
    <div>
      <p>Total hoy: {stats?.totalTurns}</p>
      <p>Atendidos: {stats?.completedTurns}</p>
      <p>Pendientes: {stats?.pendingTurns}</p>
    </div>
  );
}
```

---

## 📁 ESTRUCTURA DE ARCHIVOS CREADOS

```
src/lib/
├── supabaseClient.js          # Cliente Supabase (ya existía, ahora configurado)
├── auth.js                    # Login, registro, logout
├── turns.js                   # CRUD de turnos
├── procedures.js              # Gestión de procedimientos
├── profile.js                 # Perfil del usuario
├── supervisor.js              # Dashboard del supervisor
├── SupabaseContext.jsx        # Context global con estado
└── EJEMPLOS_USO.js            # Este archivo con ejemplos

src/
├── main.jsx                   # Actualizado con SupabaseProvider
├── App.jsx                    # Tu componente principal
└── ...
```

---

## 🔑 VARIABLES DE ENTORNO

Tu `.env` ya está configurado:
```
VITE_SUPABASE_URL=https://hpzrpjabgitesuujsob.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_VpZmkaXOa8wEbqeY4rBY-Q_scI1BEzR
```

---

## ✨ FUNCIONES DISPONIBLES

### Auth (`src/lib/auth.js`)
- `signUp(email, password, fullName)` - Registrar usuario
- `signIn(email, password)` - Iniciar sesión
- `signOut()` - Cerrar sesión
- `getCurrentUser()` - Obtener usuario actual
- `onAuthStateChange(callback)` - Escuchar cambios

### Turnos (`src/lib/turns.js`)
- `saveTurn(turnData)` - Crear turno
- `getUserTurns(userId)` - Obtener turnos del usuario
- `getAllTurns(agency)` - Obtener todos los turnos (admin)
- `updateTurnStatus(turnId, status)` - Cambiar estado
- `cancelTurn(turnId)` - Cancelar turno
- `getTurnByCode(code)` - Buscar por código

### Procedimientos (`src/lib/procedures.js`)
- `getProcedures()` - Lista de procedimientos
- `getProceduresByAgency(agency)` - Por agencia
- `getProcedureRequirements(name)` - Requisitos

### Perfil (`src/lib/profile.js`)
- `getUserProfile(userId)` - Obtener perfil
- `updateUserProfile(userId, data)` - Actualizar
- `saveAccessibilityPreferences(userId, prefs)` - Guardar prefs

### Supervisor (`src/lib/supervisor.js`)
- `getSupervisorStats(agency)` - Estadísticas
- `getTurnsByStatus(agency, status)` - Turnos por estado
- `getNextTurn(agency)` - Próximo turno
- `callTurn(turnId)` - Llamar turno
- `markTurnAsServed(turnId)` - Marcar como atendido

---

## 🚨 PRÓXIMOS PASOS

1. **Crea las tablas en Supabase** (PASO 1 arriba)
2. **Activa RLS** (PASO 2 arriba)
3. **Reemplaza el mock data en App.jsx** con llamadas reales a Supabase
4. **Conecta el formulario de login** con `signIn()`
5. **Conecta solicitud de turno** con `saveTurn()`
6. **Implementa dashboard supervisor** con `getSupervisorStats()`

---

## 💬 ¿Preguntas?

- Ver ejemplos completos en: `src/lib/EJEMPLOS_USO.js`
- Documentación Supabase: https://supabase.com/docs
- Documentación de React: https://react.dev
