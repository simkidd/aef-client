"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { BiometricDevice } from "@/interfaces";
import { Radio } from "lucide-react";

interface BiometricsDeviceCardProps {
  device: BiometricDevice;
}

export function BiometricsDeviceCard({ device }: BiometricsDeviceCardProps) {
  const isOnline = device.status === "Online";

  return (
    <Card className="border-border bg-card p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Radio
              className={`h-5 w-5 ${
                isOnline ? "animate-pulse text-emerald-500" : "text-muted-foreground"
              }`}
            />
          </div>
          <div>
            <h2 className="font-bold text-sm font-heading text-foreground">
              {device.deviceName}
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground block">
              {device.deviceSerial} • {device.model}
            </span>
          </div>
        </div>
        <StatusBadge status={device.status} size="sm" />
      </div>

      <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
            Centre Facility
          </span>
          <p className="font-semibold text-foreground truncate">
            {device.centreId?.name || "Unassigned"}
          </p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
            Templates Enrolled
          </span>
          <p className="font-semibold text-primary">
            {device.registeredTemplatesCount || 0} Fingerprints
          </p>
        </div>
      </div>
    </Card>
  );
}
