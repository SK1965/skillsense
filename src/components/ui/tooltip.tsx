'use client';

import React, {
  useState,
  useRef,
  ReactNode,
  FocusEvent,
  MouseEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  delayMs?: number; // delay before showing tooltip
  className?: string; // extra classes for tooltip content container
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({
  content,
  children,
  delayMs = 200,
  className = '',
  placement = 'top',
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
    // Check if children is a valid React element and has an onFocus prop,
    // then safely cast children.props to an object to access onFocus.
    if (
      React.isValidElement(children) &&
      typeof children.props === 'object' &&
      children.props !== null &&
      'onFocus' in children.props &&
      typeof children.props.onFocus === 'function'
    ) {
      // Call the original onFocus handler if it exists
      (children.props.onFocus as React.FocusEventHandler<HTMLElement>)(e);
    }
  };

  const onBlur = (e: FocusEvent<HTMLElement>) => {
    handleHide();
    if (
      React.isValidElement(children) &&
      typeof children.props === 'object' &&
      children.props !== null &&
      'onBlur' in children.props &&
      typeof children.props.onBlur === 'function'
    ) {
      (children.props.onBlur as React.FocusEventHandler<HTMLElement>)(e); // Safely cast and call
    }
  };

  // Mouse events
  const onMouseEnter = (e: MouseEvent<HTMLElement>) => {
    handleShow();
    if (
      React.isValidElement(children) &&
      typeof children.props === 'object' &&
      children.props !== null &&
      'onMouseEnter' in children.props &&
      typeof children.props.onMouseEnter === 'function'
    ) {
      (children.props.onMouseEnter as React.MouseEventHandler<HTMLElement>)(e); // Safely cast and call
    }
  };
  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    handleHide();
    if (
      React.isValidElement(children) &&
      typeof children.props === 'object' &&
      children.props !== null &&
      'onMouseLeave' in children.props &&
      typeof children.props.onMouseLeave === 'function'
    ) {
      (children.props.onMouseLeave as React.MouseEventHandler<HTMLElement>)(e);
    }
  };

  // Tooltip position styles based on placement prop
  // You can extend this for left/right if needed.
  const placementStyles: Record<
    string,
    { container: string; arrow: string; motionOrigin: string }
  > = {
    top: {
      container: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
      arrow: 'top-full left-1/2 -translate-x-1/2 border-t-gray-700',
      motionOrigin: 'bottom center',
    },
    bottom: {
      container: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
      arrow: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-700',
      motionOrigin: 'top center',
    },
    left: {
      container: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
      arrow: 'right-0 top-1/2 -translate-y-1/2 border-l-gray-700',
      motionOrigin: 'right center',
    },
    right: {
      container: 'left-full ml-2 top-1/2 transform -translate-y-1/2',
      arrow: 'left-0 top-1/2 -translate-y-1/2 border-r-gray-700',
      motionOrigin: 'left center',
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
