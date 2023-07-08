import React from "react";
import { classNames } from "../../utils/ClassNames";
import { Tooltip, TooltipWrapper } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function TooltipComponent({ className = "", style = {}, onClick = null, children, title = "Sin titulo", direction = "top", position="fixed" }) {
  return (
    <div className={classNames('flex items-center justify-center')} onClick={onClick}>
      <TooltipWrapper content={title} place={direction} delayShow={125} delayHide={125} positionStrategy={position} className={className}>
        {children}
      </TooltipWrapper>
      <Tooltip />
    </div>
  );
}