import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import { toast } from 'sonner';




function signup() {
  const [error, setError] = useState<any>("")
  const [password, setPassword] = useState<string>("")
  const [repeatPassword, setrepeatPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [role, setRole] = useState<string>("sale")
  const navigate = useNavigate()

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    setPassword(event.target.value)

  }

  const handlerepeatPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    setrepeatPassword(event.target.value)

  }

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    setUsername(event.target.value)

  }

  const handleRole = (event: React.ChangeEvent<HTMLSelectElement>) => {

    console.log(event)
    setRole(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== repeatPassword) {
      return toast('passwords do not match', {
        style: {
          background: 'red',
        },
        className: 'class',
      })
    }

    try {
      const response = await axios.post("http://localhost:4000/api/signup", {
        username,
        password,
        role,
      }, { withCredentials: true })
      if (response.status === 200) {
        navigate("/login")
      }
      console.log(response)
    } catch (err: any) {
      setError(err)
    }
  }


  return (
    <>
      <form onSubmit={handleSubmit} className="p-3 bg-light col-lg-4 col-md-6 col-sm-12 mx-auto rounded-1 border border-primary-subtle mx-3">
        <h4 className="text-center">Signup</h4>
        <div className="mb-3">
          <label htmlFor="username">Username</label>
          <input type="text" onChange={handleUsername} className="form-control bg-primary-subtle" name="username" id="username" />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <input type="password" onChange={handlePassword} className="form-control bg-primary-subtle" name="password" id="password" />
        </div>
        <div className="mb-3">
          <label htmlFor="repeatPassword">Repeat Password</label>
          <input type="password" onChange={handlerepeatPassword} className="form-control bg-primary-subtle" name="repeatPassword" id="repeatPassword" />
        </div>
        <div className="mb-3">
          <label htmlFor="role">Role</label>
          <select name="role" id="role" onChange={handleRole} className="form-select bg-primary-subtle">
            <option value="sale">Sale</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Continue</button>
      </form>
    </>
  )
}

export default signup