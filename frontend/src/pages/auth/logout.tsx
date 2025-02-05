import React from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import { useAuth } from '../../context/AuthContext';


const Logout = () => {
  const { logout } = useAuth(); // Get the login function from the context
  const navigate = useNavigate()
  const handleLogout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {

      const response = await axios.post("http://localhost:4000/api/logout", {}, { withCredentials: true })
      if (response.status == 200) {
        navigate("/")
        logout()
      }
    } catch (error: any) {
      console.log(error)
    }
  }
  return (
    <>
      <h4 className="text-center">Logout</h4>
      <form onSubmit={handleLogout} className="p-3 bg-light col-lg-4 col-md-6 col-sm-12 mx-auto rounded-1 border border-primary-subtle mx-3">
        <div className="d-flex justify-content-between align-items-center">
          <span>Are you sure you want to logout?</span><button className="btn btn-danger" type="submit">Continue</button>
        </div>
      </form>
    </>
  )
}

export default Logout