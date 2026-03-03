import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ===========================
// LOGIN ROOMBOX (DEV MODE)
// ===========================
router.post("/verify", async (req, res) => {
  try {
    const { tiket } = req.body;

    if (!tiket) {
      return res.status(400).json({
        success: false,
        message: "Kode tiket wajib diisi",
      });
    }

    // =========================
    // CEK ROOM ACTIVE
    // =========================
    const [rows] = await pool.query(
      "SELECT * FROM tiket WHERE ticket_code = ? AND status_payment = true LIMIT 1",
      [tiket]
    );

    if (rows.length === 0) {
      console.log(tiket)
      return res.status(404).json({
        success: false,
        message: "Kode Room tidak ditemukan atau pembayaran belum selesai",
      });
    }

    const tiketRows = rows[0];

    // =========================
    // SUCCESS
    // =========================

    if (tiketRows) {
      console.log(tiketRows)
      await pool.query(
        "UPDATE tiket SET status = ? WHERE id = ?",
        ['running', tiketRows.id]
      );
    }
    res.json({
      success: true,
      message: "verify tiket berhasil",
      data: {
        id: tiketRows.id,
        frame_config_id: tiketRows.frame_config_id,
        kode_tiket: tiketRows.ticket_code,
        client_name: tiketRows.client_name,
      },
    });

  } catch (err) {
    console.error("VERIFY TIKET ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;