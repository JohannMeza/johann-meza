/* eslint-disable @next/next/no-page-custom-font */
import { TooltipProvider } from "react-tooltip";
import { registerPlugin } from "react-filepond";
import { Provider as AlertProvider } from "react-alert";
import { AlertTemplate, AlertStyle } from "../src/config/AlertConfig";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import LoaderContextProvider from "/src/context/LoaderContext";
import BreakpointContextProvider from "/src/context/BreakpointContext";
import AuthContextProvider from "/src/context/AuthContext";
import MenuContextProvider from "../src/context/MenuContext";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "/src/styles/Hamburgers.css";
import "tw-elements/dist/css/tw-elements.min.css";
import "/src/styles/globals.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@600,700,800&display=swap" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <TooltipProvider>
        <BreakpointContextProvider>
          <LoaderContextProvider>
            <AlertProvider template={AlertTemplate} {...AlertStyle}>
              <AuthContextProvider>
                <MenuContextProvider>
                  <Component {...pageProps} />
                </MenuContextProvider>
              </AuthContextProvider>
            </AlertProvider>
          </LoaderContextProvider>
        </BreakpointContextProvider>
      </TooltipProvider>
    </>
  );
}

export default MyApp;