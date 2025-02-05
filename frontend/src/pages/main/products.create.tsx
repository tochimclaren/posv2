import React, { useState } from "react"
import axios from "axios"
import { toast } from 'sonner';


const createProduct = () => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [isAvailable, setIsAvailable] = useState(true)
    const [error, setError] = useState('')

    const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
        console.log(name)
    }
    const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value)

        console.log(price)

    }
    const handleCreate = async (event: React.FormEvent<HTMLFormElement>): Promise<any> => {
        event.preventDefault()
        try {
            const response = await axios.post("http://localhost:4000/api/products", {
                name,
                price,
                isAvailable
            }, { withCredentials: true })
            console.log(response)
            if (response.status === 200){
                toast(`Created product ${name}`, {
                    style: {
                        background: 'green',
                    },
                    className: 'class',
                })
            }

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
            <form onSubmit={handleCreate} className="p-3 bg-light col-lg-4 col-md-6 col-sm-12 mx-auto rounded-1 border border-primary-subtle mx-3">
                <h4 className="text-center">Add Product</h4>
                <div className="mb-3">
                    <label htmlFor="name">Name:</label>
                    <input type="text" className="form-control bg-primary-subtle" name="name" id="name" onChange={handleName} />
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity">Price $:</label>
                    <input type="number" className="form-control bg-primary-subtle" name="price" id="price" onChange={handlePrice} />
                </div>
                <div className="mb-3">
                    <input type="checkbox" className="btn-check bg-primary-subtle" name="isAvailable" id="isAvailable" onChange={() => setIsAvailable(!isAvailable)} checked={isAvailable}/>
                    <label htmlFor="isAvailable" className="btn btn-outline-primary">Available?</label>
                </div>
                <div className="text-center">
                    <button className="btn btn-primary" type="submit">Continue</button>
                </div>
            </form>
        </>
    )
}

export default createProduct