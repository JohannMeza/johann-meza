import { useEffect } from "react";
import { useFormValidation } from "src/hooks/useFormValidation";
import { useState } from "react";
import { useRouter } from "next/router";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { classNames } from "src/utils/ClassNames";
import Controls from "src/components/Controls";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Blog", href: "/blog", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

export default function HeaderComponent() {
  const {data,  handleInputFormChange, errors} = useFormValidation();
  const [isTop, setIsTop] = useState(true);
  const {push} = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      // if (window.scrollY === 0) setIsTop(true);
      // else setIsTop(false);
    };

    // window.addEventListener("scroll", handleScroll);

    return () => {
      // window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <Disclosure
        as="nav"
        className={classNames(
          isTop ? "bg-none w-screen fixed" : "bg-white w-screen fixed",
          "ease-in-out duration-500 z-50",
          "top-0"
        )}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div
                className={classNames(
                  isTop ? "h-20" : "h-16",
                  "relative flex items-center justify-between"
                )}
              >
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
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
                <div className="flex flex-1 h-3/4 items-center justify-center sm:items-stretch sm:justify-between">
                  <div className="flex flex-shrink-0 items-center">
                    {isTop ? (
                      <>
                        <Image
                          className="block h-full w-auto lg:hidden"
                          width={100}
                          height={100}
                          src="/assets/imagenes/logo.png"
                          alt="Your Company"
                        />
                        <Image
                          className="hidden h-full w-auto lg:block"
                          width={100}
                          height={100}
                          src="/assets/imagenes/logo.png"
                          alt="Your Company"
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          className="block h-full w-auto lg:hidden"
                          width={100}
                          height={100}
                          src="/assets/imagenes/logo.png"
                          alt="Your Company"
                        />
                        <Image
                          className="hidden h-full w-auto lg:block"
                          width={100}
                          height={100}
                          src="/assets/imagenes/logo.png"
                          alt="Your Company"
                        />
                      </>
                    )}
                  </div>
                  <div className="hidden sm:ml-6 sm:flex items-center">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            isTop ? "text-white" : "text-secondary",
                            "font-Poppins font-semibold text-gray-300 hover:bg-gray-700 hover:underline px-3 py-2 rounded-md text-sm"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Controls.ButtonComponent
                    className="color-rose"
                    onClick={() => push("/auth/login")}
                    title="Iniciar Sesion"
                  />
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
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
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
  );
}
