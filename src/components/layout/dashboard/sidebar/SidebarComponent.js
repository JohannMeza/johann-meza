import React, { useEffect, useState } from "react";
import { SaveRequestData } from "../../../../helpers/helpRequestBackend";
import { classNames } from "../../../../utils/ClassNames";
import useAuthContext from "../../../../hooks/useAuthContext";
import useLoaderContext from "../../../../hooks/useLoaderContext";
import Icon from "../../../icon/Icon";
import Link from "next/link";
import Image from "next/image";
import PathConstants from "util/PathConstants";
import { useAlert } from "react-alert";

const styleLinkNav = { color: "white", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" };

export default function SidebarComponent({menu}) {
  const {user} = useAuthContext();
  const {setLoader} = useLoaderContext();
  const [menus, setMenus] = useState([]);
  const alert = useAlert()

  const getMenus = () => { 
    setLoader(true)
    SaveRequestData({
      queryId: 15,
      body: { ID_PERFIL: user.ID_PERFILES },
      success: (resp) => {
        setLoader(false)
        setMenus(resp.dataList)
      },
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { (Object.entries(user).length) && getMenus() }, [user?.ID_PERFILES])

  return (
    <div className={classNames(`bg-primary ${menu ? "show" : "hide"}`)}>
      {/* Nombre de Usuario */}
      <div className="pt-4 pb-2 px-6">
        <Link href={PathConstants.mi_perfil}>
          <div className="">
            <div className="shrink-0">
              {user.IMAGEN && <Image
                priority
                src={user.IMAGEN}
                className="rounded-full w-10 h-10"
                width={100}
                height={100}
                alt="Avatar"
              />}
            </div>
            <div>
              <p className="text-title-3 font-semibold text-blue-600" style={styleLinkNav}>
                {user?.NOMBRE} {user?.APELLIDO}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Lista de Menus */}
      {
        menus.map((menu_1, index) => (
          <LinkComponent key={index} menu={menu_1}>
            {
              menu_1.sub_menus.map((menu_2, index) => (
                <LinkComponent key={index} menu={menu_2}>
                  {
                    menu_2.sub_menus.map((menu_3, index) => (
                      <LinkComponent key={index} menu={menu_3}></LinkComponent>
                    ))
                  }
                </LinkComponent>
              ))
            }
          </LinkComponent>
        ))
      }
    </div>
  );
}

const LinkComponent = ({ children, menu }) => {
  return (
    <div>
      <LabelComponent menu={menu} />

      <ul className="relative">
        {children}
      </ul>
    </div>
  )
}

const LabelComponent = ({ menu }) => {
  return (
    <>
      {
        (menu.id_estado_menu === 6) ?
          (
            <span className="text-paragraph-3 font-Poppins font-semibold px-6 text-white">{menu.menu}</span>
          ) : (menu.sub_menus?.length > 0) ?
            (
              <div title={menu.menu}>
                <div className="flex gap-2 ">
                  <Icon.EyeSlash className="w-5 text-white" />
                  <span style={styleLinkNav} className="text-white">{menu.menu}</span>
                </div>
                <Icon.ChevronDownIcon className="w-5" />
              </div>
            ) : (
              <li className="relative" title={menu.menu}>
                <Link
                  className="flex select-none gap-2 items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-blue-600 hover:bg-blue-50 transition duration-300 ease-in-out"
                  href={`/dashboard/${menu.ruta}`}
                >
                  <Icon.EyeSlash className="w-5 text-white" />
                  <span className="text-white" style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{menu.menu}</span>
                </Link>
              </li>
            )
      }
    </>
  )
}