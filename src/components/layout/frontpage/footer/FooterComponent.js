import Controls from "src/components/Controls";
import Icon from "src/components/icon/Icon";
import Image from "next/image";
import { classNames } from "src/utils/ClassNames";

export default function FooterComponent({ fullScreen }) {
  return (
    <footer className={classNames(fullScreen ? "h-screen" : "", "bg-text flex items-center py-10 relative border-[2px] overflow-hidden")}>
      <Image src="/assets/svg/background-icon.svg" width={500} height={500} property alt="Icono" className="-right-[5%] -bottom-[40%] absolute" />
      <div className="flex w-full lg:px-12 relative z-10">
        <div className="md:flex flex-wrap justify-start w-4/5">
          <div className="text-white flex flex-col md:w-1/2 p-6">
            <h5 className="text-title-3 font-OpenSans font-semibold">
              Enlaces rapidos
            </h5>
            <ul className="text-paragraph-2 flex flex-col gap-3">
              <li>
                <a href="#">Enlace 1</a>
              </li>
              <li>
                <a href="#">Enlace 1</a>
              </li>
              <li>
                <a href="#">Enlace 1</a>
              </li>
            </ul>
          </div>
          <div className="text-white flex flex-col md:w-1/2 p-6">
            <h5 className="text-title-3 font-OpenSans font-semibold">
              Enlaces rapidos
            </h5>
            <ul className="text-paragraph-2 flex flex-col gap-3">
              <li>
                <a href="#">Enlace 1</a>
              </li>
              <li>
                <a href="#">Enlace 1</a>
              </li>
              <li>
                <a href="#">Enlace 1</a>
              </li>
            </ul>
          </div>
          <div className="text-white flex flex-col md:w-1/2 p-6">
            <h5 className="text-title-3 font-OpenSans font-semibold">
              Enlaces rapidos
            </h5>
            <ul className="text-paragraph-2 flex flex-col gap-3">
              <li>
                <a href="#">Enlace 1</a>
              </li>
              <li>
                <a href="#">Enlace 1</a>
              </li>
              <li>
                <a href="#">Enlace 1</a>
              </li>
            </ul>
            <div className="flex gap-2 mt-2">
              <Controls.TooltipComponent title="Facebook">
                <Controls.ButtonIconComponent
                  icon={<Icon.Info />}
                  className="color-rose"
                />
              </Controls.TooltipComponent>
              <Controls.TooltipComponent title="Youtube">
                <Controls.ButtonIconComponent
                  icon={<Icon.Info />}
                  className="color-rose"
                />
              </Controls.TooltipComponent>
              <Controls.TooltipComponent title="Linkeding">
                <Controls.ButtonIconComponent
                  icon={<Icon.Info />}
                  className="color-rose"
                />
              </Controls.TooltipComponent>
            </div>
          </div>
        </div>
        <div className="w-full h-full hide lg:flex lg:justify-center ">
          <Image width="1000" height="1000" alt="Projects" src="/assets/imagenes/footer.png" className="w-5/6" />
        </div>
      </div>
    </footer>
  );
}
