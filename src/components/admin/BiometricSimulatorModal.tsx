"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Radio,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Field, FieldLabel, FieldDescription, FieldGroup } from "../ui/field";
import { api } from "@/lib/client";
import { BiometricDevice, Enrollment } from "@/interfaces";

interface BiometricSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: () => void;
}

export function BiometricSimulatorModal({
  isOpen,
  onClose,
  onScanSuccess,
}: BiometricSimulatorModalProps) {
  const [selectedDeviceSerial, setSelectedDeviceSerial] =
    useState<string>("BIO-DEV-LAGOS-01");
  const [selectedToken, setSelectedToken] = useState<string>(
    "BIO-AEF-JOHN-EZE-TOKEN-01",
  );
  const [customToken, setCustomToken] = useState<string>("");
  const [scanType, setScanType] = useState<"IN" | "OUT">("IN");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // Fetch devices
  const { data: devicesData } = useQuery({
    queryKey: ["biometric-devices"],
    queryFn: async () => {
      const res = await api.get("/biometrics/devices");
      return res.data?.data as BiometricDevice[];
    },
    enabled: isOpen,
  });

  // Fetch active trainees with biometric tokens
  const { data: enrollmentsData } = useQuery({
    queryKey: ["active-enrollments-biometrics"],
    queryFn: async () => {
      const res = await api.get("/enrollments/queue?status=Active");
      return res.data?.data as Enrollment[];
    },
    enabled: isOpen,
  });

  const handleSimulateScan = async () => {
    setIsScanning(true);
    setScanResult(null);

    const tokenToUse = customToken.trim() || selectedToken;

    try {
      const res = await api.post("/biometrics/scan", {
        deviceSerial: selectedDeviceSerial,
        biometricToken: tokenToUse,
        scanType,
        timestamp: new Date().toISOString(),
        metadata: {
          simulatedBy: "Admin Control Panel",
          qualityScore: 99,
        },
      });

      setScanResult({
        success: true,
        data: res.data?.data,
        message: res.data?.message || "Biometric optical scan processed.",
      });

      if (onScanSuccess) {
        onScanSuccess();
      }
    } catch (err: any) {
      setScanResult({
        success: false,
        error:
          err.response?.data?.message ||
          err.message ||
          "Scan rejected or unrecognized.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base">
                Optical Biometric Terminal Simulator
              </DialogTitle>
              <DialogDescription className="text-xs">
                Emulate physical fingerprint optical scanner events and verify
                live attendance logging.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <FieldGroup>
            {/* Device Selection */}
            <Field>
              <FieldLabel htmlFor="scannerDevice">
                Select Biometric Scanner Device
              </FieldLabel>
              <select
                id="scannerDevice"
                value={selectedDeviceSerial}
                onChange={(e) => setSelectedDeviceSerial(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {devicesData?.map((dev) => (
                  <option key={dev._id} value={dev.deviceSerial}>
                    {dev.deviceName} ({dev.deviceSerial}) — {dev.status}
                  </option>
                )) || (
                  <>
                    <option value="BIO-DEV-LAGOS-01">
                      Lagos Reception Main Biometric Gate (BIO-DEV-LAGOS-01)
                    </option>
                    <option value="BIO-DEV-OGUN-01">
                      Ogun Hub Entrance Scanner (BIO-DEV-OGUN-01)
                    </option>
                  </>
                )}
              </select>
            </Field>

            {/* Enrolled Trainee Token */}
            <Field>
              <FieldLabel htmlFor="traineeToken">
                Select Registered Trainee
              </FieldLabel>
              <select
                id="traineeToken"
                value={selectedToken}
                onChange={(e) => {
                  setSelectedToken(e.target.value);
                  setCustomToken("");
                }}
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="BIO-AEF-JOHN-EZE-TOKEN-01">
                  John Eze (Solar PV) — Token: BIO-AEF-JOHN-EZE-TOKEN-01
                </option>
                {enrollmentsData
                  ?.filter(
                    (e) => e.biometricRegistrationDetails?.biometricIdentifier,
                  )
                  .map((enr) => (
                    <option
                      key={enr._id}
                      value={
                        enr.biometricRegistrationDetails?.biometricIdentifier
                      }
                    >
                      {enr.beneficiaryId?.firstName}{" "}
                      {enr.beneficiaryId?.lastName} ({enr.skillAreaId?.name}) —{" "}
                      {enr.biometricRegistrationDetails?.biometricIdentifier}
                    </option>
                  ))}
              </select>
            </Field>

            {/* Or Test Unknown Scan */}
            <Field>
              <FieldLabel htmlFor="customToken">
                Or Enter Custom Token (Test Unknown Scan Triage)
              </FieldLabel>
              <Input
                id="customToken"
                placeholder="e.g. UNKNOWN-FINGERPRINT-SCAN-9921"
                value={customToken}
                onChange={(e) => setCustomToken(e.target.value)}
                className="text-xs"
              />
              <FieldDescription>
                Simulate unmatched prints to test security anomaly alerting
              </FieldDescription>
            </Field>

            {/* Scan Type */}
            <Field>
              <FieldLabel>Event Type (IN / OUT)</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setScanType("IN")}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-semibold transition-all ${
                    scanType === "IN"
                      ? "border-teal-600 bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <Radio
                    className={`h-4 w-4 ${scanType === "IN" ? "text-teal-600" : "text-slate-400"}`}
                  />
                  Morning Clock-IN
                </button>
                <button
                  type="button"
                  onClick={() => setScanType("OUT")}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-semibold transition-all ${
                    scanType === "OUT"
                      ? "border-teal-600 bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <Radio
                    className={`h-4 w-4 ${scanType === "OUT" ? "text-teal-600" : "text-slate-400"}`}
                  />
                  Afternoon Clock-OUT
                </button>
              </div>
            </Field>
          </FieldGroup>

          {/* Real-time result preview */}
          {scanResult && (
            <div
              className={`rounded-xl border p-4 text-xs ${
                scanResult.success
                  ? scanResult.data?.isMatched
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                  : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {scanResult.success ? (
                  scanResult.data?.isMatched ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  )
                ) : (
                  <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">
                    {scanResult.message || scanResult.error}
                  </p>
                  {scanResult.data?.isMatched && (
                    <p className="mt-1 text-[11px] opacity-90">
                      Matched Trainee Beneficiary ID:{" "}
                      {scanResult.data.beneficiaryId}. Attendance Record logged.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="gap-2 bg-teal-700 hover:bg-teal-800"
          >
            {isScanning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Fingerprint className="h-4 w-4" />
            )}
            Trigger Biometric Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
