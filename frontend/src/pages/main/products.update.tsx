import React, { useState } from "react"
import { Link, useLocation, useParams } from "react-router"
import axios from "axios"
import { toast } from 'sonner';


const createProduct = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const [name, setName] = useState<string>(state.name)
    const [price, setPrice] = useState<string>(state.price)
    const [isAvailable, setIsAvailable] = useState<boolean>(state.isAvailable)
    const [error, setError] = useState('')


    const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }
    const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value)
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<any> => {
        event.preventDefault()
        try {
            const response = await axios.put(`http://localhost:4000/api/products/${id}/update`, {
                name,
                price,
                isAvailable
            }, { withCredentials: true })

            toast(`product ${name} updated`, {
                style: {
                    background: 'green',
                },
                className: 'class',
            })
            console.log(response)
        } catch (err: any) {
            setError(err)

            toast(`error: ${error}`, {
                style: {
                    background: 'red',
                },
                className: 'class',
            })
        }
    }
    return (
        <>
            <form onSubmit={handleLogin} className="p-3 bg-light col-lg-4 col-md-6 col-sm-12 mx-auto rounded-1 border border-primary-subtle mx-3">
                <h4 className="text-center">Update Product</h4>
                <div className="mb-3">
                    <label htmlFor="name">Name:</label>
                    <input type="text" className="form-control bg-primary-subtle" name="name" id="name" onChange={handleName} value={name} />
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity">Price $:</label>
                    <input type="number" className="form-control bg-primary-subtle" name="price" id="price" onChange={handlePrice} value={price} />
                </div>
                <div className="mb-3">
                    <input type="checkbox" className="btn-check bg-primary-subtle" name="isAvailable" id="isAvailable" onChange={() => setIsAvailable(!isAvailable)} checked={isAvailable} />
                    <label htmlFor="isAvailable" className="btn btn-outline-primary">Available?</label>
                </div>
                <Link to="/products">Go Back</Link>
                <div className="text-center">
                    <button className="btn btn-primary" type="submit">Continue</button>
                </div>
            </form>
        </>
    )
}

export default createProduct