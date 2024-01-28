import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { classNames } from "src/utils/ClassNames";
import useAuthContext from "src/hooks/useAuthContext";
import Controls from "src/components/Controls";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/", current: true, animation: true },
  { name: "Blog", href: "/blog", current: false, animation: true },
  { name: "Proyectos", href: "/proyectos", current: false, animation: true },
];

export default function HeaderComponent() {
  const [isTop, setIsTop] = useState(true);
  const { push, pathname } = useRouter()
  const { user } = useAuthContext();
  const isAnimation = navigation.some((el) => pathname.startsWith(el.href) && el.animation);
  
  const styleHeader = {
    bgHeader: (() => {
      if (isTop && isAnimation) return "bg-none w-screen fixed";
      if (isTop && !isAnimation) return "bg-white w-screen fixed shadow-md";
      else return "w-screen fixed bg-white shadow-md";
    })(),
    heightHeader: isTop ? "h-20" : "h-16",
    colorLink: (() => {
      if (isTop && isAnimation) return "text-white";
      if (isTop && !isAnimation) return "text-secondary";
      else return "text-secondary";
    })(),
    imageLogo: (() => {
      if (isTop && isAnimation) {
        return (
          <>
            <Image
              className="block h-full w-auto lg:hidden"
              width={100}
              height={100}
              src="/assets/logotipo/logo-white.svg"
              alt="Your Company"
            />
            <Image
              className="hidden h-full w-auto lg:block"
              width={100}
              height={100}
              src="/assets/logotipo/logo-white.svg"
              alt="Your Company"
            />
          </>
        )
      } else if (isTop && !isAnimation) {
        return (
          <>
            <Image
              className="block h-full w-auto lg:hidden"
              width={100}
              height={100}
              src="/assets/logotipo/logo.svg"
              alt="Your Company"
            />
            <Image
              className="hidden h-full w-auto lg:block"
              width={100}
              height={100}
              src="/assets/logotipo/logo.svg"
              alt="Your Company"
            />
          </>
        )
      } else {
        return (
          <>
            <Image
              className="block h-full w-auto lg:hidden"
              width={100}
              height={100}
              src="/assets/logotipo/logo.svg"
              alt="Your Company"
            />
            <Image
              className="hidden h-full w-auto lg:block"
              width={100}
              height={100}
              src="/assets/logotipo/logo.svg"
              alt="Your Company"
            />
          </>
        )
      }
    })()
  }

  useEffect(() => {
    if (!isAnimation) return;

    const handleScroll = () => {
      if (window.scrollY === 0) setIsTop(true);
      else setIsTop(false);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Disclosure
      as="nav"
      className={classNames(
        styleHeader.bgHeader,
        "ease-in-out duration-500 z-50",
        "top-0"
      )}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div
              className={classNames(
                styleHeader.heightHeader,
                "relative flex items-center justify-between transition-[height] duration-1000"
              )}
            >
              <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 h-3/4 items-center justify-between">
                <div className="h-full">
                  { styleHeader.imageLogo }
                </div>
                <div className="hidden sm:ml-6 sm:flex items-center">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          styleHeader.colorLink,
                          "font-Poppins font-semibold text-gray-300 hover:bg-gray-700 hover:underline px-3 py-2 rounded-md text-sm"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}

                    <Link
                      href="/auth/login"
                      className={classNames(
                        styleHeader.colorLink,
                        "font-Poppins font-semibold text-gray-300 hover:bg-gray-700 hover:underline px-3 py-2 rounded-md text-sm"
                      )}
                    >
                      {Object.entries(user).length ? "Dashboard" : "Login"}
                    </Link>
                    
                    <div>
                      {
                        Object.entries(user).length > 0 &&
                        <>
                          <Image 
                            width={50}
                            height={50}
                            src={user.IMAGEN}
                            alt="Avatar"
                            className="rounded-full w-10 h-10"
                          />
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden w-full absolute bg-[#0006] backdrop-blur-lg">
            <div className="space-y-1 px-2 pt-2 pb-3 text-center">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
                <Controls.ButtonComponent
                  className="color-rose mx-auto"
                  onClick={() => push("/auth/login")}
                  title="Iniciar Sesion"
                />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
