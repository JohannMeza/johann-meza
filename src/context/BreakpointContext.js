import { createContext, useEffect, useMemo, useState } from "react";

const breakpoints = {
  sm: '(max-width: 576px)',
  md: '(min-width: 576px) and (max-width: 958px)',
  lg: '(min-width: 958px) and (max-width: 1900px)',
  xl: '(min-width: 1900px)'
};

export const BreakpointContext = createContext();

export default function BreakpointContextProvider ({ children }) {
  const [breakpoint, setBreakpoint] = useState({});

  const calculateBreakpoint = () => {
    const breakpointEntries = Object.entries(breakpoints);
    const currentBreakpoint = {};

    breakpointEntries.forEach(([name, query]) => {
      const mediaQuery = window.matchMedia(query);
      currentBreakpoint[name] = mediaQuery.matches;
      const updateBreakpoint = () => {
        setBreakpoint(prevState => ({
          ...prevState,
          [name]: mediaQuery.matches
        }));
      };
      mediaQuery.addListener(updateBreakpoint);
    });

    setBreakpoint(currentBreakpoint);
  }

  useEffect(() => {
    calculateBreakpoint();
    return () => {
      const breakpointEntries = Object.entries(breakpoints);
      breakpointEntries.forEach(([name, query]) => {
        const mediaQuery = window.matchMedia(query);
        mediaQuery.removeEventListener('change', () => {});
      });
    };
  }, []);
  

  const value = useMemo(() => ({
    breakpoint
  }), [breakpoint]);
  
  return (
    <BreakpointContext.Provider value={value}>
      { children }
    </BreakpointContext.Provider>
  )
}