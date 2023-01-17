const { createApp } = Vue;

createApp({
  data() {
    return {
      carrito: [],
      total: 0,
      farmacia: undefined,
      juguetes: undefined,
      contadorCarrito: 0,
      productoDetalle: undefined,
      filtro: undefined,
      tituloDoc: document.title,
    };
  },
  created() {
    if (localStorage.getItem("carrito") != null) {
      this.total = JSON.parse(localStorage.getItem("total"));
      this.juguetes = JSON.parse(localStorage.getItem("juguetes"));
      this.farmacia = JSON.parse(localStorage.getItem("farmacia"));
      this.carrito = JSON.parse(localStorage.getItem("carrito"));
    } else {
      fetch("https://mindhub-xj03.onrender.com/api/petshop")
        .then((response) => response.json())
        .then((data) => {
          this.juguetes = data.filter((producto) => producto.categoria == "jugueteria");
          this.farmacia = data.filter((producto) => producto.categoria == "farmacia");
        })
        .catch((err) => console.log(err));
    }
  },
  methods: {
    mostrarDetalle(producto) {
      this.productoDetalle = producto;
    },
    agregarProducto(prod) {
      if (this.carrito.find((producto) => producto._id == prod._id)) {
        this.carrito.forEach((jugueteMed) => {
          if (jugueteMed._id == prod._id) {
            jugueteMed.cantidadEnCarrito++;
            jugueteMed.disponibles--;
          }
        });
        if (prod.categoria == "jugueteria") {
          this.juguetes.forEach((juguete) => {
            if (juguete._id == prod._id) {
              juguete.cantidadEnCarrito++;
              juguete.disponibles--;
            }
          });
        } else {
          this.farmacia.forEach((medicamento) => {
            if (medicamento._id == prod._id) {
              medicamento.cantidadEnCarrito++;
              medicamento.disponibles--;
            }
          });
        }
      } else {
        this.carrito.push({ ...prod });
        this.carrito.forEach((juguete) => {
          if (juguete._id == prod._id) {
            juguete.cantidadEnCarrito = 1;
            juguete.disponibles--;
          }
        });
        if (prod.categoria == "jugueteria") {
          this.juguetes.forEach((juguete) => {
            if (juguete._id == prod._id) {
              juguete.cantidadEnCarrito = 1;
              juguete.disponibles--;
            }
          });
        } else {
          this.farmacia.forEach((medicamento) => {
            if (medicamento._id == prod._id) {
              medicamento.cantidadEnCarrito = 1;
              medicamento.disponibles--;
            }
          });
        }
      }
      this.sumarTotal();
      localStorage.setItem("juguetes", JSON.stringify(this.juguetes));
      localStorage.setItem("farmacia", JSON.stringify(this.farmacia));
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      localStorage.setItem("total", JSON.stringify(this.total));
    },
    quitarProducto(prod) {
      if (prod.cantidadEnCarrito > 1) {
        this.carrito.forEach((juguete) => {
          if (juguete._id == prod._id) {
            juguete.cantidadEnCarrito--;
            juguete.disponibles++;
          }
        });
        if (prod.categoria == "jugueteria") {
          this.juguetes.forEach((juguete) => {
            if (juguete._id == prod._id) {
              juguete.cantidadEnCarrito--;
              juguete.disponibles++;
            }
          });
        } else {
          this.farmacia.forEach((medicamento) => {
            if (medicamento._id == prod._id) {
              medicamento.cantidadEnCarrito--;
              medicamento.disponibles++;
            }
          });
        }
      } else {
        this.carrito.forEach((juguete) => {
          if (juguete._id == prod._id) {
            juguete.disponibles++;
          }
        });
        if (prod.categoria == "jugueteria") {
          this.juguetes.forEach((juguete) => {
            if (juguete._id == prod._id) {
              juguete.disponibles++;
            }
          });
        } else {
          this.farmacia.forEach((medicamento) => {
            if (medicamento._id == prod._id) {
              medicamento.disponibles++;
            }
          });
        }
        this.carrito.splice(this.carrito.indexOf(prod), 1);
      }
      this.sumarTotal();
      localStorage.setItem("juguetes", JSON.stringify(this.juguetes));
      localStorage.setItem("farmacia", JSON.stringify(this.farmacia));
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      localStorage.setItem("total", JSON.stringify(this.total));
    },
    filtrarPrecios() {
      console.log(this.tituloDoc);
    },
    sumarTotal() {
      this.total = this.carrito.reduce(
        (acc, producto) => acc + Number(producto.precio * producto.cantidadEnCarrito),
        0
      );
    },
  },
  computed: {
    filtrar() {
      switch (this.filtro) {
        case "mayor-precio":
          if (this.tituloDoc.includes("Juguetes")) {
            this.juguetes.sort((a, b) => b.precio - a.precio);
          } else {
            this.farmacia.sort((a, b) => b.precio - a.precio);
          }
          break;
        case "menor-precio":
          if (this.tituloDoc.includes("Juguetes")) {
            this.juguetes.sort((a, b) => a.precio - b.precio);
          } else {
            this.farmacia.sort((a, b) => a.precio - b.precio);
          }
          break;
        case "mayor-stock":
          if (this.tituloDoc.includes("Juguetes")) {
            this.juguetes.sort((a, b) => b.disponibles - a.disponibles);
          } else {
            this.farmacia.sort((a, b) => b.disponibles - a.disponibles);
          }
          break;
        case "menor-stock":
          if (this.tituloDoc.includes("Juguetes")) {
            this.juguetes.sort((a, b) => a.disponibles - b.disponibles);
          } else {
            this.farmacia.sort((a, b) => a.disponibles - b.disponibles);
          }
          break;
        default:
          break;
      }
    },
    contadorDeCarrito() {
      this.contadorCarrito = this.carrito.reduce((acc, producto) => acc + producto.cantidadEnCarrito, 0);
    },
  },
}).mount("#app");
