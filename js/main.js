const { createApp } = Vue

createApp({
    data() {
        return {
            carrito:         [],
            total:           0,
            juguetes:        undefined,
            farmacia:        undefined,
            productoDetalle: undefined,
            loading:         true
        }
    }, 
    created() {
        if (localStorage.getItem('juguetes') != null) {
            this.carrito  = JSON.parse(localStorage.getItem('carrito'))
            this.juguetes = JSON.parse(localStorage.getItem('juguetes'))
            this.sumarTotal()
            this.loading  = false
        } else {
        fetch('https://mindhub-xj03.onrender.com/api/petshop')
            .then(response => response.json())
            .then(data => {
                this.farmacia  = data.filter(producto => producto.categoria == 'farmacia')
                this.juguetes  = data.filter(producto => producto.categoria == 'jugueteria')
            })
            .catch(err => console.log(err))
            .finally(() => this.loading = false)
        }
    }, 
    methods: {
        mostrarDetalle(producto) {
            this.productoDetalle = producto
        },
        agregarProducto(prod) {
            if (this.carrito.find(producto => producto._id == prod._id)) {
                prod.cantidad++
            } else {
                this.carrito.push(prod)
                prod.cantidad = 1
            }
            prod.disponibles--
            this.juguetes.forEach(juguete => {
                if (juguete._id == prod._id) {
                    localStorage.setItem('juguetes', JSON.stringify(this.juguetes))
                    localStorage.setItem('carrito', JSON.stringify(this.carrito))
                }
            })
            this.sumarTotal()
            // this.aviso()
        },
        quitarProducto(prod) {
            prod.cantidad--
            prod.disponibles++
            if (prod.cantidad < 1) {
                this.carrito.splice(this.carrito.indexOf(prod), 1)
            }
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
            localStorage.setItem('juguetes', JSON.stringify(this.juguetes))
            this.sumarTotal()
            
        },
        sumarTotal() {
            this.total = this.carrito.reduce((acc, producto) => acc + Number(producto.precio * producto.cantidad), 0)
        },
        // aviso() {
        //     let timerInterval
        //     Swal.fire({
        //         title: 'Producto agregado!!',
        //         icon: 'success',
        //         timer: 1000,
        //         didOpen: () => {

        //         },
        //         willClose: () => {
        //             clearInterval(timerInterval)
        //         }
        //     })
        // }
    }

}).mount('#app')