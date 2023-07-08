import Controls from "src/components/Controls";
import Icon from "src/components/icon/Icon";

export default function FooterComponent() {
  return (
    <footer className="bg-text py-10">
      <div className="box-base grid grid-cols-3 gap-4">
        <div className="text-white flex flex-col gap-2">
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
        <div className="text-white flex flex-col gap-2">
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
        <div className="text-white flex flex-col gap-2">
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
    </footer>
  );
}
