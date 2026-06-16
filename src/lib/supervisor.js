import { supabase } from "./supabaseClient";

// Obtener estadísticas del dashboard del supervisor
export async function getSupervisorStats(agency) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data: allTurns, error: turnsError } = await supabase
    .from("turns")
    .select("status")
    .eq("agency", agency);

  if (turnsError) throw turnsError;

  const stats = {
    totalTurns: allTurns.length,
    completedTurns: allTurns.filter((t) => t.status === "Atendido").length,
    pendingTurns: allTurns.filter((t) => t.status === "Confirmado").length,
    canceledTurns: allTurns.filter((t) => t.status === "Cancelado").length,
  };

  return stats;
}

// Obtener turnos por estado
export async function getTurnsByStatus(agency, status) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("turns")
    .select("*, users(full_name, phone, email)")
    .eq("agency", agency)
    .eq("status", status)
    .order("scheduled_date", { ascending: true });

  if (error) throw error;
  return data;
}

// Obtener próximo turno en la cola
export async function getNextTurn(agency) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("turns")
    .select("*, users(full_name, phone)")
    .eq("agency", agency)
    .eq("status", "Confirmado")
    .order("queue_position", { ascending: true })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

// Llamar turno (cambiar a "Llamado")
export async function callTurn(turnId) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("turns")
    .update({ status: "Llamado", updated_at: new Date() })
    .eq("id", turnId);

  if (error) throw error;
  return data;
}

// Marcar turno como atendido
export async function markTurnAsServed(turnId) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("turns")
    .update({ status: "Atendido", updated_at: new Date() })
    .eq("id", turnId);

  if (error) throw error;
  return data;
}

// Obtener turnos de hoy
export async function getTodayTurns(agency) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from("turns")
    .select("*")
    .eq("agency", agency)
    .gte("scheduled_date", today.toISOString())
    .lt("scheduled_date", tomorrow.toISOString())
    .order("queue_position", { ascending: true });

  if (error) throw error;
  return data;
}
