import { cls } from "@lib/utils";
interface ButtonProps {
  type?: "small" | "medium" | "large";
  title?: string;
  onClick?: () => void;
}

const Button = ({ type = "medium", title, onClick }: ButtonProps) => {
  const sizeRef = {
    large: "py-4 text-base",
    medium: "py-3 text-sm ",
    small: "py-2 text-sm ",
  };

  const sizeCls = sizeRef[type];

  return (
    <button
      className={cls(
        "w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:outline-none cursor-pointer",
        sizeCls
      )}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
