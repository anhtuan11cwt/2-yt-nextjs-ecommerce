import { Loader2 } from "lucide-react";

// Nút bấm có hiệu ứng loading
export default function ButtonLoading({
  type = "button",
  text,
  loading,
  onClick,
  className,
  ...props
}) {
  return (
    <button
      className={`
        h-11
        rounded-md
        bg-primary
        text-white
        px-5
        w-full
        flex
        items-center
        justify-center
        gap-2
        disabled:opacity-70
        disabled:cursor-not-allowed
        ${className}
      `}
      disabled={loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={18} />}

      {text}
    </button>
  );
}
