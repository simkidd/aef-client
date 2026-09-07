"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Fingerprint,
  Radio,
  RefreshCw,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Building2,
  Layers,
  ArrowRight,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  LayoutDashboard,
  Lock,
  LogOut,
  LogIn,
  UserCheck,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  useCentresQuery,
  useBiometricDevicesQuery,
  useSkillAreasQuery,
  useAttendanceSheetQuery,
  useCurrentUserQuery,
  useEnrollmentsQuery,
} from "@/hooks/queries";
import { useProcessBiometricScanMutation } from "@/hooks/mutations";
import { SoundEffects } from "@/lib/services/sound.service";
import { Enrollment, Centre } from "@/interfaces";

interface ScanResultData {
  status: "success" | "error";
  message: string;
  scanType: "IN" | "OUT";
  trainee?: {
    name: string;
    code: string;
    track: string;
    cohort?: string;
    time: string;
    isLate?: boolean;
    minutesLate?: number;
  };
}

export function BiometricKioskTerminalView() {
  const [selectedDeviceSerial, setSelectedDeviceSerial] = useState<string>("");
  const [selectedSkillAreaId, setSelectedSkillAreaId] = useState<string>("all");
  const [scanType, setScanType] = useState<"IN" | "OUT">("IN");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [devicePingMs, setDevicePingMs] = useState<number>(18);

  // Laptop biometric (WebAuthn / Windows Hello) capability
  const [hasPlatformBiometrics, setHasPlatformBiometrics] =
    useState<boolean>(false);

  // Scanning animation state
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);

  // Modals state
  const [activeResult, setActiveResult] = useState<ScanResultData | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);

  // Manual modal search
  const [manualSearch, setManualSearch] = useState("");
  const [manualSkillFilter, setManualSkillFilter] = useState("all");

  // Today punches log filter
  const [allLogsSearch, setAllLogsSearch] = useState("");

  // Recent punches feed (in-memory live session log)
  const [recentPunches, setRecentPunches] = useState<
    Array<{
      id: string;
      name: string;
      code: string;
      track: string;
      scanType: "IN" | "OUT";
      time: string;
      isLate?: boolean;
    }>
  >([]);

  // Check laptop platform biometric hardware support (Windows Hello / Touch ID)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.PublicKeyCredential &&
      typeof window.PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable === "function"
    ) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => setHasPlatformBiometrics(available))
        .catch(() => setHasPlatformBiometrics(false));
    }
  }, []);

  // 1. User & Centre Queries
  const { data: currentUser } = useCurrentUserQuery();
  const { data: centres = [] } = useCentresQuery();

  // Determine the tied centre (Station is fixed to prevent misplaced records)
  const tiedCentre: Centre | undefined = useMemo(() => {
    if (currentUser) {
      const userAssigned = (currentUser as any).assignedCentreId;
      if (userAssigned) {
        const assignedId =
          typeof userAssigned === "object"
            ? userAssigned._id || userAssigned.id
            : userAssigned;
        const match = centres.find(
          (c) => c._id === assignedId || (c as any).id === assignedId,
        );
        if (match) return match;
      }

      // Check scope assignment
      const centreScope = currentUser.scopeAssignments?.find(
        (s) => s.scopeType === "CENTRE" && s.targetId,
      );
      if (centreScope?.targetId) {
        const match = centres.find(
          (c) =>
            c._id === centreScope.targetId ||
            (c as any).id === centreScope.targetId,
        );
        if (match) return match;
      }
    }

    // Check if station ID was persisted locally
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem("aef_terminal_centre_id");
      if (savedId) {
        const match = centres.find(
          (c) => c._id === savedId || (c as any).id === savedId,
        );
        if (match) return match;
      }
    }

    return centres[0];
  }, [currentUser, centres]);

  const tiedCentreId = tiedCentre?._id || (tiedCentre as any)?.id || "";

  // 2. Hardware & Skill Queries scoped to tied centre
  const { data: devices = [], refetch: refetchDevices } =
    useBiometricDevicesQuery(tiedCentreId || undefined);
  const { data: skillAreas = [] } = useSkillAreasQuery();

  // Active enrolled trainees scoped to tied centre
  const { data: activeEnrollments = [] } = useEnrollmentsQuery(
    tiedCentreId
      ? { centreId: tiedCentreId, status: "Active" }
      : { status: "Active" },
  );

  // Format today's date (YYYY-MM-DD) for fetching today's records
  const todayDateStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  // Today's attendance sheet from backend for this centre
  const { data: todayAttendanceData = [], refetch: refetchAttendance } =
    useAttendanceSheetQuery({
      centreId: tiedCentreId || undefined,
      date: todayDateStr,
      limit: 100,
    });

  const todayAttendance = useMemo(() => {
    if (Array.isArray(todayAttendanceData)) return todayAttendanceData;
    if (
      todayAttendanceData &&
      Array.isArray((todayAttendanceData as any).docs)
    ) {
      return (todayAttendanceData as any).docs;
    }
    return [];
  }, [todayAttendanceData]);

  // 3. Scan Mutation Hook
  const scanMutation = useProcessBiometricScanMutation({
    onSuccess: () => {
      refetchAttendance();
    },
  });

  // Auto-set default device for this centre
  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceSerial) {
      setSelectedDeviceSerial(devices[0].deviceSerial);
    }
  }, [devices, selectedDeviceSerial]);

  // Subtle scanner ping jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setDevicePingMs(Math.floor(12 + Math.random() * 8));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss scan result modal after 4 seconds
  useEffect(() => {
    if (activeResult) {
      const timer = setTimeout(() => {
        setActiveResult(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeResult]);

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Selected device object
  const currentDevice = devices.find(
    (d) => d.deviceSerial === selectedDeviceSerial,
  ) || {
    deviceName: devices[0]?.deviceName || "Integrated Optical Sensor Gate",
    deviceSerial:
      selectedDeviceSerial || devices[0]?.deviceSerial || "BIO-DEV-01",
    status: "Online",
    model: "AEF OptiScan 5000 Pro",
  };

  // Primary Punch Trigger Handler
  const handleProcessScan = async (
    overrideToken?: string,
    fallbackTrainee?: any,
    overrideScanType?: "IN" | "OUT",
    useLaptopSensor: boolean = false,
  ) => {
    if (isScanningAnimation || scanMutation.isPending) return;

    const activeScanType = overrideScanType || scanType;
    setIsScanningAnimation(true);

    const token =
      overrideToken ||
      fallbackTrainee?.beneficiaryCode ||
      "BIO-AEF-JOHN-EZE-TOKEN-01";

    const timestamp = new Date().toISOString();
    const scanTimeFormatted = new Date().toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    try {
      let hardwareToken = token;

      // If user chose to test with their physical laptop fingerprint scanner (Windows Hello / Touch ID)
      if (useLaptopSensor) {
        if (
          typeof window === "undefined" ||
          !window.PublicKeyCredential ||
          !window.crypto
        ) {
          throw new Error(
            "WebAuthn Biometric API is not supported in this browser environment.",
          );
        }

        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const userId = new Uint8Array(16);
        window.crypto.getRandomValues(userId);

        // Invoke native Windows Hello / Touch ID platform fingerprint authenticator
        const credential: any = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: {
              name: "AEF Biometric Attendance Terminal",
              id: window.location.hostname || "localhost",
            },
            user: {
              id: userId,
              name: currentUser?.email || "trainee@adele.org",
              displayName: currentUser
                ? `${currentUser.firstName} ${currentUser.lastName}`
                : "Enrolled Trainee",
            },
            pubKeyCredParams: [
              { alg: -7, type: "public-key" }, // ES256
              { alg: -257, type: "public-key" }, // RS256
            ],
            authenticatorSelection: {
              authenticatorAttachment: "platform", // strictly onboard laptop fingerprint / Windows Hello
              userVerification: "required", // requires biometric validation
            },
            timeout: 45000,
          },
        });

        if (!credential || !credential.id) {
          throw new Error(
            "Biometric reading failed: No valid signature returned by onboard sensor.",
          );
        }

        // Successfully read from laptop fingerprint hardware
        hardwareToken = `BIO-LAPTOP-${credential.id.slice(0, 16)}`;
      } else {
        // Optical terminal scanner simulation delay
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      const res: any = await scanMutation.mutateAsync({
        deviceSerial: selectedDeviceSerial || currentDevice.deviceSerial,
        biometricToken: hardwareToken,
        scanType: activeScanType,
        timestamp,
        metadata: {
          skillAreaId:
            selectedSkillAreaId !== "all" ? selectedSkillAreaId : undefined,
          centreId: tiedCentreId,
          simulatedBy: useLaptopSensor
            ? "Laptop Onboard Biometric Sensor (Windows Hello)"
            : "Biometric Attendance Terminal",
          qualityScore: 99,
        },
      });

      if (!res?.isMatched || !res?.beneficiary) {
        throw new Error(
          "Unmatched biometric scan. No enrolled trainee record found matching this fingerprint at this centre.",
        );
      }

      const ben = res.beneficiary;

      if (soundEnabled) SoundEffects.playSuccess();

      const traineeData = {
        name: ben
          ? `${ben.firstName || ""} ${ben.lastName || ""}`.trim()
          : "Enrolled Trainee",
        code: ben?.beneficiaryCode || "AEF-BEN-001",
        track:
          res?.skillArea?.name ||
          fallbackTrainee?.skillName ||
          "Vocational Workshop Track",
        cohort: res?.cohort?.name || "Active Training Cohort",
        time: scanTimeFormatted,
        isLate: res?.attendanceRecord?.isLate || false,
        minutesLate: res?.attendanceRecord?.minutesLate || 0,
      };

      const resultObj: ScanResultData = {
        status: "success",
        scanType: activeScanType,
        message: `${activeScanType === "IN" ? "Clock In (Sign In)" : "Clock Out (Sign Out)"} Confirmed`,
        trainee: traineeData,
      };

      setActiveResult(resultObj);

      toast.success(
        `${activeScanType === "IN" ? "Clock In" : "Clock Out"} Success: ${traineeData.name} (${traineeData.code})`,
        {
          description: `${traineeData.track} • ${traineeData.time}`,
        },
      );

      setRecentPunches((prev) => [
        {
          id: `punch_${Date.now()}`,
          name: traineeData.name,
          code: traineeData.code,
          track: traineeData.track,
          scanType: activeScanType,
          time: scanTimeFormatted,
          isLate: traineeData.isLate,
        },
        ...prev.slice(0, 19),
      ]);
    } catch (err: any) {
      if (soundEnabled) SoundEffects.playError();

      let errMsg =
        "Unmatched biometric scan. Please reposition finger or verify registration.";
      if (
        err.name === "NotAllowedError" ||
        err.message?.includes("timed out") ||
        err.message?.includes("canceled") ||
        err.message?.includes("not allowed")
      ) {
        errMsg =
          "Laptop biometric scan was cancelled, timed out, or not recognized. Please touch your laptop fingerprint sensor with an enrolled finger.";
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (err.message) {
        errMsg = err.message;
      }

      setActiveResult({
        status: "error",
        scanType: activeScanType,
        message: errMsg,
      });

      toast.error("Biometric Verification Error", {
        description: errMsg,
      });
    } finally {
      setIsScanningAnimation(false);
    }
  };

  // Filtered enrolled trainees for manual search modal
  const filteredManualTrainees = useMemo(() => {
    return activeEnrollments.filter((enr: Enrollment) => {
      const matchesSkill =
        manualSkillFilter === "all" ||
        (typeof enr.skillAreaId === "object"
          ? enr.skillAreaId?._id === manualSkillFilter
          : enr.skillAreaId === manualSkillFilter);

      if (!matchesSkill) return false;

      if (!manualSearch) return true;
      const q = manualSearch.toLowerCase().trim();
      const ben = enr.beneficiaryId;
      const name = `${ben?.firstName} ${ben?.lastName}`.toLowerCase();
      const code = (ben?.beneficiaryCode || "").toLowerCase();
      const phone = (ben?.phone || "").toLowerCase();
      return name.includes(q) || code.includes(q) || phone.includes(q);
    });
  }, [activeEnrollments, manualSkillFilter, manualSearch]);

  // Unified Today's Live Punches (loaded from backend attendance records + live session punches)
  const todayLivePunches = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      code: string;
      track: string;
      scanType: "IN" | "OUT";
      time: string;
      isLate?: boolean;
      status?: string;
      timestampMs: number;
    }> = [];

    // 1. Live punches in current browser session
    for (const p of recentPunches) {
      list.push({
        id: p.id,
        name: p.name,
        code: p.code,
        track: p.track,
        scanType: p.scanType,
        time: p.time,
        isLate: p.isLate,
        status: p.isLate ? "Late" : "Present",
        timestampMs: Date.now(),
      });
    }

    // 2. Persisted backend attendance records for today
    for (const rec of todayAttendance) {
      const ben = rec.beneficiaryId;
      const name = ben
        ? `${ben.firstName || ""} ${ben.lastName || ""}`.trim()
        : "Enrolled Trainee";
      const code = ben?.beneficiaryCode || "AEF-TRAINEE";
      const track = rec.skillAreaId?.name || "Skill Workshop Track";

      if (
        rec.clockInEvents &&
        Array.isArray(rec.clockInEvents) &&
        rec.clockInEvents.length > 0
      ) {
        for (const ev of rec.clockInEvents) {
          const evDate = new Date(ev.timestamp);
          list.push({
            id: `${rec._id}-${ev._id || ev.timestamp}`,
            name,
            code,
            track,
            scanType: (ev.scanType || "IN") as "IN" | "OUT",
            time: evDate.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
            isLate: rec.isLate,
            status: rec.status,
            timestampMs: evDate.getTime(),
          });
        }
      } else {
        if (rec.firstClockIn) {
          const inDate = new Date(rec.firstClockIn);
          list.push({
            id: `${rec._id}-in`,
            name,
            code,
            track,
            scanType: "IN",
            time: inDate.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
            isLate: rec.isLate,
            status: rec.status,
            timestampMs: inDate.getTime(),
          });
        }
        if (rec.lastClockOut) {
          const outDate = new Date(rec.lastClockOut);
          list.push({
            id: `${rec._id}-out`,
            name,
            code,
            track,
            scanType: "OUT",
            time: outDate.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
            isLate: false,
            status: rec.status,
            timestampMs: outDate.getTime(),
          });
        }
      }
    }

    // Sort newest punches first
    list.sort((a, b) => b.timestampMs - a.timestampMs);

    // Deduplicate by code/name + time + scanType
    const seen = new Set<string>();
    const unique = [];
    for (const item of list) {
      const key = `${item.code || item.name}-${item.time}-${item.scanType}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    return unique;
  }, [todayAttendance, recentPunches]);

  // Filtered all logs for View All Modal
  const filteredAllLogs = useMemo(() => {
    if (!allLogsSearch) return todayLivePunches;
    const q = allLogsSearch.toLowerCase().trim();
    return todayLivePunches.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        u.track.toLowerCase().includes(q),
    );
  }, [todayLivePunches, allLogsSearch]);

  // Statistics calculation
  const todayCount = todayLivePunches.length;
  const presentOnTime = todayLivePunches.filter((r) => !r.isLate).length;
  const onTimeRate =
    todayCount > 0
      ? Math.round((presentOnTime / Math.max(1, todayCount)) * 100)
      : 100;

  const isScanning = isScanningAnimation || scanMutation.isPending;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pb-12">
      {/* 1. Kiosk Header Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-card border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Fingerprint className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading text-foreground">
                AEF Biometric Attendance Terminal
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                Live Station
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Instant optical fingerprint verification tied to this training
              centre.
            </p>
          </div>
        </div>

        {/* Hardware Status & Terminal Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
          {/* Scanner Pulse Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-muted/40 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-[11px] text-foreground flex items-center gap-1">
                {currentDevice.deviceName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Serial: {currentDevice.deviceSerial} • {devicePingMs}ms
              </span>
            </div>
          </div>

          {/* Audio toggle */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-8 w-8 text-muted-foreground"
            title={soundEnabled ? "Mute audio chimes" : "Enable audio chimes"}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground/50" />
            )}
          </Button>

          {/* Refresh Terminal */}
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              refetchDevices();
              refetchAttendance();
            }}
            className="h-8 w-8 text-muted-foreground"
            title="Refresh Terminal"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {/* Fullscreen Kiosk Mode */}
          <Button
            size="icon"
            variant="outline"
            onClick={toggleFullscreen}
            className="h-8 w-8 text-muted-foreground"
            title="Toggle Kiosk Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>

          {/* Return to Dashboard */}
          <Link href="/admin/training/attendance">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5 border-border hover:bg-muted font-medium"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Admin Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Fixed Centre & Station Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Tied Centre Info (Fixed — No Dropdown to prevent mistaken records) */}
        <Card className="p-3 bg-card border flex items-center justify-between shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
              <Lock className="h-3 w-3 text-primary" /> Fixed Terminal Location
            </span>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary shrink-0" />
              <div>
                <strong className="text-xs font-bold text-foreground block truncate">
                  {tiedCentre?.name || "Adele Training Centre"}
                </strong>
                <span className="text-[10px] text-muted-foreground">
                  {tiedCentre?.state
                    ? `${tiedCentre.state} State`
                    : "Main Campus"}{" "}
                  • {tiedCentre?.centreCode || "STATION-01"}
                </span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            Locked Station
          </span>
        </Card>

        {/* Hardware Reader Picker (using shadcn Select with explicit labels) */}
        <Card className="p-3 shadow-2xs">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-primary" /> Active Hardware
            Scanner
          </label>
          <Select
            value={selectedDeviceSerial}
            onValueChange={(val) => setSelectedDeviceSerial(val || "")}
          >
            <SelectTrigger className="w-full h-8 text-xs font-semibold">
              <SelectValue placeholder="Select hardware scanner...">
                {devices.find((d) => d.deviceSerial === selectedDeviceSerial)
                  ? `${devices.find((d) => d.deviceSerial === selectedDeviceSerial)?.deviceName} (${selectedDeviceSerial})`
                  : selectedDeviceSerial ||
                    "Integrated Optical Sensor (BIO-DEV-01)"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="text-xs">
              {devices.length > 0 ? (
                devices.map((dev) => (
                  <SelectItem key={dev._id} value={dev.deviceSerial}>
                    {dev.deviceName} ({dev.deviceSerial}) — {dev.status}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="BIO-DEV-01">
                  Integrated Optical Sensor (BIO-DEV-01)
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </Card>

        {/* Skill Track Workshop Filter (using shadcn Select with explicit labels) */}
        <Card className="p-3 shadow-2xs">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" /> Workshop Skill Area
          </label>
          <Select
            value={selectedSkillAreaId}
            onValueChange={(val) => setSelectedSkillAreaId(val || "all")}
          >
            <SelectTrigger className="w-full h-8 text-xs font-semibold">
              <SelectValue placeholder="Select workshop skill...">
                {selectedSkillAreaId === "all"
                  ? "⚡ All Workshops & Skill Areas"
                  : skillAreas.find((s) => s._id === selectedSkillAreaId)
                      ?.name || "⚡ All Workshops & Skill Areas"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all">
                ⚡ All Workshops & Skill Areas
              </SelectItem>
              {skillAreas.map((skill) => (
                <SelectItem key={skill._id} value={skill._id}>
                  {skill.name} ({skill.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* 3. Main Scanning Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Big Interactive Touch Pad & Verified State */}
        <div className="lg:col-span-7 space-y-4">
          {/* Clock-In / Clock-Out Large Switcher */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-muted/50 rounded-2xl border">
            <button
              type="button"
              onClick={() => {
                setScanType("IN");
                setActiveResult(null);
              }}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold transition-all shadow-xs ${
                scanType === "IN"
                  ? "bg-emerald-600 text-white shadow-emerald-500/20 shadow-md ring-2 ring-emerald-500/30"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>Clock In (Sign In)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setScanType("OUT");
                setActiveResult(null);
              }}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold transition-all shadow-xs ${
                scanType === "OUT"
                  ? "bg-rose-600 text-white shadow-rose-500/20 shadow-md ring-2 ring-rose-500/30"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span>Clock Out (Sign Out)</span>
            </button>
          </div>

          {/* Central Animated Optical Scanner Pad */}
          <Card className="relative overflow-hidden p-8 text-center border-2 border-dashed flex flex-col items-center justify-center min-h-[360px] bg-gradient-to-b from-card to-muted/20">
            {/* Background Ambient Glow */}
            <div
              className={`absolute inset-0 opacity-10 transition-colors duration-700 pointer-events-none ${
                scanType === "IN" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />

            {/* Glowing Sensor Pad Button */}
            <div
              className="relative group cursor-pointer select-none"
              onClick={() => handleProcessScan()}
            >
              {/* Outer pulsing glow ring */}
              <div
                className={`absolute -inset-4 rounded-full blur-xl opacity-40 transition-all duration-500 group-hover:opacity-75 ${
                  isScanning
                    ? "bg-primary animate-pulse"
                    : scanType === "IN"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-rose-500 animate-pulse"
                }`}
              />

              {/* Main Sensor Button Container */}
              <div
                className={`relative flex h-36 w-36 items-center justify-center rounded-full border-4 shadow-2xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 ${
                  isScanning
                    ? "border-primary bg-primary/15 text-primary"
                    : scanType === "IN"
                      ? "border-emerald-500/80 bg-emerald-500/10 text-emerald-500 group-hover:border-emerald-400 group-hover:bg-emerald-500/20"
                      : "border-rose-500/80 bg-rose-500/10 text-rose-500 group-hover:border-rose-400 group-hover:bg-rose-500/20"
                }`}
              >
                {/* Active Optical Scanning Laser Line Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce absolute top-1/2 -translate-y-1/2" />
                  </div>
                )}

                {isScanning ? (
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <RefreshCw className="h-16 w-16 animate-spin text-primary" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider animate-pulse">
                      Scanning
                    </span>
                  </div>
                ) : (
                  <Fingerprint className="h-20 w-20 transition-transform duration-300 group-hover:scale-110" />
                )}
              </div>
            </div>

            {/* Instruction text */}
            <div className="mt-6 space-y-1 z-10">
              <h3 className="text-lg font-bold text-foreground">
                {isScanning
                  ? "Scanning Optical Biometric Print..."
                  : "Place Enrolled Finger on Optical Scanner"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Sensor online on{" "}
                <strong className="text-foreground">
                  {currentDevice.deviceName}
                </strong>
                . Click pad or trigger below to scan.
              </p>
            </div>

            {/* Trigger Buttons (Instant Simulation & Laptop Biometric Sensor) */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 z-10">
              <Button
                size="sm"
                onClick={() => handleProcessScan()}
                disabled={isScanning}
                className={`rounded-full px-5 text-xs font-bold gap-2 shadow-sm text-white transition-all ${
                  scanType === "IN"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                }`}
              >
                {isScanning ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {isScanning
                  ? "Reading Sensor..."
                  : `Trigger Instant Scan (${scanType === "IN" ? "Clock In" : "Clock Out"})`}
              </Button>

              {/* Laptop Biometric Sensor Trigger (Windows Hello / Touch ID) */}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleProcessScan(undefined, undefined, undefined, true)
                }
                disabled={isScanning}
                className="rounded-full px-4 text-xs font-semibold gap-1.5 border-primary/40 hover:bg-primary/10 text-foreground"
                title="Test with your laptop's built-in fingerprint reader (Windows Hello / Touch ID)"
              >
                <Laptop className="h-3.5 w-3.5 text-primary" />
                <span>Laptop Fingerprint Scanner</span>
              </Button>
            </div>
          </Card>

          {/* Quick Manual Override Trigger Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30 text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary shrink-0" />
              <div>
                <span className="font-semibold text-foreground block">
                  Fingerprint Unreadable or Damaged?
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Use manual trainee search override to record attendance.
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsManualModalOpen(true)}
              className="text-xs h-8 gap-1.5 shrink-0 font-semibold"
            >
              <Search className="h-3.5 w-3.5" />
              Manual Punch
            </Button>
          </div>
        </div>

        {/* Right Column: Summary Stats & Last 5 Recents */}
        <div className="lg:col-span-5 space-y-4">
          {/* Today's Kiosk Summary Stats */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-3 text-center shadow-2xs">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase block">
                Today Check-Ins
              </span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">
                {todayCount}
              </span>
            </Card>
            <Card className="p-3 text-center shadow-2xs">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase block">
                On-Time Rate
              </span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {onTimeRate}%
              </span>
            </Card>
          </div>

          {/* Real-time Rolling Punch Feed (Last 5 Recents) */}
          <Card className="p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Last 5 Recent
                  Punches
                </h4>
                <span className="text-[10px] text-muted-foreground">
                  Today's live terminal log
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsViewAllModalOpen(true)}
                className="h-7 text-xs px-2 font-semibold text-primary hover:bg-primary/10 gap-1"
              >
                <span>View All ({filteredAllLogs.length})</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              {todayLivePunches.length > 0 ? (
                todayLivePunches.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-foreground block">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.track} • {item.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.scanType === "IN"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {item.scanType === "IN" ? "IN" : "OUT"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground text-xs">
                  <Fingerprint className="h-7 w-7 mx-auto mb-1.5 text-muted-foreground/40" />
                  <span>No punches recorded today yet.</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Verification Result Modal (SOLID OPAQUE CARD BACKGROUND — NO TRANSPARENCY) */}
      {activeResult && (
        <Dialog
          open={!!activeResult}
          onOpenChange={(open) => {
            if (!open) setActiveResult(null);
          }}
        >
          <DialogContent
            className={`w-[92vw] sm:max-w-md p-6 rounded-2xl border-2 shadow-2xl transition-all animate-in fade-in-50 zoom-in-95 bg-card text-foreground ${
              activeResult.status === "success"
                ? activeResult.scanType === "IN"
                  ? "border-emerald-500/60"
                  : "border-rose-500/60"
                : "border-destructive/60"
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`h-16 w-16 rounded-full flex items-center justify-center shadow-lg ${
                  activeResult.status === "success"
                    ? activeResult.scanType === "IN"
                      ? "bg-emerald-600 text-white shadow-emerald-500/30"
                      : "bg-rose-600 text-white shadow-rose-500/30"
                    : "bg-destructive text-white shadow-destructive/30"
                }`}
              >
                {activeResult.status === "success" ? (
                  <CheckCircle2 className="h-9 w-9" />
                ) : (
                  <AlertTriangle className="h-9 w-9" />
                )}
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground block">
                  {activeResult.status === "success"
                    ? `${activeResult.scanType === "IN" ? "Clock In" : "Clock Out"} Verified`
                    : "Verification Failed"}
                </span>
                <DialogTitle className="text-xl font-bold font-heading text-foreground mt-0.5">
                  {activeResult.message}
                </DialogTitle>
              </div>

              {activeResult.trainee ? (
                <div className="w-full bg-muted/40 border rounded-xl p-3.5 text-xs text-left space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Trainee Name
                      </span>
                      <strong className="text-sm font-bold text-foreground">
                        {activeResult.trainee.name}
                      </strong>
                    </div>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-background border">
                      {activeResult.trainee.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Skill Track
                      </span>
                      <span className="font-semibold text-foreground block truncate">
                        {activeResult.trainee.track}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Timestamp
                      </span>
                      <span className="font-mono font-semibold text-foreground block">
                        {activeResult.trainee.time}
                      </span>
                    </div>
                  </div>

                  {activeResult.trainee.isLate !== undefined && (
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Attendance Status
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          activeResult.trainee.isLate
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {activeResult.trainee.isLate
                          ? `Late (+${activeResult.trainee.minutesLate}m)`
                          : "On-Time Check In"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground max-w-xs">
                  {activeResult.message}
                </p>
              )}

              <Button
                type="button"
                size="sm"
                onClick={() => setActiveResult(null)}
                className="w-full rounded-xl text-xs font-bold"
              >
                Dismiss / Ready for Next Scan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 5. Manual Trainee Search & Record Modal */}
      <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl h-[85vh] max-h-[85vh] flex flex-col p-0 rounded-2xl overflow-hidden bg-card text-foreground">
          <DialogHeader className="p-4 sm:p-6 pb-3 border-b bg-muted/20 shrink-0">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
              <UserCheck className="h-4 w-4" />
              <span>Manual Attendance Override</span>
            </div>
            <DialogTitle className="text-lg font-bold font-heading text-foreground">
              Search & Record Trainee Attendance
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select an enrolled trainee to record a manual Clock In or Clock
              Out if the optical fingerprint scanner fails.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 border-b bg-card space-y-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search name, code, or phone..."
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                  className="pl-8 text-xs h-9"
                />
              </div>

              <Select
                value={manualSkillFilter}
                onValueChange={(val) => setManualSkillFilter(val || "all")}
              >
                <SelectTrigger className="w-full h-9 text-xs font-semibold">
                  <SelectValue placeholder="All Workshop Tracks">
                    {manualSkillFilter === "all"
                      ? "⚡ All Workshop Tracks"
                      : skillAreas.find((s) => s._id === manualSkillFilter)
                          ?.name || "All Workshop Tracks"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="all">⚡ All Workshop Tracks</SelectItem>
                  {skillAreas.map((skill) => (
                    <SelectItem key={skill._id} value={skill._id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 divide-y">
              {filteredManualTrainees.length > 0 ? (
                filteredManualTrainees.map((enr: Enrollment) => {
                  const ben = enr.beneficiaryId;
                  const skillName =
                    typeof enr.skillAreaId === "object"
                      ? enr.skillAreaId?.name
                      : "Skill Track";
                  const token =
                    enr.biometricRegistrationDetails?.biometricIdentifier ||
                    ben?.biometricIdentifier ||
                    ben?.beneficiaryCode ||
                    "AEF-TRAINEE";

                  return (
                    <div
                      key={enr._id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-muted/40 px-2 rounded-xl transition-colors"
                    >
                      <div>
                        <strong className="text-xs font-bold text-foreground block">
                          {ben?.firstName} {ben?.lastName}
                        </strong>
                        <span className="text-[11px] text-muted-foreground block">
                          Code: {ben?.beneficiaryCode} • {skillName} •{" "}
                          {ben?.phone || "No phone"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsManualModalOpen(false);
                            handleProcessScan(
                              token,
                              { ...ben, skillName },
                              "IN",
                            );
                          }}
                          className="h-8 text-xs font-semibold gap-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          <LogIn className="h-3 w-3" /> Clock In
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsManualModalOpen(false);
                            handleProcessScan(
                              token,
                              { ...ben, skillName },
                              "OUT",
                            );
                          }}
                          className="h-8 text-xs font-semibold gap-1 text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                        >
                          <LogOut className="h-3 w-3" /> Clock Out
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <span>
                    No matching enrolled trainees found for this station.
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="m-0 p-3 sm:p-4 border-t bg-muted/20 shrink-0 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {filteredManualTrainees.length} trainees available
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsManualModalOpen(false)}
              className="text-xs h-8"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. View All Today Attendance Ledger Dialog */}
      <Dialog open={isViewAllModalOpen} onOpenChange={setIsViewAllModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-3xl h-[88vh] max-h-[88vh] flex flex-col p-0 rounded-2xl overflow-hidden bg-card text-foreground">
          <DialogHeader className="p-4 sm:p-6 pb-3 border-b bg-muted/20 shrink-0">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
              <Clock className="h-4 w-4" />
              <span>Station Attendance Ledger</span>
            </div>
            <DialogTitle className="text-lg font-bold font-heading text-foreground">
              Today's Attendance Records ({filteredAllLogs.length})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              All optical biometric and manual attendance scans recorded today
              at {tiedCentre?.name || "this centre"}.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 border-b bg-card shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search punches by trainee name, code, or track..."
                value={allLogsSearch}
                onChange={(e) => setAllLogsSearch(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 divide-y text-xs">
              {filteredAllLogs.length > 0 ? (
                filteredAllLogs.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 flex items-center justify-between hover:bg-muted/30 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <strong className="font-semibold text-foreground block">
                        {item.name}
                      </strong>
                      <span className="text-[11px] text-muted-foreground">
                        {item.code} • {item.track}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs text-muted-foreground font-medium">
                        {item.time}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.scanType === "IN"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {item.scanType === "IN" ? "CLOCK IN" : "CLOCK OUT"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <span>No attendance logs recorded for today yet.</span>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="m-0 p-3 sm:p-4 border-t bg-muted/20 shrink-0 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Total {filteredAllLogs.length} entries today
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsViewAllModalOpen(false)}
              className="text-xs h-8"
            >
              Close Ledger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
