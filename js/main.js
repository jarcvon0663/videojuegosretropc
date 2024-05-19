let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


function cargarProductos(productosElegidos) {

    const contenedorProductos = document.getElementById("contenedor-productos");
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <a class="producto-trailer" href="${producto.trailer}" target="_blank"><img src="./img/trailer.png" alt="Trailer"></a>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();

    // Actualiza los botones para abrir el pop-up
    const trailerLinks = document.querySelectorAll(".producto-trailer");
    trailerLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const videoUrl = this.href;
            const videoId = getYoutubeVideoId(videoUrl);
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            const popup = document.getElementById("popup-trailer");
            const popupVideo = document.getElementById("popup-video");
            popupVideo.src = embedUrl;
            popup.style.display = "block";
        });
    });

    // Cierra el pop-up
    const popupClose = document.querySelector(".popup-close");
    popupClose.addEventListener("click", function() {
        const popup = document.getElementById("popup-trailer");
        const popupVideo = document.getElementById("popup-video");
        popup.style.display = "none";
        popupVideo.src = "";
    });
}

function getYoutubeVideoId(url) {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
    } else {
        return urlObj.searchParams.get('v');
    }
}

window.addEventListener("click", function(event) {
    const popup = document.getElementById("popup-trailer");
    if (event.target == popup) {
        popup.style.display = "none";
        const popupVideo = document.getElementById("popup-video");
        popupVideo.src = "";
    }
});


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }

    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

function buscarJuegos() {
    const input = document.getElementById("search-input");
    const term = input.value.toLowerCase();
    const juegosFiltrados = productos.filter(juego => juego.titulo.toLowerCase().includes(term));

    cargarProductos(juegosFiltrados);
}

function ordenarPorPopularidad() {
    const juegosOrdenados = productos.sort((a, b) => {
        // Ordenar por ID
        return a.id.localeCompare(b.id);
    });
    cargarProductos(juegosOrdenados);
}

function ordenarAlfabeticamente() {
    const juegosOrdenados = productos.sort((a, b) => {
        // Ordenar por título
        return a.titulo.localeCompare(b.titulo);
    });
    cargarProductos(juegosOrdenados);
}