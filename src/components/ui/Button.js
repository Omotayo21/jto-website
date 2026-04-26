import { cn } from "@/lib/utils"

export function Button({ className, variant = 'primary', size = 'default', children, ...props }) {
  const variants = {
    primary: "bg-black text-white hover:bg-[#800020] shadow-lg shadow-gray-200 border border-transparent",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 shadow-sm",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200 border border-transparent",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  }
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8 text-lg",
    icon: "h-10 w-10",
  }
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
