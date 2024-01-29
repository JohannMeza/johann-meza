import HeaderComponent from "../header/HeaderComponent";

export default function BodyComponent({children}) {
  return (
    <div>
      <HeaderComponent />
      {children}
    </div>
  )
}