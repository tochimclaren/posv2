import { useCart } from "../../context/CartContext"

function CartBtn() {
    const { cart } = useCart();
    return (
        <a className="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
            Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </a>
    )
}

export default CartBtn