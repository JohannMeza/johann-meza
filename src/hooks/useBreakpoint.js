import { useContext } from 'react';
import { BreakpointContext } from 'src/context/BreakpointContext';

export default function useBreakpoint () {
  return useContext(BreakpointContext)
}