import { supabase } from "./supabaseClient";

export async function fetchItems(location) {
  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("location", location);

  // location이 'default'가 아닌 경우에만 필터링 적용
  if (location && location !== "default") {
    query = query.eq("location", location);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}
