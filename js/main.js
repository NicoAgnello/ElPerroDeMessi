const { createApp } = Vue

createApp({
    data() {
        return {
            carrito:         [],
            juguetes:        undefined,
            farmacia:        undefined,
            productoDetalle: undefined,
            loading:         true
        }
    }, 
    created() {
        fetch('https://mindhub-xj03.onrender.com/api/petshop')
            .then(response => response.json())
            .then(data => {
                this.farmacia  = data.filter(producto => producto.categoria == 'farmacia')
                this.juguetes = data.filter(producto => producto.categoria == 'jugueteria')
            })
            .catch(err => console.log(err))
            .finally(() => this.loading = false,
            )
    }, 
    methods: {
        mostrarDetalle(producto) {
            this.productoDetalle = producto
            console.log(this.productoDetalle)
        }
    }

}).mount('#app')