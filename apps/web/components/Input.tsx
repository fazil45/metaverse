import React from "react";

type Input = {
  label: string;
  value:string;
  type: "text" | "password" | "number";
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};

const Input = ({ label,value, placeholder, type, onChange, onBlur }: Input) => {
  return (
    <div className="flex flex-col">
      <label className="block text-xs font-semibold">
        {label}
        <input
          required
          className="mt-2 h-11 w-full rounded-lg border-2 border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
      </label>
    </div>
  );
};

export default Input;
