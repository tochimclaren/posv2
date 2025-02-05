import React from 'react'
import axios from 'axios'
import { useCart } from "../../context/CartContext"



const CompleteSale = () => {

    const { cart, resetCart } = useCart();


    const handleSaleComplete = async (event: React.MouseEvent<HTMLButtonElement>): Promise<any> => {
        event.preventDefault()
        try {
            const response = await axios.post("http://localhost:4000/api/sales", {
                data: cart
            }, { withCredentials: true })
            resetCart()
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <button className="btn btn-primary" onClick={handleSaleComplete}>Complete</button>
    )
}

export default CompleteSale