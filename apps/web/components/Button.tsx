import { IconNode, Plus } from "lucide-react";
import React from "react";

type Button = {
  type: "button" | "submit" | "reset";
  onClick: () => void;
  children: string;
  icon?: React.ReactNode;
};

const Button = ({ type, onClick, children, icon }: Button) => {
  return (
    <button
      type={type}
      onClick={() => true}
      className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-blue-700 bg-primary px-6 text-sm font-bold text-white shadow-[0_4px_0_#183d96] hover:-translate-y-0.5"
    >
      {icon} {children}
    </button>
  );
};

export default Button;
