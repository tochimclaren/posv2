import React, { useEffect, useState } from "react"
import { Link } from "react-router"
import axios from "axios"
import Product from "../../components/products/Product"



const products = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [products, setProducts] = useState([])
    // const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            const response = await axios.get('http://localhost:4000/api/products', { withCredentials: true })
            const { data: { products } } = response
            setProducts(products)
            setIsLoading(false)
        }
        fetchProducts()
    }, [])
    const handleQuery = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // setQuery(event.target.value);

        try {
            setIsLoading(true)
            const response = await axios.get(`http://localhost:4000/api/products/search/?q=${event.target.value}`, { withCredentials: true }
            )
            setProducts(response.data)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    };

    return (
        <div className="container">
            <h4 className="text-center">Inventory</h4>
            <div className="mb-3 col-lg-6 col-sm-12 col-md-6 mx-auto d-flex gap-2">
                <input type="text" className="form-control bg-primary-subtle" placeholder="Search products here..." name="search" onInput={handleQuery} />
                <Link to="/products/new" className="btn btn-primary bi bi-plus-circle">New</Link>
            </div>
            {isLoading ? <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div> :
                
                    <div className="row">
                        {products.map((product, idx) => {
                            return (
                                <div className="col-3 mb-3" key={idx}>
                                    <Product product={product} withcart={false} />
                                </div>
                            )
                        })}
                    </div>
                }
        </div>
    )
}

export default products