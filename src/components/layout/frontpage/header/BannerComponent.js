import frontStyles from "src/styles/Frontpage.module.css";

export default function BannerComponent({ title }) {
  return (
    <div className={frontStyles.blogBannerWithoutText}>
      <h1 className="text-title-1 text-white font-Poppins font-semibold">{title}</h1>
    </div>
  )
}