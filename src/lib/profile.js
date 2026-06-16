import { supabase } from "./supabaseClient";

// Obtener perfil del usuario
export async function getUserProfile(userId) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

// Actualizar perfil
export async function updateUserProfile(userId, profileData) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("users")
    .update({
      full_name: profileData.fullName,
      phone: profileData.phone,
      document_type: profileData.documentType,
      document_number: profileData.documentNumber,
      updated_at: new Date(),
    })
    .eq("id", userId);

  if (error) throw error;
  return data;
}

// Guardar preferencias de accesibilidad
export async function saveAccessibilityPreferences(userId, preferences) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("users")
    .update({
      accessibility_preferences: preferences,
      updated_at: new Date(),
    })
    .eq("id", userId);

  if (error) throw error;
  return data;
}

// Obtener preferencias de accesibilidad
export async function getAccessibilityPreferences(userId) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase
    .from("users")
    .select("accessibility_preferences")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.accessibility_preferences || {};
}
