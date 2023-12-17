const fs = require('fs')

class CartsManager {
    constructor(){
        this.carts = []
        this.path = './src/carts.json'
        this.idCounter = 0
    }

    getCarts = async () => {
        let obtainCards
        const Existe = fs.existsSync(this.path)
        if (!Existe) {
            obtainCards = []
        } else {
            const cartLeidos = await fs.promises.readFile(this.path, 'utf-8')
            obtainCards = JSON.parse(cartLeidos)
        }
        this.carts = obtainCards
        return obtainCards
    }

    getCartById = async (cid) => {
        cid = parseInt(cid)
        const carts = await this.getCarts()
        const cart = carts.find(cart => cart.id === cid)
        if (!cart) {
            return 'No se encuentro'
        }
        return cart.products
    }


    addCart = async () => {
        const lectura = await this.getCarts()
        const addId = lectura.length + 1
        const newCart = {
            id: addId,
            products: []
            }
        this.carts = lectura
        this.carts.push(newCart)
        const cartString = JSON.stringify(this.carts, null, 2)
        await fs.promises.writeFile(this.path, cartString)
        return ('se añadio correctamente')

    }
    addProductToCart = async (cid, pid) => {
        cid = parseInt(cid)
        pid = parseInt(pid)
        const carts = await this.getCarts()
        const cartIndice = carts.findIndex(cart => cart.id === cid)
        if (cartIndice === -1) {
            return 'no se encuentro el carrito'
        }else{
            const cartProducts = await this.getCartById(cid)
            const indice = cartProducts.findIndex(prod => prod.pid === pid)
            if(indice !== -1){
                cartProducts[indice].cantidad = cartProducts[indice].cantidad + 1
            }else{
                cartProducts.push({pid, cantidad : 1})
            }
            carts[cartIndice].products = cartProducts
            const cartString = JSON.stringify(carts, null, 2)
            await fs.promises.writeFile(this.path, cartString)
            return 'se agrego el producto correctamente'
        }
    }
}

module.exports = CartsManager