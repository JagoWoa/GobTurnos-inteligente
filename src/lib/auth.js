import { supabase } from "./supabaseClient";

// Registrar nuevo usuario
export async function signUp(email, password, fullName) {
  if (!supabase) throw new Error("Supabase no está configurado");

  // 1. Crear usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  // 2. Crear perfil en tabla users
  if (authData.user) {
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email,
        full_name: fullName,
      },
    ]);

    if (profileError) throw profileError;
  }

  return authData;
}

// Login
export async function signIn(email, password) {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Logout
export async function signOut() {
  if (!supabase) throw new Error("Supabase no está configurado");

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Obtener usuario actual
export async function getCurrentUser() {
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Escuchar cambios de autenticación
export function onAuthStateChange(callback) {
  if (!supabase) return null;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user);
  });

  return subscription;
}
