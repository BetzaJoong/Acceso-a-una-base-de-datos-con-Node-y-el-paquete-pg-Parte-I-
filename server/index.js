// ____________INDEX.JS____________
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import pool from './database.js';

const app = express();
const port = 4000; // Puerto configurado

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/posts", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM posts");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener los posts:", error);
        res.status(500).send("Error al obtener los posts");
    }
});

app.post("/posts", async (req, res) => {
    const { titulo, url, descripcion, likes } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, COALESCE ($4, 0)) RETURNING *",
            [titulo, url, descripcion, likes]
        );

        res.status(201).json({
            success: true,
            message: "Se agregó correctamente el post",
            post: result.rows[0],
        });
    } catch (error) {
        console.error("Error al agregar el post:", error);
        res.status(500).json({
            success: false,
            message: "Error al agregar el post",
            error: error.message,
        });
    }
});

app.put("/posts/like/:id", async (req, res) => {
    const postId = req.params.id;

    try {
        // Realiza la lógica para incrementar el contador de "me gusta" en la base de datos.
        const result = await pool.query(
            "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
            [postId]
        );

        const updatedLikes = result.rows[0].likes;

        res.status(200).json({
            success: true,
            message: "Me gusta agregado correctamente",
            likes: updatedLikes,
        });
    } catch (error) {
        console.error("Error al agregar el me gusta:", error);
        res.status(500).json({
            success: false,
            message: "Error al agregar el me gusta",
            error: error.message,
        });
    }
});

app.delete("/posts/:id", async (req, res) => {
    const postId = req.params.id;

    try {
        // Realiza la lógica para eliminar el post de la base de datos.
        await pool.query("DELETE FROM posts WHERE id = $1", [postId]);

        res.status(200).json({
            success: true,
            message: "Post eliminado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar el post:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el post",
            error: error.message,
        });
    }
});

// Manejar todas las demás solicitudes
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../index.html")));

// Manejo de errores genérico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

