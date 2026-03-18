import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ===========================
// LOGIN ROOMBOX (DEV MODE)
// ===========================
router.post("/verify", async (req, res) => {
  try {
    const { tiket, roomBoxId } = req.body;

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
      "SELECT * FROM tiket WHERE ticket_code = ? AND status_payment = true AND status != 'finish' AND room_box_id = ? LIMIT 1",
      [tiket, roomBoxId]
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
        data: tiketRows
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
router.get("/get-detail/:id", async (req, res) => {
  try {    
    const tiket = req.params.id

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
      "SELECT * FROM tiket WHERE ticket_code = ? LIMIT 1",
      [tiket]
    );

    if (rows.length === 0) {
      console.log(tiket)
      return res.status(404).json({
        success: false,
        message: "Kode Room tidak ditemukan ",
      });
    }

    const tiketRows = rows[0];

    res.json({
      success: true,
      message: "tiket berhasil didapatkan",
      data: tiketRows,
    });

  } catch (err) {
    console.error(" TIKET ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/check-additional-times/:id", async (req, res) => {
  try {    
    const tiket = req.params.id

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
      "SELECT * FROM tiket WHERE ticket_code = ? AND additional_time  IS NOT null LIMIT 1",
      [tiket]
    );

    if (rows.length === 0) {
      console.log(tiket)
      return res.status(404).json({
        success: false,
        message: "Kode Room tidak ditemukan ",
      });
    }

    const tiketRows = rows[0];

    res.json({
      success: true,
      message: "tiket berhasil didapatkan",
      data: tiketRows,
    });

  } catch (err) {
    console.error(" TIKET ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/set-null-additional-times/:id", async (req, res) => {
  try {    
    const tiket = req.params.id

    if (!tiket) {
      return res.status(400).json({
        success: false,
        message: "Kode tiket wajib diisi",
      });
    }
    
    const [result] = await pool.query(
      "UPDATE tiket SET additional_time = ? WHERE ticket_code = ?",
      [null, tiket]
    );


    res.json({
      success: true,
      message: "tiket berhasil diupdate",
    });

  } catch (err) {
    console.error(" TIKET ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/cek-status-print/:id", async (req, res) => {
  try {    
    const tiket = req.params.id

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
      "SELECT * FROM tiket WHERE ticket_code = ? AND status_print = true LIMIT 1",
      [tiket]
    );

    if (rows.length === 0) {
      console.log(tiket)
      return res.status(404).json({
        success: false,
        message: "Kode Room tidak ditemukan atau print belum selesai",
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
        ['finish', tiketRows.id]
      );
    }
    res.json({
      success: true,
      message: "printing tiket berhasil",
      data: {
        id: tiketRows.id,
        frame_config_id: tiketRows.frame_config_id,
        kode_tiket: tiketRows.ticket_code,
        client_name: tiketRows.client_name,
      },
    });

  } catch (err) {
    console.error("PRINT TIKET ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/cek-status-reset/:id", async (req, res) => {
  try {    
    const tiket = req.params.id

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
      "SELECT * FROM tiket WHERE ticket_code = ? AND status_reset = true LIMIT 1",
      [tiket]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kode Room tidak ditemukan atau room belum direset",
      });
    }

    const tiketRows = rows[0];

    res.json({
      success: true,
      message: "room telah direset",
      data: {
        id: tiketRows.id,
        frame_config_id: tiketRows.frame_config_id,
        kode_tiket: tiketRows.ticket_code,
        client_name: tiketRows.client_name,
      },
    });

  } catch (err) {
    console.error("RESET ROOOM ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;