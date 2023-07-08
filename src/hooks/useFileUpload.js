/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

export default function useFileUpload(required, callback) {
  const [files, setFiles] = useState([]);
  useEffect(() => { if (required) callback(files) }, [files])
  return [files, setFiles]
}