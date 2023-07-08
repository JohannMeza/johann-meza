import { useContext } from "react";
import { MenuContext } from '../context/MenuContext';

export default function useMenuContext () {
  return useContext(MenuContext)
}