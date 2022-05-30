const fs = require('fs');

class Productos {
    constructor(fileName) {
        this.fileName = fileName;
    }

    async getAll() {
        if (fs.existsSync(this.fileName)) {
            const contenido = await fs.promises.readFile(this.fileName,'utf-8');
            try {
                const _products = JSON.parse(contenido);
                return _products;
            } catch (error) {
                console.log("Error getAll :", error);
            }
        }
    }

    async save(producto) {
        try {
            if (fs.existsSync(this.fileName)) {
                const contenido = await fs.promises.readFile(this.fileName, 'utf-8');
                const _products = JSON.parse(contenido);
                producto.id = _products.length + 1;
                _products.push(producto);
                fs.writeFileSync(this.fileName, JSON.stringify(_products, null, 2));
            } else {
                const _products = [];
                producto.id = 1;
                _products.push(producto);
                fs.writeFileSync(this.fileName, JSON.stringify(_products, null, 2));
            }
        } catch (error) {
            console.log("Error save :", error);
        }
    }
}

module.exports = Productos;