import { useLocation, useParams, useNavigate, Link } from "react-router"
import React, { useState } from "react"
import axios from "axios"
import { toast } from 'sonner';



const DeleteProduct = () => {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();


    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        try {
            const response = await axios.delete(`http://localhost:4000/api/products/${id}`)
            if (response.status === 200) {
                navigate("/products")
            }
            toast(`Deleted product: ${state.name}`, {
                style: {
                    background: 'green',
                },
                className: 'class',
            })
        }
        catch (err: any) {
            setError(err)

            toast(`error: ${error}`, {
                style: {
                    background: 'red',
                },
                className: 'class',
            })
        }
    }
    if (error) {
        <p className="text-center">
            <Link to="/products" className="card-link">Something went wrong Go back</Link>
        </p>
    }
    return (
        <>
            <div className="card w-50 text-center mx-auto mt-4">
                <div className="card-body">
                    <h6 className="text-center card-subtitle mb-2 text-body-secondary">Delete Product <b>{state.name}?</b></h6>
                    <p className="card-text">
                        You will delete {state.name} want to proceed?
                    </p>
                    <div className="text-center">
                        <Link to="/products" className="btn btn-primary me-1">NO</Link>
                        <button onClick={handleDelete} type="button" className="btn btn-success ms-1">YES</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteProduct