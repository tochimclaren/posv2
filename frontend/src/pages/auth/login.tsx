import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import { useAuth } from '../../context/AuthContext';





const Login = () => {
    const { login } = useAuth(); // Get the login function from the context
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }
    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<any> => {
        event.preventDefault()
        try {
            const response = await axios.post("http://localhost:4000/api/login", {
                username,
                password
            }, { withCredentials: true })
            if (response.status === 200) {
                login(response.data)
                navigate("/")
            }
        } catch (error: any) {
            console.log(error)
            setError(error)
        }
    }
    if (error) return (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Holy guacamole!</strong>{error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    )
    return (
        <>
            <form onSubmit={handleLogin} className="p-3 bg-light col-lg-4 col-md-6 col-sm-12 mx-auto rounded-1 border border-primary-subtle mx-3">
                <h4 className="text-center">Login</h4>
                <div className="mb-3">
                    <label htmlFor="username">Username:</label>
                    <input type="text" className="form-control bg-primary-subtle" name="username" id="username" onChange={handleUsername} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control bg-primary-subtle" name="password" id="password" onChange={handlePassword} />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary" type="submit">Continue</button>
                </div>
            </form>
        </>
    )
}

export default Login