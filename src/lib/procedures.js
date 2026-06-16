import { supabase } from "./supabaseClient";

// Obtener todos los procedimientos
export async function getProcedures() {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("procedures")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

// Obtener procedimientos por agencia
export async function getProceduresByAgency(agency) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("procedures")
    .select("*")
    .eq("agency", agency)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

// Crear procedimiento (admin)
export async function createProcedure(procedureData) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase.from("procedures").insert([
    {
      name: procedureData.name,
      agency: procedureData.agency,
      requirements: procedureData.requirements,
      duration_minutes: procedureData.durationMinutes,
      available_slots: procedureData.availableSlots,
    },
  ]);

  if (error) throw error;
  return data;
}

// Obtener requisitos de un procedimiento
export async function getProcedureRequirements(procedureName) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("procedures")
    .select("requirements")
    .eq("name", procedureName)
    .single();

  if (error) throw error;
  return data?.requirements || [];
}
