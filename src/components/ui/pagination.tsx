import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  disabled,
  size = "icon",
  onClick,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size={size}
      disabled={disabled}
      className={cn(
        "h-8 min-w-8 px-2 text-xs font-medium transition-all cursor-pointer select-none rounded-md",
        isActive
          ? "bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted/60",
        disabled && "pointer-events-none opacity-30 cursor-not-allowed",
        className
      )}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
              return;
            }
            onClick?.(e);
          }}
          {...props}
        />
      }
    />
  );
}

function PaginationFirst({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to first page"
      size="icon"
      disabled={disabled}
      className={cn(
        "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-muted/60",
        className
      )}
      {...props}
    >
      <ChevronsLeftIcon className="h-4 w-4" />
      <span className="sr-only">First page</span>
    </PaginationLink>
  );
}

function PaginationPrevious({
  className,
  text = "Previous",
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      disabled={disabled}
      className={cn(
        "h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-muted/60 gap-1",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = "Next",
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      disabled={disabled}
      className={cn(
        "h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-muted/60 gap-1",
        className
      )}
      {...props}
    >
      <span className="hidden sm:inline">{text}</span>
      <ChevronRightIcon className="h-3.5 w-3.5" />
    </PaginationLink>
  );
}

function PaginationLast({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to last page"
      size="icon"
      disabled={disabled}
      className={cn(
        "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-muted/60",
        className
      )}
      {...props}
    >
      <ChevronsRightIcon className="h-4 w-4" />
      <span className="sr-only">Last page</span>
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex h-8 w-8 items-center justify-center text-muted-foreground/60",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationNext,
  PaginationPrevious,
  PaginationLast,
};
