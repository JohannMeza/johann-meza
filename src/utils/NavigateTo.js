import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export default function NavigateTo (to = "") {
  const navigate = useNavigate();
  useEffect(() => navigate(to), [navigate, to])
  return null
}