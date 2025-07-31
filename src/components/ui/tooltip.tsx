'use client'

import { useState, useRef, ReactNode, FocusEvent, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  delayMs?: number; // delay before showing tooltip
  className?: string; // extra classes for tooltip content container
  placement?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
  content,
  children,
  delayMs = 200,
  className = "",
  placement = "top",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show tooltip after delay
  const handleShow = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delayMs);
  };

  // Immediate hide tooltip
  const handleHide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  // Keyboard accessibility - show on focus, hide on blur
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    handleShow();
    if (children && typeof (children as any).props?.onFocus === "function") {
      (children as any).props.onFocus(e);
    }
  };

  const onBlur = (e: FocusEvent<HTMLElement>) => {
    handleHide();
    if (children && typeof (children as any).props?.onBlur === "function") {
      (children as any).props.onBlur(e);
    }
  };

  // Mouse events
  const onMouseEnter = (e: MouseEvent<HTMLElement>) => {
    handleShow();
    if (children && typeof (children as any).props?.onMouseEnter === "function") {
      (children as any).props.onMouseEnter(e);
    }
  };
  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    handleHide();
    if (children && typeof (children as any).props?.onMouseLeave === "function") {
      (children as any).props.onMouseLeave(e);
    }
  };

  // Tooltip position styles based on placement prop
  // You can extend this for left/right if needed.
  const placementStyles: Record<
    string,
    { container: string; arrow: string; motionOrigin: string }
  > = {
    top: {
      container: "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
      arrow: "top-full left-1/2 -translate-x-1/2 border-t-gray-700",
      motionOrigin: "bottom center",
    },
    bottom: {
      container: "top-full mt-2 left-1/2 transform -translate-x-1/2",
      arrow: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-700",
      motionOrigin: "top center",
    },
    left: {
      container: "right-full mr-2 top-1/2 transform -translate-y-1/2",
      arrow: "right-0 top-1/2 -translate-y-1/2 border-l-gray-700",
      motionOrigin: "right center",
    },
    right: {
      container: "left-full ml-2 top-1/2 transform -translate-y-1/2",
      arrow: "left-0 top-1/2 -translate-y-1/2 border-r-gray-700",
      motionOrigin: "left center",
    },
  };

  // Select styles for current placement
  const styles = placementStyles[placement] || placementStyles.top;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={0} // to make focusable if child is not focusable
      aria-describedby="tooltip"
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            id="tooltip"
            role="tooltip"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            style={{ transformOrigin: styles.motionOrigin }}
            className={`absolute z-50 ${styles.container} max-w-xs px-3 py-1.5 rounded-md bg-gray-800 text-white text-xs shadow-lg ${className}`}
          >
            {content}
            {/* Tooltip arrow */}
            <span
              className={`absolute w-3 h-3 bg-gray-800 rotate-45 pointer-events-none ${styles.arrow} border-solid border-2 border-gray-800`}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
