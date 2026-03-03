import express from "express";
import fs from "fs";
import path from "path";
import pool from "../config/db.js";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Mendefinisikan __dirname secara manual untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// helper
const saveBase64 = (base64, filepath) => {
  const data = base64.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync(filepath, data, "base64");
};

// ===============================
// STEP 1 - SAVE ALL SHOTS
// ===============================

const configLayoutFrame = [
    {
        name: "frame1",
        location: "1_f_dmvb1.png",
        width: 550,
        height: 375,
        slots: [
            { top: 30, left: 25 },
            { top: 420, left: 25 },
            { top: 805, left: 25 },
            { top: 1195, left: 25 },
        ],
    },
    {
        name: "frame2",
        location: "2_f_grandopeningblue.png",
        width: 415,
        height: 305,
        slots: [
            { top: 115, left: 90 },
            { top: 450, left: 90 },
            { top: 790, left: 90 },
            { top: 1130, left: 90 },
        ],
    },
    {
        name: "frame3",
        location: "3_f_basic1.png",
        width: 490,
        height: 300,
        slots: [
            { top: 150, left: 60 },
            { top: 460, left: 60 },
            { top: 780, left: 60 },
            { top: 1100, left: 60 },
        ],
    },
]

router.post("/save-session", async (req, res) => {
  try {
    const { shots, selectedIndexes, kode_tiket } = req.body;

    const sessionId = `${new Date().toISOString().split('T')[0]}-${uuidv4()}`;
    const sessionDir = path.join(__dirname, "../uploads/sessions", sessionId);
    fs.mkdirSync(sessionDir, { recursive: true });
    
    const [rows] = await pool.query(
      `
      SELECT 
          t.*,
          ft.name AS frame_template_name,
          ft.location AS frame_location,
          fc.name AS frame_config_name
      FROM tiket t
      LEFT JOIN frame_template ft 
          ON t.frame_template_id = ft.id
      LEFT JOIN frame_config fc 
          ON t.frame_config_id = fc.id
      WHERE t.ticket_code = ?
      AND t.status_payment = 1
      LIMIT 1;
      `,
      [kode_tiket]
    );

    if (rows.length === 0) {
      console.log('tes')
      return res.status(404).json({
        success: false,
        message: "Tiket tidak ditemukan atau pembayaran belum selesai",
      });
    }

    const tiketRows = rows[0];
    console.log(tiketRows)

    // =========================
    // 1. SAVE ALL SHOTS
    // =========================
    for (let i = 0; i < shots.length; i++) {
      const file = path.join(sessionDir, `shot_${i}.png`);
      saveBase64(shots[i], file);
    }

    fs.writeFileSync(
      path.join(sessionDir, "meta.json"),
      JSON.stringify({ selectedIndexes })
    );

    // =========================
    // 2. PREPARE SLOT PHOTOS
    // =========================
    const selectedFiles = selectedIndexes.map((i) =>
      path.join(sessionDir, `shot_${i}.png`)
    );

    // resize foto biar konsisten
    const resizedPhotos = await Promise.all(
      selectedFiles.map((file) =>
        sharp(file)
          .resize(configLayoutFrame[tiketRows.frame_config_id - 1].width, configLayoutFrame[tiketRows.frame_config_id - 1].height, { fit: "cover" }) // ukuran slot foto
          .toBuffer()
      )
    );

    // =========================
    // 3. CREATE CANVAS + SLOT POSITION
    // =========================
    const canvasWidth = 600;
    const canvasHeight = 1800;

    const baseCanvas = sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const composites = resizedPhotos.map((buf, i) => ({
      input: buf,
      top: configLayoutFrame[tiketRows.frame_config_id - 1].slots[i].top,
      left: configLayoutFrame[tiketRows.frame_config_id - 1].slots[i].left,
    }));

    const mergedPath = path.join(sessionDir, "merged.png");

    await baseCanvas
      .composite(composites)
      .png()
      .toFile(mergedPath);

    // =========================
    // 4. APPLY FRAME
    // =========================
    const framePath = path.join(
      __dirname,
    //   "../public/images/frames/20260224_121138.png"
      "../public/images/frames/" + tiketRows.frame_location
    );

    const finalPath = path.join(sessionDir, "final.png");

    const mergedMeta = await sharp(mergedPath).metadata();

    const mergedBuffer = await sharp(mergedPath)
      .resize(mergedMeta.width, mergedMeta.height)
      .ensureAlpha()
      .toBuffer();

    const frameBuffer = await sharp(framePath)
      .rotate()
      .resize(mergedMeta.width, mergedMeta.height, { fit: "fill" })
      .ensureAlpha()
      .toBuffer();

    await sharp(mergedBuffer)
      .composite([
        {
          input: frameBuffer,
          blend: "over",
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toFile(finalPath);

    // =========================
    // RESPONSE
    // =========================
    res.json({
      sessionId,
      finalUrl: `/uploads/sessions/${sessionId}/final.png`,
      mergedUrl: `/uploads/sessions/${sessionId}/merged.png`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save session failed" });
  }
});

// ===============================
// STEP 2 - APPLY FILTER TO 4 PHOTOS
// ===============================
// router.post("/apply-filter", async (req, res) => {
//   try {
//     const { sessionId, filter } = req.body;

//     const sessionDir = path.join(__dirname, "../uploads/sessions", sessionId);

//     const mergedPath = path.join(sessionDir, "merged.png");
//     const finalPath = path.join(sessionDir, "final.png");

//     if (!fs.existsSync(mergedPath)) {
//       return res.status(404).json({ error: "merged.png tidak ditemukan" });
//     }

//     // ===============================
//     // 1. APPLY FILTER KE MERGED
//     // ===============================
//     let img = sharp(mergedPath).ensureAlpha();

//     switch (filter) {
//       case "natural":
//         // brightness(1.05) contrast(1.05) saturate(1.05)
//         img = img
//           .modulate({
//             brightness: 1.05,
//             saturation: 1.05,
//           })
//           .linear(1.05, 0);
//         break;

//       case "cool":
//         // brightness(0.95) contrast(1.1) hue-rotate(40deg) saturate(1.2)
//         img = img
//           .modulate({
//             brightness: 0.95,
//             saturation: 1.2,
//             hue: 40,
//           })
//           .linear(1.1, 0);
//         break;

//       case "film":
//         // contrast(1.2) saturate(0.9) sepia(0.15)
//         img = img
//           .modulate({
//             saturation: 0.9,
//           })
//           .linear(1.2, 0)
//           .recomb([
//             [0.393 + 0.15, 0.769, 0.189],
//             [0.349, 0.686 + 0.15, 0.168],
//             [0.272, 0.534, 0.131 + 0.15],
//           ]);
//         break;

//       case "cinematic":
//         // contrast(1.3) brightness(0.9) saturate(0.8)
//         img = img
//           .modulate({
//             brightness: 0.9,
//             saturation: 0.8,
//           })
//           .linear(1.3, 0);
//         break;

//       case "vintage":
//         // sepia(0.4) contrast(0.9) brightness(1.05)
//         img = img
//           .modulate({
//             brightness: 1.05,
//           })
//           .linear(0.9, 0)
//           .recomb([
//             [0.393 + 0.4, 0.769, 0.189],
//             [0.349, 0.686 + 0.4, 0.168],
//             [0.272, 0.534, 0.131 + 0.4],
//           ]);
//         break;

//       case "bw":
//         // grayscale(100%) contrast(1.1)
//         img = img
//           .grayscale()
//           .linear(1.1, 0);
//         break;

//       case "blink":
//         // brightness(1.2) contrast(1.3) saturate(1.4)
//         img = img
//           .modulate({
//             brightness: 1.2,
//             saturation: 1.4,
//           })
//           .linear(1.3, 0);
//         break;

//       case "none":
//       default:
//         break;
//     }

//     const mergedFilteredPath = path.join(sessionDir, "merged_filtered.png");
//     await img.png().toFile(mergedFilteredPath);

//     // ===============================
//     // 2. AMBIL FRAME DARI FINAL.PNG
//     // (karena final = merged + frame)
//     // Kita ekstrak frame layer
//     // ===============================

//     const frameBuffer = await sharp(finalPath)
//       .ensureAlpha()
//       .toBuffer();

//     const mergedFilteredBuffer = await sharp(mergedFilteredPath)
//       .ensureAlpha()
//       .toBuffer();

//     const meta = await sharp(mergedFilteredBuffer).metadata();

//     // ===============================
//     // 3. COMPOSITE ULANG
//     // merged_filtered + frame overlay
//     // ===============================
//     const finalFilteredPath = path.join(sessionDir, "final_filtered.png");

//     await sharp({
//       create: {
//         width: meta.width,
//         height: meta.height,
//         channels: 4,
//         background: { r: 0, g: 0, b: 0, alpha: 0 },
//       },
//     })
//       .composite([
//         { input: frameBuffer, top: 0, left: 0 }, // frame overlay
//         { input: mergedFilteredBuffer, top: 0, left: 0 },
//       ])
//       .png()
//       .toFile(finalFilteredPath);

//     // ===============================
//     // RESPONSE
//     // ===============================
//     res.json({
//       success: true,
//       mergedUrl: `/uploads/sessions/${sessionId}/merged_filtered.png`,
//       finalUrl: `/uploads/sessions/${sessionId}/final_filtered.png`,
//     });

//   } catch (err) {
//     console.error("APPLY FILTER ERROR:", err);
//     res.status(500).json({ error: "Filter gagal" });
//   }
// });
router.post("/apply-filter", async (req, res) => {
  try {
    const { image, sessionId } = req.body;

    const sessionDir = path.join(
      __dirname,
      "../uploads/sessions",
      sessionId
    );

    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    const base64Data = image.replace(
      /^data:image\/png;base64,/,
      ""
    );

    const filePath = path.join(sessionDir, "final_from_preview.png");

    fs.writeFileSync(filePath, base64Data, "base64");

    return res.json({
      success: true,
      url: `/uploads/sessions/${sessionId}/final_from_preview.png`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal simpan preview" });
  }
});

// ===============================
// STEP 1.5 - GET SESSION PREVIEW
// ===============================
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionDir = path.join(__dirname, "../uploads/sessions", sessionId);

    if (!fs.existsSync(sessionDir)) {
      return res.status(404).json({ error: "Session not found" });
    }

    // baca metadata
    const meta = JSON.parse(
      fs.readFileSync(path.join(sessionDir, "meta.json"))
    );

    const selected = meta.selectedIndexes;

    // build preview URLs dari original shot
    const previews = selected.map(
      (idx) => `/uploads/sessions/${sessionId}/shot_${idx}.png`
    );
    const mergedUrl = `/uploads/sessions/${sessionId}/merged.png`;
    const finalUrl = `/uploads/sessions/${sessionId}/final.png`;

    res.json({
      sessionId,
      selectedIndexes: selected,
      mergedUrl,
      finalUrl,
      previewUrls: previews,
      previewUrl: previews[0], // default big preview
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Get session failed" });
  }
});


router.get("/debug", async (req, res) => {
  try {
    // const  { selectedIndexes, kode_tiket } = req.body;

    const sessionId = `2026-03-02-2cc6d2af-7984-47d8-9c02-818aa9245e57`;
    const sessionDir = path.join(__dirname, "../uploads/sessions", sessionId);
    fs.mkdirSync(sessionDir, { recursive: true });
    

    // =========================
    // 2. PREPARE SLOT PHOTOS
    // =========================
    const selectedFiles = [
      path.join(sessionDir, `shot_2.png`),
      path.join(sessionDir, `shot_2.png`),
      path.join(sessionDir, `shot_3.png`),
      path.join(sessionDir, `shot_3.png`),
    ];

    // resize foto biar konsisten
    const resizedPhotos = await Promise.all(
      selectedFiles.map((file) =>
        sharp(file)
          .resize(configLayoutFrame[2].width, configLayoutFrame[2].height, { fit: "cover" }) // ukuran slot foto
          .toBuffer()
      )
    );

    // =========================
    // 3. CREATE CANVAS + SLOT POSITION
    // =========================
    const canvasWidth = 600;
    const canvasHeight = 1800;

    const baseCanvas = sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const composites = resizedPhotos.map((buf, i) => ({
      input: buf,
      top: configLayoutFrame[2].slots[i].top,
      left: configLayoutFrame[2].slots[i].left,
    }));

    const mergedPath = path.join(sessionDir, "merged.png");

    await baseCanvas
      .composite(composites)
      .png()
      .toFile(mergedPath);

    // =========================
    // 4. APPLY FRAME
    // =========================
    const framePath = path.join(
      __dirname,
      "../public/images/frames/20260224_121138.png"
      // "../public/images/frames/" + tiketRows.frame_location
    );

    const finalPath = path.join(sessionDir, "final.png");

    const mergedMeta = await sharp(mergedPath).metadata();

    const mergedBuffer = await sharp(mergedPath)
      .resize(mergedMeta.width, mergedMeta.height)
      .ensureAlpha()
      .toBuffer();

    const frameBuffer = await sharp(framePath)
      .rotate()
      .resize(mergedMeta.width, mergedMeta.height, { fit: "fill" })
      .ensureAlpha()
      .toBuffer();

    await sharp(mergedBuffer)
      .composite([
        {
          input: frameBuffer,
          blend: "over",
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toFile(finalPath);

    // =========================
    // RESPONSE
    // =========================
    res.json({
      sessionId,
      finalUrl: `/uploads/sessions/${sessionId}/final.png`,
      mergedUrl: `/uploads/sessions/${sessionId}/merged.png`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save session failed" });
  }
});

export default router;