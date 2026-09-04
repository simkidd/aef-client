import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  size?: number;
  priority?: boolean;
}

export function Logo({
  className,
  href,
  size = 100,
  priority = false,
}: LogoProps) {
  const content = (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <Image
        src="/logos/adele-logo.png"
        alt="Adele Foundation"
        width={size}
        height={size}
        className={cn("h-auto w-auto object-contain", className)}
        priority={priority}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
