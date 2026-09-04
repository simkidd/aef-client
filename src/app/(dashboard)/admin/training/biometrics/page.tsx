"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Fingerprint,
  Radio,
  Plus,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { BiometricSimulatorModal } from "@/components/admin/BiometricSimulatorModal";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { BiometricDevice, BiometricEvent } from "@/interfaces";

export default function BiometricsManagementPage() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Fetch devices
  const { data: devices, refetch: refetchDevices } = useQuery({
    queryKey: ["admin-devices-list"],
    queryFn: async () => {
      const res = await api.get("/biometrics/devices");
      return res.data?.data as BiometricDevice[];
    },
  });

  // Fetch raw biometric event logs
  const { data: events, refetch: refetchEvents } = useQuery({
    queryKey: ["admin-biometric-events"],
    queryFn: async () => {
      const res = await api.get("/biometrics/events");
      return res.data?.data as BiometricEvent[];
    },
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Biometric Infrastructure & Raw Scans
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live scanner hardware monitor, unknown scan triage, and real-time
              event stream from training centre gates.
            </p>
          </div>
          <Button
            onClick={() => setIsSimulatorOpen(true)}
            className="bg-teal-700 hover:bg-teal-800 text-xs font-semibold gap-2"
          >
            <Fingerprint className="h-4 w-4" />
            Launch Scanner Simulator
          </Button>
        </div>

        {/* Devices Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {devices?.map((dev) => (
            <Card
              key={dev._id}
              className="border-slate-200 dark:border-slate-800 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center dark:bg-teal-950 dark:text-teal-300">
                    <Radio className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {dev.deviceName}
                    </h2>
                    <span className="font-mono text-[10px] text-slate-400">
                      {dev.deviceSerial} • {dev.model}
                    </span>
                  </div>
                </div>
                <StatusBadge status={dev.status} size="sm" />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Centre
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {dev.centreId?.name}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Templates Registered
                  </span>
                  <p className="font-semibold text-teal-700">
                    {dev.registeredTemplatesCount} Fingerprints
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Raw Ingested Scans Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Real-Time Raw Biometric Scans Stream
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchEvents();
                refetchDevices();
              }}
              className="text-xs h-8 gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Device Serial</TableHead>
                  <TableHead>Biometric Token</TableHead>
                  <TableHead>Scan Type</TableHead>
                  <TableHead>Trainee Match</TableHead>
                  <TableHead>Attendance Processed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events && events.length > 0 ? (
                  events.map((evt) => (
                    <TableRow key={evt._id}>
                      <TableCell className="text-xs font-mono">
                        {formatDate(evt.timestamp, true)}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {evt.deviceSerial}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {evt.biometricToken}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                          {evt.scanType}
                        </span>
                      </TableCell>
                      <TableCell>
                        {evt.isMatched ? (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />{" "}
                            {evt.beneficiaryId?.firstName}{" "}
                            {evt.beneficiaryId?.lastName}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" /> Unknown
                            Token Flagged
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {evt.isMatched ? (
                          <span className="text-xs text-teal-700 font-semibold">
                            Attendance Updated
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Held for review
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-slate-500 text-xs"
                    >
                      No raw biometric events ingested yet. Use the Simulator
                      above to test live scans.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        <BiometricSimulatorModal
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          onScanSuccess={() => {
            refetchEvents();
            refetchDevices();
          }}
        />
      </div>
    </>
  );
}
