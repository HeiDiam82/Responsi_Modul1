import { LoanModel } from "../models/loanModel.js";

export const LoanController = {
  async getAll(req, res) {
    try {
      // Fitur filter query: ?status=Terlambat&member_id=...&book_id=...
      const { status, member_id, book_id } = req.query;
      const loans = await LoanModel.getAll({ status, member_id, book_id });
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const loan = await LoanModel.getById(req.params.id);
      res.json(loan);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const loan = await LoanModel.create(req.body);
      res.status(201).json(loan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const loan = await LoanModel.update(req.params.id, req.body);
      res.json(loan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await LoanModel.remove(req.params.id);
      res.json({ message: "Loan deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
