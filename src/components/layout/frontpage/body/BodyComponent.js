import frontStyles from "src/styles/Frontpage.module.css";
import HeaderComponent from "../header/HeaderComponent";

export default function BodyComponent({children}) {
  return (
    <div>
      <HeaderComponent />
      {children}
    </div>
  )
}