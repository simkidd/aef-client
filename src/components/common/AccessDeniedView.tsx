"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface AccessDeniedViewProps {
  requiredPermission?: string;
  pageTitle?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export function AccessDeniedView({
  requiredPermission,
  pageTitle,
  description,
  backHref = "/admin",
  backLabel = "Return to Dashboard",
}: AccessDeniedViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 sm:p-8 animate-in fade-in-50 duration-200">
      <Card className="w-full max-w-lg border-border bg-card shadow-lg overflow-hidden py-0 gap-0 text-center">
        <CardHeader className="p-6 sm:p-8 bg-destructive/5 border-b border-border flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mb-3 shadow-xs">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold font-heading text-foreground tracking-tight">
            Access Restricted (403)
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
            {pageTitle ? (
              <>
                You do not have administrative privileges to access the{" "}
                <strong className="text-foreground">{pageTitle}</strong>{" "}
                section.
              </>
            ) : (
              "You do not possess the necessary security privileges to view this page."
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description ||
              "Your assigned role does not grant permission to perform operations or review records at this endpoint. Contact your system super administrator to request elevation of your RBAC privileges."}
          </p>

          {requiredPermission && (
            <div className="p-3 rounded-xl bg-muted/40 border border-border inline-flex items-center gap-2 max-w-full">
              <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-[11px] text-muted-foreground font-mono truncate">
                Required Capability:{" "}
                <strong className="text-primary font-bold">
                  {requiredPermission}
                </strong>
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 sm:p-6 border-t border-border bg-muted/10 flex items-center justify-center gap-3">
          <Link href={backHref}>
            <Button
              size="sm"
              className="h-9 px-4 text-xs font-semibold gap-1.5 shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{backLabel}</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
