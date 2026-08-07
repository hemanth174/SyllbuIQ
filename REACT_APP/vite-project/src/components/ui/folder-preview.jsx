import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MotionDiv = motion.div;
const MotionHeading = motion.h3;

const FolderBackIcon = () => (
  <svg viewBox="0 0 20 16" className="h-full w-full fill-current">
    <path d="M7.5,0C7.4,0,2,0,2,0C0.9,0,0,0.9,0,2l0,12c0,1.1.9,2,2,2h16c1.1,0,2-0.9,2-2V4c0-1.1-.9-2-2-2c0,0-7.5,0-8,0C9,2,9.9,0,7.5,0z" />
  </svg>
);
const FolderCoverIcon = () => (
  <svg viewBox="0 0 20 16" className="h-full w-full fill-current">
    <path d="M2,2h16c1.1,0,2,.9,2,2v10c0,1.1-.9,2-2,2H2c-1.1,0-2-.9-2-2V4C0,2.9.9,2,2,2z" />
  </svg>
);

const FolderPreview = ({
  letter = "?",
  label,
  color = "violet",
  onClick,
  size = "lg",
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const sizes = {
    sm: { folder: "w-20", letter: "text-xl" },
    md: { folder: "w-28", letter: "text-3xl" },
    lg: { folder: "w-36", letter: "text-5xl" },
  }[size];
  const colors = {
    violet: ["text-violet-400", "text-violet-600", "text-violet-200"],
    sky: ["text-sky-400", "text-sky-600", "text-sky-200"],
    emerald: ["text-emerald-400", "text-emerald-600", "text-emerald-200"],
    orange: ["text-orange-400", "text-orange-600", "text-orange-200"],
    pink: ["text-pink-400", "text-pink-600", "text-pink-200"],
    amber: ["text-amber-400", "text-amber-600", "text-amber-200"],
  }[color] || ["text-violet-400", "text-violet-600", "text-violet-200"];

  return (
    <div
      className={cn(
        "inline-flex cursor-pointer flex-col items-center overflow-visible",
        sizes.folder,
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full" style={{ perspective: "800px" }}>
        <div className={cn("absolute inset-0", colors[0])}>
          <FolderBackIcon />
        </div>
        <MotionDiv
          className={cn("relative", colors[1])}
          animate={isHovered ? { rotateX: -25, y: -5 } : { rotateX: 0, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <FolderCoverIcon />
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center font-black",
              sizes.letter,
              colors[2],
            )}
          >
            {letter}
          </span>
        </MotionDiv>
      </div>
      {label ? (
        <MotionHeading
          className="mt-3 max-w-full truncate text-center text-sm font-semibold text-slate-700 dark:text-slate-200"
          animate={isHovered ? { y: -2 } : { y: 0 }}
        >
          {label}
        </MotionHeading>
      ) : null}
    </div>
  );
};

export default FolderPreview;
