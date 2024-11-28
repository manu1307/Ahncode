import React from "react";

type TextInputProps = {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  name?: string;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  required,
}) => {
  return (
    <>
      <label className="text-white font-lg font-semibold">{label}</label>
      <textarea
        className="w-full p-2 mt-1  rounded-md"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </>
  );
};
export default TextInput;
