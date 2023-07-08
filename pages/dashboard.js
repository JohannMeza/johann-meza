import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios"
import MainComponent from '../src/components/layout/dashboard/main/MainComponent'

export default function Dashboard () {
  const [user, setUser] = useState({email: "", username: ""})
  const [menu, setMenu] = useState(false);
  const {push} = useRouter()
  
  const getProfile = async () => {
    const response = await axios.post('/api/profile');
    setUser(response)
  }

  const logout = async () => {
    try {
      await axios.post('/api/logout');
      push("/login")
    } catch (error) {
      console.log(error)
      push("/login")
    }
  }

  
  return (
    <div>
      <MainComponent menu={menu} setMenu={menu} />
      {/* <pre>{JSON.stringify(user)}</pre>
      <button onClick={() => getProfile()}>Enviar</button>
      <button onClick={() => logout()}>Logout</button> */}
    </div>
  )
}