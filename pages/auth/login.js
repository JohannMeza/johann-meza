import { useEffect, useState } from "react";
import { useFormValidation } from "/src/hooks/useFormValidation";
import { useRouter } from "next/router";
import PathConstants from "util/PathConstants";
import useAuthContext from "src/hooks/useAuthContext";
import useLoaderContext from "src/hooks/useLoaderContext";
import Controls from "src/components/Controls";
import Icon from "src/components/icon/Icon";
import Image from "next/image";

const dataInitial = { EMAIL: "", PASS: "", REMENBER: false };

export default function SignInPage() {
  const {isAuthenticated} = useAuthContext();
  const {push} = useRouter();

  const validate = (fieldValues = data) => {
    let temp = { ...errors };

    if ("EMAIL" in fieldValues) {
      temp.EMAIL =
        fieldValues.EMAIL === ""
          ? "El campo Email de Estudio es requerido"
          : "";
    }

    if ("PASS" in fieldValues) {
      temp.PASS =
        fieldValues.PASS === "" ? "El campo Contraseña es requerido" : "";
    }

    setErrors({ ...temp });
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === "");
    }
  };

  const {data, errors, setErrors, handleInputFormChange} = useFormValidation(dataInitial, true, validate);
  const [statePass, setStatePass] = useState(false);
  const {login} = useAuthContext();

  const auth = (e) => {
    e.preventDefault();
    login(data);
  };

  useEffect(() => {
    isAuthenticated && push(PathConstants.home_admin)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen items-center px-6 justify-center bg-banner" style={{ backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
      <form autoComplete="off" onSubmit={auth} className="flex flex-col gap-4 w-full max-w-md h-full bg-[#ffffffc7] px-4 py-8 rounded-lg">
        <div>
          <div className="flex justify-center m-auto object-contain">
            <Image 
              priority
              className="w-auto" 
              width={100} 
              height={100} 
              src="/assets/logotipo/logo.svg"
              alt="Your Company" />
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Iniciar sesion en tu cuenta
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <Controls.InputComponent
              value={data.EMAIL}
              onChange={handleInputFormChange}
              error={errors.EMAIL}
              name="EMAIL"
              autocomplete="off"
              placeholder="Email o Correo Electrónico"
            />
          </div>
          <div>
            <Controls.InputComponent
              value={data.PASS}
              onChange={handleInputFormChange}
              error={errors.PASS}
              name="PASS"
              autocomplete="off"
              placeholder="Contraseña"
              icon={statePass ? <Icon.EyeSlash /> : <Icon.Eye />}
              onClickIcon={() => setStatePass((statePass) => !statePass)}
              type={statePass ? "text" : "password"}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center self-start">
            <input
              id="remember"
              name="REMEMBER"
              type="checkbox"
              autoComplete="new-password"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Recordar sesión
            </label>
          </div>

          <Controls.ButtonComponent title="INICIAR SESIÓN" className="rojo" />
        </div>
      </form>
    </div>
  );
}
