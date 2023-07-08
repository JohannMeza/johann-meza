import { TooltipProvider } from "react-tooltip";
import { registerPlugin } from "react-filepond";
import { Provider as AlertProvider } from "react-alert";
import { AlertTemplate, AlertStyle } from "../src/config/AlertConfig";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import LoaderContextProvider from "/src/context/LoaderContext";
import AuthContextProvider from "/src/context/AuthContext";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "/src/styles/index.css";
import "/src/styles/Hamburgers.css";
import "tw-elements/dist/css/tw-elements.min.css";
import MenuContextProvider from "../src/context/MenuContext";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function MyApp({ Component, pageProps }) {

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"/>
      {/* <TooltipProvider>
        <LoaderContextProvider>
          <AlertProvider template={AlertTemplate} {...AlertStyle}>
            <AuthContextProvider>
              <MenuContextProvider>
                <Component {...pageProps} />
              </MenuContextProvider>
            </AuthContextProvider>
          </AlertProvider>
        </LoaderContextProvider>
      </TooltipProvider> */}
    </>
  );
}

export default MyApp;
