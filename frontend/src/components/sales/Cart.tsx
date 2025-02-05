import { useCart } from "../../context/CartContext"
import CompleteSale from "./CompleteSale";


const Cart = () => {
    const { cart, removeFromCart } = useCart();
    

    return (
        <div className="offcanvas offcanvas-end" tab-index="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasExampleLabel">Menu</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div>
                    <h6>Shopping Cart</h6>
                    <ul className="list-group">
                        {cart.map(item => (
                            <li className="list-group-item bg-primary-subtle d-flex align-items-center justify-content-between" key={item.id}>
                                <span>{item.name} - ${item.price} x {item.quantity}</span>
                                <button className="btn btn-danger bi bi-x-circle" onClick={() => removeFromCart(item.id)}></button>
                            </li>
                        ))}
                    </ul>
                    <div className="my-4 bg-success-subtle">
                        <p className="p-1">Total: NGN {Math.round(cart.reduce((acc, item) => acc + item.price * item.quantity, 0))}</p>
                    </div>
                    {cart.length ?
                        <CompleteSale/> : ''
                    }
                </div>

            </div>
        </div>


    )
}
export default Cart