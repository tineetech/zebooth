import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ===========================
// LOGIN ROOMBOX (DEV MODE)
// ===========================
router.post("/login-roombox", async (req, res) => {
  try {
    const { code_room, ip_devices } = req.body;

    if (!code_room) {
      return res.status(400).json({
        success: false,
        message: "Kode room wajib diisi",
      });
    }

    // =========================
    // CEK ROOM ACTIVE
    // =========================
    const [rows] = await pool.query(
      "SELECT * FROM room_box WHERE kode_room = ? AND status != 'active' LIMIT 1",
      [code_room]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room tidak ditemukan atau tidak aktif",
      });
    }

    const room = rows[0];

    // =========================
    // SUCCESS
    // =========================

    if (room) {
      await pool.query(
        "UPDATE room_box SET status = ? WHERE id = ?",
        ['active', room.id]
      );
    }
    res.json({
      success: true,
      message: "Login roombox berhasil",
      data: {
        id: room.id,
        code_room: room.kode_room,
        name: room.name,
      },
    });

  } catch (err) {
    console.error("LOGIN ROOM ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;