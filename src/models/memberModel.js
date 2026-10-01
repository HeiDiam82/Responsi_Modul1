import { supabase } from "../config/supabaseClient.js";

export const MemberModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(member) {
    const { data, error } = await supabase
      .from("members")
      .insert([member])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, member) {
    const { data, error } = await supabase
      .from("members")
      .update(member)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) throw error;
    return { message: "Member deleted successfully" };
  },
};
