import { IconNode, Plus } from "lucide-react";
import React from "react";

type ButtonProps = {
  type: "button" | "submit" | "reset";
  onClick: () => void;
  children: string | React.ReactNode;
  icon?: React.ReactNode;
  variant: "primary" | "secondary" | "create";
};

const variantStyle = {
  primary: "bg-primary border-blue-700 shadow-[0_4px_0_#183d96]",
  secondary: "bg-secondary border-red-700 shadow-[0_4px_0_#b91c1c]",
  create: "bg-create border-green-700 shadow-[0_4px_0_#15803D]",
};

const Button = ({ type, onClick, children, variant, icon }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex justify-center h-12  items-center gap-2 rounded-lg border-2  px-6 text-sm font-bold  hover:-translate-y-0.5 cursor-pointer ${variantStyle[variant]}`}
    >
      {icon} {children}
    </button>
  );
};

export default Button;
