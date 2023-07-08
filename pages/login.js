import axios from "axios"
import { useRouter } from "next/router"
import { useState } from "react"

const initialData = { email:'', password: '' }
export default function LoginPage() {
  const [credentials, setCredentials] = useState(initialData)
  const {push} = useRouter()
  
  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await axios.post('/api/auth/login', credentials)
    if (response.status === 200) return push("/dashboard") 
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="email" name="email" onChange={handleChange} value={credentials.email} />
        <input type="password" placeholder="password" name="password" onChange={handleChange} value={credentials.password} />
        <button type="submit">Enviar</button>
      </form>
    </div>
  )
}