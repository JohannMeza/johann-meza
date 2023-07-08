import useMenuContext from "src/hooks/useMenuContext";
import SidebarComponent from "../sidebar/SidebarComponent";
import HeaderComponent from "../header/HeaderComponent";

export default function MainComponent({children}) {
  const { menu, setMenu } = useMenuContext();
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <HeaderComponent menu={menu} setMenu={setMenu} />
      <main style={{ display: "grid", gridTemplateColumns: menu ? "15% 1fr" : "1fr", gridTemplateRows: "1fr" }}>
        <SidebarComponent menu={menu} setMenu={setMenu} />
        <div style={{ padding: "25px" }}>{children}</div>
      </main>
    </div>
  )
}