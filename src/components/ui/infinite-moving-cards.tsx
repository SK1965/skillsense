'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
}: {
  items: { quote: string; name: string; title: string }[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);

  /* helpers ------------------------------------------------------------ */
  const applyDirection = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty(
      '--animation-direction',
      direction === 'left' ? 'forwards' : 'reverse',
    );
  }, [direction]);

  const applySpeed = useCallback(() => {
    if (!containerRef.current) return;
    const duration =
      speed === 'fast' ? '20s' : speed === 'slow' ? '80s' : '40s';
    containerRef.current.style.setProperty('--animation-duration', duration);
  }, [speed]);

  const addAnimation = useCallback(() => {
    if (!(containerRef.current && scrollerRef.current)) return;

    /* duplicate children so scroll appears infinite */
    const clones = Array.from(scrollerRef.current.children).map((el) =>
      el.cloneNode(true),
    );
    clones.forEach((clone) => scrollerRef.current!.appendChild(clone));

    applyDirection();
    applySpeed();
    setStart(true);
  }, [applyDirection, applySpeed]);

  /* init --------------------------------------------------------------- */
  useEffect(() => addAnimation(), [addAnimation]);

  /* view --------------------------------------------------------------- */
  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        {items.map((t) => (
          <li
            key={t.name}
            className="relative w-[350px] md:w-[450px] max-w-full shrink-0 rounded-2xl
                       border border-white/20 dark:border-slate-700/40
                       bg-white/70 dark:bg-slate-800/60 backdrop-blur-md
                       px-8 py-6 shadow-md transition hover:shadow-lg"
          >
            <blockquote className="relative z-10">
              <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                {t.quote}
              </p>

              <footer className="mt-6">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {t.name}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500">
                  {t.title}
                </div>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
