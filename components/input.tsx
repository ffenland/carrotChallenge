import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  type: string;
  register: UseFormRegisterReturn;
  required: boolean;
  [key: string]: any;
}

const Input = ({
  label,
  name,
  register,
  type,
  required,
  ...rest
}: InputProps) => {
  return (
    <div>
      <label
        className="mb-1 block text-sm font-medium text-gray-700"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="rounded-md relative flex items-center shadow-sm">
        <input
          id={name}
          required={required}
          {...register}
          type={type}
          className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          {...rest}
        />
      </div>
    </div>
  );
};
export default Input;
