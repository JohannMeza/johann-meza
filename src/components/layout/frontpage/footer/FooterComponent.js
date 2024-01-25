import { classNames } from "src/utils/ClassNames";
import IconAwesome from 'src/components/icon/IconAwesome'

const ButtonsNetwroks = [
  { ICON: IconAwesome.MAIL, NAME: "Email" },
  { ICON: IconAwesome.PDF, NAME: "CV" },
  { ICON: IconAwesome.GITHUB, NAME: "GitHub" },
  { ICON: IconAwesome.GITLAB, NAME: "GitLab" },
]

export default function FooterComponent({ fullScreen }) {
  return (
    <footer className={"bg-text flex items-center py-7 relative border-[2px] overflow-hidden"}>
      <div className="flex w-full lg:px-12 relative z-10">
        <div className="md:flex flex-wrap justify-center w-full gap-8">
          {
            ButtonsNetwroks.map((el, index) => (
              <ButtonNetwork key={index} icon={el.ICON} name={el.NAME} />
            ))
          }
        </div>
      </div>
    </footer>
  );
}

const ButtonNetwork = ({ icon, name }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className="w-16 h-16 bg-white cursor-pointer text-title-1 flex justify-center items-center rounded-full"
      >
        {icon}
      </div>
      <span className="text-title-3 font-medium text-white">{name}</span>
    </div>
  );
};
