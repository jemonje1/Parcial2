
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3000/api/productos";

function App() {

  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const [formulario, setFormulario] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: "",
    Stock: ""
  });

  // GET - Obtener todos los productos
  

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch(API);

      if (!respuesta.ok) {
        throw new Error("Error al consultar productos");
      }

      const datos = await respuesta.json();
      setProductos(datos);

    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);


  // Manejar cambios del formulario

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };


  // POST / PUT - Guardar producto

  const guardarProducto = async (e) => {
    e.preventDefault();

    const metodo = editando !== null ? "PUT" : "POST";
    const url = editando !== null
      ? `${API}/${editando}`
      : API;

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Nombre: formulario.Nombre,
          Descripcion: formulario.Descripcion,
          Precio: Number(formulario.Precio),
          Stock: Number(formulario.Stock)
        })
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo guardar el producto");
      }

      setMensaje(
        editando !== null
          ? "Producto actualizado correctamente"
          : "Producto agregado correctamente"
      );

      cancelarEdicion();
      await obtenerProductos();

    } catch (error) {
      setMensaje(error.message);
    }
  };

  // Seleccionar producto para editar

  const editarProducto = (producto) => {
    setEditando(producto.IDProducto);

    setFormulario({
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion || "",
      Precio: producto.Precio,
      Stock: producto.Stock
    });

    setMensaje("");
  };

  const cancelarEdicion = () => {
    setEditando(null);

    setFormulario({
      Nombre: "",
      Descripcion: "",
      Precio: "",
      Stock: ""
    });
  };
  // DELETE - Eliminar producto

  const eliminarProducto = async (id) => {

    if (!window.confirm("¿Deseas eliminar este producto?")) {
      return;
    }

    try {
      const respuesta = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el producto");
      }

      setMensaje("Producto eliminado correctamente");

      if (editando === id) {
        cancelarEdicion();
      }

      await obtenerProductos();

    } catch (error) {
      setMensaje(error.message);
    }
  };
  // INTERFAZ


  return (
    <div className="contenedor">

      <header className="encabezado">
        <h1>Gestión de Productos</h1>
        <p>Administración de inventario | Parcial 2</p>
      </header>

      <section className="tarjeta">

        <h2>
          {editando !== null
            ? "Editar producto"
            : "Agregar producto"}
        </h2>

        <form onSubmit={guardarProducto}>

          <div className="formulario-grid">

            <div className="campo">
              <label>Nombre</label>
              <input
                type="text"
                name="Nombre"
                value={formulario.Nombre}
                onChange={manejarCambio}
                required
                maxLength={100}
                placeholder="Nombre del producto"
              />
            </div>

            <div className="campo">
              <label>Descripción</label>
              <input
                type="text"
                name="Descripcion"
                value={formulario.Descripcion}
                onChange={manejarCambio}
                maxLength={255}
                placeholder="Descripción del producto"
              />
            </div>

            <div className="campo">
              <label>Precio (Q)</label>
              <input
                type="number"
                name="Precio"
                min="0"
                step="0.01"
                value={formulario.Precio}
                onChange={manejarCambio}
                required
                placeholder="0.00"
              />
            </div>

            <div className="campo">
              <label>Stock</label>
              <input
                type="number"
                name="Stock"
                min="0"
                step="1"
                value={formulario.Stock}
                onChange={manejarCambio}
                required
                placeholder="0"
              />
            </div>

          </div>

          <div className="acciones-formulario">
            <button type="submit" className="btn-primario">
              {editando !== null
                ? "Guardar cambios"
                : "Agregar producto"}
            </button>

            {editando !== null && (
              <button
                type="button"
                className="btn-secundario"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            )}
          </div>

        </form>
      </section>

      {mensaje && (
        <p className="mensaje">{mensaje}</p>
      )}

      <section className="tarjeta">

        <div className="titulo-tabla">
          <h2>Listado de productos</h2>
          <span>{productos.length} productos</span>
        </div>

        {cargando ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.IDProducto}>

                    <td>{producto.IDProducto}</td>
                    <td>{producto.Nombre}</td>
                    <td>{producto.Descripcion}</td>

                    <td>
                      Q {Number(producto.Precio).toFixed(2)}
                    </td>

                    <td>{producto.Stock}</td>

                    <td>
                      <div className="acciones-tabla">
                        <button
                          className="btn-editar"
                          onClick={() => editarProducto(producto)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn-eliminar"
                          onClick={() =>
                            eliminarProducto(producto.IDProducto)
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}

                {productos.length === 0 && (
                  <tr>
                    <td colSpan="6" className="sin-productos">
                      No hay productos registrados.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        )}

      </section>

    </div>
  );
}

export default App;
