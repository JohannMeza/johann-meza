import { classNames } from "src/utils/ClassNames";
import IconAwesome from 'src/components/icon/IconAwesome'

const ButtonsNetwroks = [
  { ICON: IconAwesome.PDF, NAME: "CV", URL: {
    href: "/assets/cv/Johann Meza.pdf",
    download: "Johann Meza.pdf"
    }
  },
  { ICON: IconAwesome.GITHUB, NAME: "GitHub", URL: { href: "https://github.com/JohannMeza" } },
  { ICON: IconAwesome.GITLAB, NAME: "GitLab", URL: { href: "https://gitlab.com/JohannMeza" } },
  { ICON: IconAwesome.LINKEDIN, NAME: "Linkedin", URL: { href: "https://www.linkedin.com/in/johann-meza-salazar-33b5701b6/" } },
]

export default function FooterComponent({ fullScreen }) {
  return (
    <footer className={"bg-text flex items-center py-7 relative border-[2px] overflow-hidden"}>
      <div className="flex w-full lg:px-12 relative z-10">
        <div className="md:flex flex-wrap justify-center w-full gap-8">
          {
            ButtonsNetwroks.map((el, index) => (
              <ButtonNetwork key={index} icon={el.ICON} name={el.NAME} url={el.URL} />
            ))
          }
        </div>
      </div>
    </footer>
  );
}

const ButtonNetwork = ({ icon, name, url }) => {
  return (
    <a {...url} target="_blank" className="flex flex-col items-center gap-3">
      <div 
        className="w-16 h-16 bg-white cursor-pointer text-title-1 flex justify-center items-center rounded-full"
      >
        {icon}
      </div>
      <span className="text-title-3 font-medium text-white">{name}</span>
    </a>
  );
};
