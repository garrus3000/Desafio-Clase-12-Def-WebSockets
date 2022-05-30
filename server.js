const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: IOServer} = require('socket.io');


const app = express();

const httpServer = new HttpServer(app);
const ioServer = new IOServer(httpServer);

const Productos = require('./controllers/productos.js');
const Mensajes = require('./controllers/mensajes.js');
const productos = new Productos('./controllers/productos.json')
const mensajes = new Mensajes('./controllers/mensajes.json');

ioServer.on("connection", async (socket) => {
    console.log("Nuevo usuario conectado");

    socket.emit("productos", await productos.getAll());

    socket.on("agregarProducto", async (producto) => {
        await productos.save(producto);
        ioServer.sockets.emit("productos", await productos.getAll());
    });

    socket.emit("messages", await mensajes.getAll());

    socket.on('new-message', async (msj) => {
        await mensajes.save(msj)
        ioServer.sockets.emit('messages', await mensajes.getAll())
      });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 8080;
httpServer.listen(PORT, (err) => {
    if(err) new Error (console.log(err));
    else console.log(`Servidor corriendo en el puerto ${PORT}`);
});