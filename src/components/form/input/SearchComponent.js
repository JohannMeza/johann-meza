import { Fragment } from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import Controls from "../../Controls";
import { classNames } from "../../../utils/ClassNames";
import { useForm } from "../../../hooks/useForm";
import Icon from "../../icon/Icon";

export default function SearchComponent({
  value = null,
  name = "empty",
  label = "",
  multiple = false,
  onChange,
  list = [],
  error = { empty: "" },
  zIndex = 50
}) {
  const [valueSearch, handleInputChange, resetData] = useForm({ search: "" });

  const handleChangeChecked = (el) => {
    let valorSearch;

    // Agrega o Elimina de la lista
    if (value[name]?.split(",").includes(`${el.value}`)) {
      let arrSelect = value[name].split(",");
      arrSelect
        .splice(value[name].split(",").indexOf(`${el.value}`), 1)
        .join(",");
      valorSearch = arrSelect.join(",").trim();
    } else {
      valorSearch = `${value[name]},${el.value}`.trim();
    }

    onChange({ target: { value: valorSearch, name } });
  };

  return (
    <div className="w-full" style={{ zIndex: zIndex }}>
      <label
        htmlFor="price"
        className={classNames(
          error[name] ? "text-red-500" : "text-text",
          "block text-sm font-medium text-start"
        )}
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <Combobox multiple={multiple}>
          <div className={classNames(
              value[name] ? "border-blue-600 border-2" : "",
              error[name] ? "text-red-500 border-red-500 focus:border-red-500" : "",
              "relative input-search-multiselect-base"
            )}>
            
            <Listbox>
              <Listbox.Button style={{ outline: "none" }}>
                <span className="inline-block w-full h-1">
                  {list.length > 0 && (
                    <ul
                      className="flex gap-1"
                      style={{
                        width: "inherit",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {list
                        .filter((el) => value[name]?.split(",").includes(`${el.value}`))
                        .map((el, index) => (
                          <li
                            style={{ borderRadius: "4px" }}
                            className="text-span-1 flex items-center gap-2 bg-white-200 px-2"
                            key={index}
                          >
                            {el.label}
                            <span
                              className="inline-block w-5"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChangeChecked(el);
                              }}
                            >
                              <Icon.XCircle />
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute left-0 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-paragraph-2 shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none sm:text-paragraph-3">
                  <div className="p-2">
                    <Controls.InputComponent
                      className="focus:border-primary text-text"
                      onChange={handleInputChange}
                      name="search"
                      placeholder="Buscar..."
                      icon={<Icon.XCircle />}
                      onClickIcon={resetData}
                      value={valueSearch}
                    />
                  </div>

                  {list
                    .filter((el) =>
                      el.label.match(new RegExp(valueSearch.search, "ig"))
                    )
                    .map((el, index, {}, active = value[name]?.split(",").includes(`${el.value}`) ? true : false) => (
                      <label htmlFor={el.value} className={classNames("options", active ? "active" : "")} key={index}>
                        <input
                          type="checkbox"
                          checked={active}
                          className="bg-secondary"
                          name={name}
                          id={el.value}
                          onChange={() => handleChangeChecked(el)}
                        />
                        <div className="w-full text-text">
                          {el.label}
                        </div>
                      </label>
                    ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
          {error[name] && (
            <span className="text-span-1 flex items-center text-red-500 gap-2 mt-1">
              <Icon.Info className="icon-principal" /> {error[name]}
            </span>
          )}
        </Combobox>
      </div>
    </div>
  );
}