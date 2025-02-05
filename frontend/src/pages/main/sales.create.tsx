import React, { useState } from "react"
import axios from "axios"
import Product from "../../components/products/Product"
// import Cart from "../../components/sales/Cart"


const CreateSale = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleQuery = async (event: React.ChangeEvent<HTMLInputElement>) => {

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
    }
    return (
        <>
            <div className="container">
                <h4 className="text-center">Make Sale</h4>
                <div className="mb-3 col-lg-6 col-sm-12 col-md-6 mx-auto d-flex gap-2">
                    <input type="text" className="form-control bg-primary-subtle p-3" placeholder="Search products here..." name="search" onChange={handleQuery} />
                </div>

                <div id="result">
                    {isLoading ? <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div> : <div className="row">
                        {products.map((product, idx) => {
                            return (<div className="col-3" key={idx}>
                                <Product product={product} withcart={true} />
                            </div>)
                        })}
                    </div>}
                </div>
            </div>
        </>
    )
}

export default CreateSale