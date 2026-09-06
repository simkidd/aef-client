"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationNext,
  PaginationPrevious,
  PaginationLast,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
  showDetails?: boolean;
  showFirstLast?: boolean;
}

export function TablePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  className,
  showDetails = true,
  showFirstLast = true,
}: TablePaginationProps) {
  if (total <= 0 && totalPages <= 1) {
    return null;
  }

  const startRecord = total > 0 ? Math.min((page - 1) * limit + 1, total) : 0;
  const endRecord = total > 0 ? Math.min(page * limit, total) : 0;

  // Generate page numbers with smart ellipses
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          page - 1,
          page,
          page + 1,
          "ellipsis",
          totalPages
        );
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground select-none",
        className
      )}
    >
      {/* Left Details: Showing X to Y of Z results */}
      {showDetails && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground order-2 sm:order-1">
          <span>Showing</span>
          <span className="font-semibold text-foreground">
            {startRecord.toLocaleString()}
          </span>
          <span>to</span>
          <span className="font-semibold text-foreground">
            {endRecord.toLocaleString()}
          </span>
          <span>of</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold bg-muted text-foreground border border-border/80">
            {total.toLocaleString()}
          </span>
          <span>results</span>
        </div>
      )}

      {/* Right Controls: Navigation Buttons */}
      <Pagination className="mx-0 w-auto justify-center sm:justify-end order-1 sm:order-2">
        <PaginationContent className="gap-1">
          {/* Quick First Page Button */}
          {showFirstLast && totalPages > 2 && (
            <PaginationItem>
              <PaginationFirst
                disabled={page <= 1}
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(1);
                }}
              />
            </PaginationItem>
          )}

          {/* Previous Page Button */}
          <PaginationItem>
            <PaginationPrevious
              disabled={page <= 1}
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
            />
          </PaginationItem>

          {/* Page Number Buttons */}
          {pages.map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next Page Button */}
          <PaginationItem>
            <PaginationNext
              disabled={page >= totalPages}
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) onPageChange(page + 1);
              }}
            />
          </PaginationItem>

          {/* Quick Last Page Button */}
          {showFirstLast && totalPages > 2 && (
            <PaginationItem>
              <PaginationLast
                disabled={page >= totalPages}
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(totalPages);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
