import { classNames } from "src/utils/ClassNames";
import Icon from "src/components/icon/Icon";

export default function InputSearchComponent({
  label,
  style,
  min,
  max,
  precision,
  name = "empty",
  value = {empty: ""},
  error = {empty: ""},
  placeholder,
  disabled = false,
  type = "text",
  autocomplete = "off",
  onChange,
  onClickIcon = () => {},
  className = "",
}) {
    const handleChange = (ev) => {
    const value_ant = value;
    if(type=="decimal"){
      if(min){
        if(parseFloat(ev.target.value) < parseFloat(min) ){
          ev.target.value = value_ant;
        }
      }
      if(max){
        if(parseFloat(ev.target.value) > parseFloat(max) ){
          ev.target.value = value_ant;
        }
      }
    }
    
    if(onChange){
        onChange(ev);
    }
  }
  
  const handleInput = (e) => {
    if(type == 'decimal'){
      let t = e.target.value;
      let pre = (precision) ? (precision + 1) : 4;
      e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), pre)) : t;
    }
  }

  const handlePress = (e) => {
    if(type=='decimal'){
      if(e.charCode >= 58 && e.charCode <=127 || e.charCode >= 33 && e.charCode <=44 || e.charCode == 47 || e.charCode == 45) {
        e.preventDefault()
      }
    }
  }
  return (
    <div style={{ width: "100%" }}>
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
        <div className="relative">
          <input
            value={value[name]}
            style={style}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            name={name}
            onInput={handleInput}
            onKeyPress={handlePress}
            onChange={handleChange} 
            autoComplete={autocomplete}
            className={classNames(
              "input-base pr-10",
              className,
              disabled ? "bg-white-200 border-white-400" : "",
              value[name] ? "border-primary text-text" : "",
              error[name]
                ? "text-red-500 border-red-500 focus:border-red-500"
                : "form-control"
            )}
          />
          {/* <Controls.ButtonIconComponent icon={<Icon.Search />} /> */}
          <div className="animate-pulse absolute flex items-center top-0 bottom-0 my-auto right-2">
            <div className="flex space-x-2 justify-center">
              <div>
                <button
                  type="button"
                  className={classNames("button-icon-base", className)}
                  style={style}
                  onClick={onClickIcon}
                >
                  {<Icon.Search />}
                </button>
              </div>
            </div>
          </div>
        </div>
        {error[name] && (
          <span className="text-span-1 flex items-center text-red-500 gap-2 mt-1">
            <Icon.Info className="icon-principal" /> {error[name]}
          </span>
        )}
      </div>
    </div>
  );
}
