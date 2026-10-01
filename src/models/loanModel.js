import { supabase } from "../config/supabaseClient.js";

const LOAN_SELECT = `
  id, member_id, book_id, tanggal_pinjam, tanggal_kembali, status, created_at,
  members ( id, name, email ),
  books ( id, kode, judul, penulis )
`;

export const LoanModel = {
  async getAll(filters = {}) {
    let query = supabase
      .from("loans")
      .select(LOAN_SELECT)
      .order("created_at", { ascending: false });

    if (filters.status) query = query.eq("status", filters.status);
    if (filters.member_id) query = query.eq("member_id", filters.member_id);
    if (filters.book_id) query = query.eq("book_id", filters.book_id);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("loans")
      .select(LOAN_SELECT)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("loans")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("loans")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("loans").delete().eq("id", id);
    if (error) throw error;
    return { message: "Loan deleted successfully" };
  },
};
