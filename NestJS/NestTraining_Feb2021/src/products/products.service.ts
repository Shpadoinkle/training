import { Injectable, NotFoundException } from "@nestjs/common";

import { Product } from './product.model';
import { ProductsModule } from "./products.module";

@Injectable()
export class ProductsService {
    private products: Product[] = []

    deleteProduct(prodId: string) {
        const index = this.findProduct(prodId)[1];
        this.products.splice(index, 1)
    }

    insertProduct(
        title: string,
        desc: string,
        price: number
    ) {
        const prodId = Math.random().toString()
        const newProduct = new Product(prodId, title, desc, price)
        this.products.push(newProduct)

        return prodId
    }

    getProducts() {
        // return this.products.slice();
        return [...this.products];
    }

    getSingleProduct(productId: string) {
        const product = this.findProduct(productId)[0]
        return { ...product }
    }

    updateProduct(
        productId: string,
        title: string,
        desc: string,
        price: number
    ) {
        // const product = this.findProduct(productId)[0]
        const [product, index] = this.findProduct(productId)
        const updatedProduct = { ...product }
        if (title) {
            updatedProduct.title = title
        }
        if (desc) {
            updatedProduct.desc = desc
        }
        if (price) {
            updatedProduct.price = price
        }

        // this.products[index] = {
        //     ...product,
        //     ...updatedProduct
        // }
        this.products[index] = updatedProduct

        return

    }

    private findProduct(id: string): [Product, number] {
        const findIndex = this.products.findIndex((prod) => prod.id == id)
        const product = this.products[findIndex]
        if (!product) {
            throw new NotFoundException()
        }
        return [product, findIndex]
    }
}