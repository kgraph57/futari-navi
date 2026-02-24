"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackCTAClick } from "@/lib/analytics/events";

interface TrackedCTALinkProps extends ComponentProps<typeof Link> {
  readonly ctaName: string;
  readonly location: string;
}

export function TrackedCTALink({
  ctaName,
  location,
  onClick,
  ...props
}: TrackedCTALinkProps) {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    trackCTAClick(ctaName, location);
    if (onClick) {
      onClick(e);
    }
  };

  return <Link {...props} onClick={handleClick} />;
}
