import { Fragment, useState } from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "src/utils/ClassNames";
import { useForm } from "src/hooks/useForm";
import Icon from "src/components/icon/Icon";

export default function SelectComponent({
  onChange = () => {},
  error = { empty: "" },
  value = { empty: "" },
  disabled = false,
  fixed = false,
  search = false,
  name = "empty",
  zIndex = 50,
  className = "",
  style = {},
  label = "",
  list = [],
}) {
  const [valueSearch, handleInputChange, resetData] = useForm({ search: "" });

  const filteredPeople =
    valueSearch.search === ''
      ? list
      : list.filter((person) =>
          person.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(valueSearch.search.toLowerCase().replace(/\s+/g, ''))
  )
  return (
    <div style={{ ...style, zIndex: zIndex }} className={className}>
      <label
        htmlFor="price"
        className={classNames(
          "block text-sm font-medium text-start",
          error[name] && "text-red-500"
        )}
      >
        {label}
      </label>
      {search ? (
        <Combobox value={list.length > 0 && list.filter((el) => el.value === value[name])[0]} onChange={({ value }) => onChange({ target: { name, value } })}>
          <div className="relative z-[500000] mt-1 shadow-sm">
            <div className={classNames(
              "relative",
              error[name]
                ? "input-select-base input-select-base-error"
                : disabled
                ? "input-select-base opacity-60 bg-white-200"
                : "input-select-base"
            )}>
              <Combobox.Input className="w-full border-none pr-10 h-full" autoComplete="off" displayValue={({value, label}) => value ? label : ""} placeholder={list[0]?.label || "Seleccione"} onChange={(e) => handleInputChange(e)} name="search" />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 top-0 bottom-0">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => resetData()}
            >
              <Combobox.Options 
                style={{ maxHeight: "240px" }}
                className={classNames(
                  fixed ? "fixed w-auto" : "absolute w-full",
                  "mt-1 overflow-auto rounded-md bg-white py-1 text-paragraph-2 shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none sm:text-paragraph-3"
                )}
              >
                {filteredPeople.length === 0 && valueSearch.search !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">Sin resultados.</div>
                ) : (
                  filteredPeople.map((person) => (
                    <Combobox.Option
                      key={person.value}
                      value={person}
                      style={{ paddingLeft: "40px" }}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-white-200 text-secondary" : "text-text"
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {selected}
                            {person.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 top-0 bottom-0 flex items-center pl-3 text-secondary">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      ) : (
        <Listbox
          value={
            list.length > 0 && list.filter((el) => el.value === value[name])[0]
          }
          onChange={({ value }) => onChange({ target: { name, value } })}
          disabled={disabled}
        >
          <div className="relative z-[500000] mt-1 shadow-sm">
            <Listbox.Button
              className={classNames(
                error[name]
                  ? "input-select-base input-select-base-error"
                  : disabled
                  ? "input-select-base opacity-60 bg-white-200"
                  : "input-select-base"
              )}
            >
              <span className="block truncate text-start">
                {list.filter((el) => el.value === value[name])[0]?.label}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 top-0 bottom-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-text"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                style={{ maxHeight: "240px" }}
                className={classNames(
                  fixed ? "fixed w-auto" : "absolute w-full",
                  "mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-paragraph-2 shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none sm:text-paragraph-3"
                )}
              >
                {list.length > 0 &&
                  list.map((person, personIdx) => (
                    <Listbox.Option
                      key={personIdx}
                      value={person}
                      style={{ paddingLeft: "40px" }}
                      className={({ active }) =>
                        `relative block cursor-default select-none py-2 pr-4 ${
                          active ? "bg-white-200 text-secondary" : "text-text"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {selected}
                            {person.label}
                          </span>
                          
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex top-0 bottom-0 items-center pl-3 text-secondary">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      )}
      {error[name] && (
        <span className="text-span-1 flex items-center text-red-500 gap-2 mt-1">
          <Icon.Info className="icon-principal" /> {error[name]}
        </span>
      )}
    </div>
  );
}
