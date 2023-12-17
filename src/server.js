const express = require('express');
const handlebars = require('express-handlebars')
const productsRouter = require('./routes/apis/products.router.js')
const cartRouter = require('./routes/apis/carts.router.js')
const viewsRouter = require('./routes/views.router.js')
const { Server } = require('socket.io')
const ProductManager = require('./managers/ProductManager.js')

const PORT = 8080 || process.env.PORT

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/views', viewsRouter)

const serverHttp = app.listen(PORT, () => {
    console.log('funciono');
});

const io = new Server(serverHttp)

const productsServ = new ProductManager()

let messages = []

io.on('connection', async socket => {
    let products = await productsServ.getProducts()
    console.log('nuevo cliente conectado')

    io.emit('cargar-productos', products)

    socket.on('enviar-contenido-producto', async (producto) =>{
        const respuesta = await productsServ.addProduct(producto)
        products = await productsServ.getProducts()
        console.log(respuesta)
        io.emit('cargar-productos', products)
    })

    socket.on('enviar-id-producto', async (id) =>{
        const res = await productsServ.deleteProduct(parseInt(id))
        products = await productsServ.getProducts()
        console.log(res)
        io.emit('cargar-productos', products)
    })



    socket.on('message', data =>{
        messages.push(data)
        io.emit('messageLogs', messages)
    })
})