import { supabase } from "./supabaseClient";

// Guardar un nuevo turno
export async function saveTurn(turnData) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase.from("turns").insert([
    {
      user_id: turnData.userId,
      code: turnData.code,
      procedure: turnData.procedure,
      agency: turnData.agency,
      scheduled_date: turnData.scheduledDate,
      status: turnData.status || "Confirmado",
      queue_position: turnData.queuePosition,
    },
  ]);

  if (error) throw error;
  return data;
}

// Obtener turnos del usuario actual
export async function getUserTurns(userId) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("turns")
    .select("*")
    .eq("user_id", userId)
    .order("scheduled_date", { ascending: true });

  if (error) throw error;
  return data;
}

// Obtener todos los turnos (solo supervisores)
export async function getAllTurns(agency = null) {
  if (!supabase) throw new Error("Supabase no está configurado");

  let query = supabase.from("turns").select("*, users(full_name, email)");

  if (agency) {
    query = query.eq("agency", agency);
  }

  const { data, error } = await query.order("scheduled_date", {
    ascending: true,
  });

  if (error) throw error;
  return data;
}

// Actualizar estado de un turno
export async function updateTurnStatus(turnId, status) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("turns")
    .update({ status, updated_at: new Date() })
    .eq("id", turnId);

  if (error) throw error;
  return data;
}

// Cancelar turno
export async function cancelTurn(turnId) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("turns")
    .update({ status: "Cancelado", updated_at: new Date() })
    .eq("id", turnId);

  if (error) throw error;
  return data;
}

// Obtener turno por código
export async function getTurnByCode(code) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("turns")
    .select("*, users(full_name, phone)")
    .eq("code", code)
    .single();

  if (error) throw error;
  return data;
}

// Suscribirse a cambios en tiempo real de turnos
export function onTurnsChange(callback, userId = null) {
  if (!supabase) return null;

  let subscription;

  if (userId) {
    subscription = supabase
      .from("turns")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "turns",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  } else {
    subscription = supabase
      .from("turns")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "turns",
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }

  return subscription;
}
