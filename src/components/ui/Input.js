import { cn } from "@/lib/utils"

export function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-gray-200 bg-[#FFFCE0] px-3 py-2 text-sm text-gray-900 font-sans placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:cursor-not-allowed disabled:bg-gray-50 shadow-sm",
        className
      )}
      {...props}
    />
  )
}
