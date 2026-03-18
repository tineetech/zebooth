import 'dotenv/config';
import express from "express"
import cors from "cors"
import path from "path";
import { fileURLToPath } from "url";
import photoboothRoutes from './controllers/photoboothController.js';
import roomBoxRoutes from './controllers/roomBoxController.js';
import tiketRoutes from './controllers/tiketController.js';
import frameRoutes from './controllers/frameController.js';
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors())
app.use(express.json({ limit: "50mb" }));

// app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/frames", express.static(path.join(__dirname, "public/images/frames")));

app.use("/api/photobooth", photoboothRoutes);
app.use("/api/roombox", roomBoxRoutes);
app.use("/api/tiket", tiketRoutes);
app.use("/api/frame", frameRoutes);

app.get('/', (req, res) => {
    res.json({'tes': '222'})
})

app.listen(port, () => {
    console.log("Server listening on port : " + port)
})



