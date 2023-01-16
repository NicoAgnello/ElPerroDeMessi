const { createApp } = Vue

createApp({
    data() {
        return {
            carrito:         [],
            total:           0,
            farmacia:        undefined,
            juguetes:        undefined,
            productoDetalle: undefined,
        }
    }, 
    created() {
        if (localStorage.getItem('carrito') != null) {
            this.total      = JSON.parse(localStorage.getItem('total'))
            this.juguetes   = JSON.parse(localStorage.getItem('juguetes'))
            this.farmacia   = JSON.parse(localStorage.getItem('farmacia'))
            this.carrito    = JSON.parse(localStorage.getItem('carrito'))
        } else {
        fetch('https://mindhub-xj03.onrender.com/api/petshop')
            .then(response => response.json())
            .then(data => {
                this.juguetes = data.filter(producto => producto.categoria == 'jugueteria')
                this.farmacia = data.filter(producto => producto.categoria == 'farmacia')
            })
            .catch(err => console.log(err))
        }
    }, 
    methods: {
        mostrarDetalle(producto) {
            this.productoDetalle = producto
        },
        agregarProducto(prod) {
            if (this.carrito.find(producto => producto._id == prod._id)) {
                this.carrito.forEach(jugueteMed => {
                    if (jugueteMed._id == prod._id) {
                        jugueteMed.cantidadEnCarrito++
                        jugueteMed.disponibles--
                    }
                })
                if (prod.categoria == 'jugueteria') {
                    this.juguetes.forEach(juguete => {
                        if (juguete._id == prod._id) {
                            juguete.cantidadEnCarrito++
                            juguete.disponibles--
                        }
                    }) 
                } else {
                    this.farmacia.forEach(medicamento => {
                        if (medicamento._id == prod._id) {
                            medicamento.cantidadEnCarrito++
                            medicamento.disponibles--
                        }
                    }) 
                }
               
            } else {
                this.carrito.push({... prod})
                this.carrito.forEach(juguete => {
                    if (juguete._id == prod._id) {
                        juguete.cantidadEnCarrito = 1
                        juguete.disponibles--
                    }
                }) 
                if (prod.categoria == 'jugueteria') {
                    this.juguetes.forEach(juguete => {
                        if (juguete._id == prod._id) {
                            juguete.cantidadEnCarrito = 1
                            juguete.disponibles--
                        }
                    }) 
                } else {
                    this.farmacia.forEach(medicamento => {
                        if (medicamento._id == prod._id) {
                            medicamento.cantidadEnCarrito = 1
                            medicamento.disponibles--
                        }
                    }) 
                }
            }
            this.sumarTotal()
            localStorage.setItem('juguetes', JSON.stringify(this.juguetes))
            localStorage.setItem('farmacia', JSON.stringify(this.farmacia))
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
            localStorage.setItem('total', JSON.stringify(this.total))
        },
        quitarProducto(prod) {  
            if (prod.cantidadEnCarrito > 1) {
                this.carrito.forEach(juguete => {
                    if (juguete._id == prod._id) {
                        juguete.cantidadEnCarrito--
                        juguete.disponibles++
                    }
                })
                if (prod.categoria == 'jugueteria') {
                    this.juguetes.forEach(juguete => {
                        if (juguete._id == prod._id) {
                            juguete.cantidadEnCarrito--
                            juguete.disponibles++
                        }
                    }) 
                } else {
                    this.farmacia.forEach(medicamento => {
                        if (medicamento._id == prod._id) {
                            medicamento.cantidadEnCarrito--
                            medicamento.disponibles++
                        }
                    }) 
                } 
            } else {
                this.carrito.forEach(juguete => {
                    if (juguete._id == prod._id) {
                        juguete.disponibles++
                    }
                })
                if (prod.categoria == 'jugueteria') {
                    this.juguetes.forEach(juguete => {
                        if (juguete._id == prod._id) {
                            juguete.disponibles++
                        }
                    }) 
                } else {
                    this.farmacia.forEach(medicamento => {
                        if (medicamento._id == prod._id) {
                            medicamento.disponibles++
                        }
                    }) 
                }
                this.carrito.splice(this.carrito.indexOf(prod), 1)
            }
            this.sumarTotal()
            localStorage.setItem('juguetes', JSON.stringify(this.juguetes))
            localStorage.setItem('farmacia', JSON.stringify(this.farmacia))
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
            localStorage.setItem('total', JSON.stringify(this.total))
        }, 
        sumarTotal() {
            this.total = this.carrito.reduce((acc, producto) => acc + Number(producto.precio * producto.cantidadEnCarrito), 0)
        }
    }
}).mount('#app')