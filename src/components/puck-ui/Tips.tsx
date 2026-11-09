import React from "react";
import { FaLightbulb } from "react-icons/fa";

interface Props {
  text?: string;
}

const Tips = ({ text = "Please write your tips here..." }: Props) => {
  return (
    <div className="rounded-[6px] bg-muted p-3 text-xs text-muted-foreground">
      <strong className="text-foreground">Tips:</strong>
      <div className="mt-2 flex items-start gap-2">
        <FaLightbulb className="mt-0.5 shrink-0 text-yellow-500" />
        <span>{text}</span>
      </div>
    </div>
  );
};

export default Tips;
