
const express = require("express");
const cors = require("cors");
const { sql, poolPromise } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// MÉTODO GET
// Consultar todos los productos


app.get("/api/productos", async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .query(`
                SELECT
                    IDProducto,
                    Nombre,
                    Descripcion,
                    Precio,
                    Stock
                FROM Producto
            `);

        res.json(result.recordset);

    } catch (error) {
        console.error("Error al consultar:", error);

        res.status(500).json({
            mensaje: "Error al consultar los productos",
            error: error.message
        });
    }
});
// MÉTODO POST
// Insertar un nuevo producto


app.post("/api/productos", async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, Stock } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input("Nombre", sql.VarChar(100), Nombre)
            .input("Descripcion", sql.VarChar(255), Descripcion)
            .input("Precio", sql.Decimal(10, 2), Precio)
            .input("Stock", sql.Int, Stock)
            .query(`
                INSERT INTO Producto
                (
                    Nombre,
                    Descripcion,
                    Precio,
                    Stock
                )
                VALUES
                (
                    @Nombre,
                    @Descripcion,
                    @Precio,
                    @Stock
                )
            `);

        res.status(201).json({
            mensaje: "Producto insertado correctamente"
        });

    } catch (error) {
        console.error("Error al insertar:", error);

        res.status(500).json({
            mensaje: "Error al insertar el producto",
            error: error.message
        });
    }
});

// MÉTODO PUT
// Actualizar un producto existente


app.put("/api/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre, Descripcion, Precio, Stock } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input("IDProducto", sql.Int, id)
            .input("Nombre", sql.VarChar(100), Nombre)
            .input("Descripcion", sql.VarChar(255), Descripcion)
            .input("Precio", sql.Decimal(10, 2), Precio)
            .input("Stock", sql.Int, Stock)
            .query(`
                UPDATE Producto
                SET
                    Nombre = @Nombre,
                    Descripcion = @Descripcion,
                    Precio = @Precio,
                    Stock = @Stock
                WHERE IDProducto = @IDProducto
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto actualizado correctamente"
        });

    } catch (error) {
        console.error("Error al actualizar:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el producto",
            error: error.message
        });
    }
});

// MÉTODO DELETE
// Eliminar un producto existente

app.delete("/api/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input("IDProducto", sql.Int, id)
            .query(`
                DELETE FROM Producto
                WHERE IDProducto = @IDProducto
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el producto",
            error: error.message
        });
    }
});

//Inicializacion del servidor
const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
    );
});
