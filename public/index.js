const socket = io();

const listaDeProductos = async (productos) => {
    const fetchProd = fetch("./views/productos.hbs")
        .then((res) => res.text())
        .then((view) => {
            const template = Handlebars.compile(view);
            const html = template({ productos });
            return html;
        })
        .then((html) => html);
    return fetchProd;
};

socket.on('productos', (productos) => {
    listaDeProductos(productos).then((html) => {
        document.getElementById('productos').innerHTML = html;
    });
});


const ingresoProducto = document.getElementById('ingresarProducto');

ingresoProducto.addEventListener('submit', (e) => {
    e.preventDefault();
    const producto = {
        id: null,
        title: e.target.title.value,
        price: e.target.price.value,
        thumbnail: e.target.thumbnail.value,
    };

    socket.emit('agregarProducto', producto);
});


const chat = document.getElementById('enviarMensaje');

chat.addEventListener("submit", (e) => {
    e.preventDefault();
    const mensaje = {
        author: e.target.author.value,
        fecha: new Date().toLocaleString(),
        text: e.target.text.value,
    };

    socket.emit("new-message", mensaje);
});

const formatoMensajes = (mensaje) => {
    const { author, fecha, text } = mensaje;
    return `
    <div> <span class="fw-bold text-primary">${author}</span> <span class="text-brown">${fecha}</span>: <span class="fst-italic text-success">${text}</span> </div>
    `;
};

const renderMensajes = (mensajes) => {
    const listaDeMensajes = mensajes.map(mensaje => formatoMensajes(mensaje)).join('');
    document.getElementById('messages').innerHTML = listaDeMensajes;
};


socket.on("messages", (msj) => renderMensajes(msj));