import { useContext } from "react";
import { LoaderContext } from "../context/LoaderContext";

export default function useLoaderContext () {
  return useContext(LoaderContext);
}