import React from "react";

//     <label>Problem ID:</label>
// <input
//   type="text"
//   name="id"
//   value={inputs.id}
//   onChange={handleInputChange}
//   required
// />

type InputProps = {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  name?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  name,
  required,
  placeholder,
}) => {
  return (
    <>
      <label className="text-white font-lg font-semibold">{label}</label>
      <input
        className="w-full p-2 mt-1  rounded-md"
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </>
  );
};
export default Input;
