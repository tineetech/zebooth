import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ===========================
// LOGIN ROOMBOX (DEV MODE)
// ===========================
router.get("/get-config", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM frame_config"
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Frame config kosong.",
      });
    }

    const frameRows = rows;

    // =========================
    // SUCCESS
    // =========================

    if (frameRows) {
      console.log(frameRows)
    }

    res.json({
      success: true,
      message: "frame config berhasil di get",
      data: frameRows,
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/get-template", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM frame_template"
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Frame template kosong.",
      });
    }

    const frameRows = rows;

    // =========================
    // SUCCESS
    // =========================

    res.json({
      success: true,
      message: "frame config berhasil di get",
      data: frameRows,
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.post("/save-template", async (req, res) => {
  try {
    const { frame_id, kode_tiket } = req.body;

    if (!frame_id) {
      return res.status(400).json({
        success: false,
        message: "Frame id wajib diisi",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM tiket WHERE ticket_code = ? AND status_payment = true LIMIT 1",
      [kode_tiket]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tiket tidak ditemukan atau pembayaran belum selesai",
      });
    }

    const tiketRows = rows[0];

    // =========================
    // SUCCESS
    // =========================

    if (tiketRows) {
      await pool.query(
        "UPDATE tiket SET frame_template_id = ? WHERE id = ?",
        [frame_id, tiketRows.id]
      );
    }
    res.json({
      success: true,
      message: "update frame template berhasil",
      data: tiketRows,
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


export default router;