import { cn } from "@/lib/utils";

const GlowBorderCard = ({ children, className, ...props }) => (
    <div className={cn("relative overflow-hidden rounded-2xl p-px", className)} {...props}>
        <div className="pointer-events-none absolute inset-[-80%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,#22c55e_90deg,transparent_180deg,#38bdf8_270deg,transparent_360deg)] opacity-60" />
        <div className="relative h-full rounded-[calc(1rem-1px)] bg-white dark:bg-[#10161d]">{children}</div>
    </div>
);

export default GlowBorderCard;
