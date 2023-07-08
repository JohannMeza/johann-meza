import { createContext, useMemo, useState } from 'react';
export const MenuContext = createContext();

export default function MenuContextProvider({children}) {
  const [menu, setMenu] = useState(false);
  const value = useMemo(() => ({menu, setMenu: ((menu) => setMenu(menu))}), [menu])
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}