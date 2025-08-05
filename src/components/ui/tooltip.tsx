'use client';

import React, {
  useState,
  useRef,
  ReactNode,
  FocusEvent,
  MouseEvent,
  useEffect,
  cloneElement,
  isValidElement,
  ReactElement,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define proper event handler types
type EventHandlerProps = {
  onFocus?: (e: FocusEvent<HTMLElement>) => void;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
};

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  delayMs?: number;
  className?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
  theme?: 'dark' | 'light';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function Tooltip({
  content,
  children,
  delayMs = 200,
  className = '',
  placement = 'top',
  disabled = false,
  theme = 'dark',
  maxWidth = 'xs',
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [actualPlacement, setActualPlacement] = useState(placement);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  // Auto-adjust placement logic (unchanged)
  useEffect(() => {
    if (!visible || !tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newPlacement = placement;

    if (placement === 'top' && rect.top < 0) {
      newPlacement = 'bottom';
    } else if (placement === 'bottom' && rect.bottom > viewport.height) {
      newPlacement = 'top';
    } else if (placement === 'left' && rect.left < 0) {
      newPlacement = 'right';
    } else if (placement === 'right' && rect.right > viewport.width) {
      newPlacement = 'left';
    }

    if (newPlacement !== actualPlacement) {
      setActualPlacement(newPlacement);
    }
  }, [visible, placement, actualPlacement]);

  // Show/hide handlers
  const handleShow = () => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), delayMs);
  };

  const handleHide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Create properly typed event handlers
  const createEventHandlers = (originalProps: EventHandlerProps = {}) => ({
    onFocus: (e: FocusEvent<HTMLElement>) => {
      handleShow();
      originalProps.onFocus?.(e);
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      handleHide();
      originalProps.onBlur?.(e);
    },
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      handleShow();
      originalProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      handleHide();
      originalProps.onMouseLeave?.(e);
    },
  });

  // Theme styles
  const themeStyles = {
    dark: {
      bg: 'bg-gray-900 dark:bg-gray-800',
      text: 'text-white',
      border: 'border-gray-900 dark:border-gray-800',
      arrow: 'bg-gray-900 dark:bg-gray-800',
    },
    light: {
      bg: 'bg-white dark:bg-gray-100',
      text: 'text-gray-900 dark:text-gray-800',
      border: 'border-gray-200 dark:border-gray-300',
      arrow: 'bg-white dark:bg-gray-100',
    },
  };

  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const placementStyles: Record<
    string,
    { container: string; arrow: string; motionOrigin: string }
  > = {
    top: {
      container: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
      arrow: 'top-full left-1/2 -translate-x-1/2',
      motionOrigin: 'bottom center',
    },
    bottom: {
      container: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
      arrow: 'bottom-full left-1/2 -translate-x-1/2',
      motionOrigin: 'top center',
    },
    left: {
      container: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
      arrow: 'left-full top-1/2 -translate-y-1/2 -translate-x-1',
      motionOrigin: 'center right',
    },
    right: {
      container: 'left-full ml-2 top-1/2 transform -translate-y-1/2',
      arrow: 'right-full top-1/2 -translate-y-1/2 translate-x-1',
      motionOrigin: 'center left',
    },
  };

  const styles = placementStyles[actualPlacement] || placementStyles.top;
  const currentTheme = themeStyles[theme];

  if (disabled) {
    return <>{children}</>;
  }

  // Enhanced children with proper typing - no more `any`!
  const enhancedChildren = isValidElement(children)
    ? cloneElement(
        children as ReactElement<EventHandlerProps>,
        createEventHandlers(children.props as EventHandlerProps),
      )
    : children;

  return (
    <div ref={triggerRef} className="relative inline-block">
      {enhancedChildren}

      <AnimatePresence>
        {visible && (
          <motion.div
            ref={tooltipRef}
            role="tooltip"
            initial={{
              opacity: 0,
              scale: 0.85,
              y:
                actualPlacement === 'top'
                  ? 10
                  : actualPlacement === 'bottom'
                    ? -10
                    : 0,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.85,
              y:
                actualPlacement === 'top'
                  ? 10
                  : actualPlacement === 'bottom'
                    ? -10
                    : 0,
            }}
            transition={{
              duration: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: styles.motionOrigin }}
            className={`
              absolute z-50 ${styles.container} ${maxWidthClasses[maxWidth]}
              px-3 py-2 rounded-lg ${currentTheme.bg} ${currentTheme.text} 
              text-sm font-medium shadow-lg backdrop-blur-sm
              border ${currentTheme.border}
              ${className}
            `}
          >
            {content}

            <div
              className={`
                absolute w-2 h-2 ${styles.arrow} ${currentTheme.arrow}
                rotate-45 border ${currentTheme.border}
              `}
              style={{
                clipPath:
                  actualPlacement === 'top'
                    ? 'polygon(0% 0%, 100% 100%, 0% 100%)'
                    : actualPlacement === 'bottom'
                      ? 'polygon(0% 0%, 100% 0%, 100% 100%)'
                      : actualPlacement === 'left'
                        ? 'polygon(0% 0%, 100% 0%, 0% 100%)'
                        : 'polygon(100% 0%, 100% 100%, 0% 100%)',
              }}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
