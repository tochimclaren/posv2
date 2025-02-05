import React from "react"
import { Link } from "react-router";
import { useCart } from "../../context/CartContext"
import { useExchangeRate } from "../../context/ExchangeContext"


interface Product {
    id: string;
    name: string;
    price: number;
    isAvailable?: boolean;
}

export interface ProductComponentProps {
    product: Product;
    withcart: boolean;
}
const icon = {
    fontSize: '250px',
};



const Product: React.FC<ProductComponentProps> = ({ product, withcart }) => {
    const { rate } = useExchangeRate(); // add product to cart
    const { addToCart } = useCart();

    const handleAddProduct = (id: string, name: string, price: number) => {
        addToCart({ id, name, price });

        console.log("Added to cart", product);
    };

    return (
        <>
            <div key={product.id} className="p-2 text-center">
                <div className="bi bi-image" style={icon}></div>
                <div className="d-flex gap-1">
                    <span>Name: </span>
                    <span>{product.name}</span>
                </div>
                <div className="d-flex gap-1">
                    <span>Quantity: </span>
                    <span>{product.price}</span>
                </div>
            </div>
            {withcart ?
                <div className="d-flex gap-2">
                    <button onClick={() => handleAddProduct(product.id, product.name, product.price * rate)} className="btn btn-success bi bi-cart"></button>
                </div>
                :
                <div className="d-flex gap-2">
                    <Link to={`/products/update/${product.id}`} state={product} className="btn btn-sm bg-success-subtle">Update</Link>
                    <Link to={`/products/delete/${product.id}`} state={product} className="btn btn-sm bg-danger-subtle">Delete</Link>
                </div>
            }
        </>

    )
}

export default Product