"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { useBiometricDevicesQuery } from "@/hooks/queries";
import { useRegisterBiometricMutation } from "@/hooks/mutations";
import { Enrollment } from "@/interfaces";
import { Fingerprint, Cpu, Loader2 } from "lucide-react";

interface BiometricCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
}

export function BiometricCaptureModal({
  isOpen,
  onClose,
  enrollment,
}: BiometricCaptureModalProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const { data: devices } = useBiometricDevicesQuery(
    enrollment?.centreId?._id || enrollment?.centreId,
  );

  const registerBiometricMutation = useRegisterBiometricMutation({
    onSuccess: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (devices && devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0]._id);
    }
  }, [devices, selectedDeviceId]);

  if (!enrollment) return null;

  const handleConfirmBiometric = (e: React.FormEvent) => {
    e.preventDefault();
    registerBiometricMutation.mutate({
      id: enrollment._id,
      deviceId: selectedDeviceId || devices?.[0]?._id || undefined,
    });
  };

  const selectedDevice = devices?.find((d) => d._id === selectedDeviceId);
  const selectedDeviceLabel = selectedDevice
    ? `${selectedDevice.deviceName} (${selectedDevice.deviceSerial}) — ${selectedDevice.status}`
    : "Select hardware scanner device";

  return (
    <Dialog
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, details) => {
        if (!open && details?.reason !== "outside-press") {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md flex flex-col gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Capture Biometric Fingerprint Template
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Trainee:{" "}
                <span className="font-semibold text-foreground">
                  {enrollment.beneficiaryId?.firstName}{" "}
                  {enrollment.beneficiaryId?.lastName}
                </span>{" "}
                •{" "}
                <span className="font-mono text-muted-foreground">
                  {enrollment.enrollmentCode || "Pending Code"}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleConfirmBiometric}
          className="flex flex-col flex-1"
        >
          <FieldGroup className="p-6 space-y-4 text-xs">
            {/* Device Selector with Base-UI Select and proper label resolver */}
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-primary" /> Active Hardware
                Scanner <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={selectedDeviceId}
                onValueChange={(val) => setSelectedDeviceId(val || "")}
              >
                <SelectTrigger className="w-full text-xs h-9 min-h-9">
                  <SelectValue placeholder="Select active hardware scanner">
                    {selectedDeviceLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {devices && devices.length > 0 ? (
                    devices.map((dev) => (
                      <SelectItem key={dev._id} value={dev._id}>
                        {dev.deviceName} ({dev.deviceSerial}) — {dev.status}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="default-reader">
                      Optical Scanner Desk #1 (USB-HID) — Online
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </Field>

            {/* Scanner Animation Card */}
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-5 text-center space-y-2.5 dark:bg-primary/15 dark:border-primary/20">
              <div className="h-14 w-14 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto dark:bg-primary/25 dark:text-primary animate-pulse shadow-sm">
                <Fingerprint className="h-8 w-8" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">
                  Ready to Capture Biometric Template
                </p>
                <p className="text-muted-foreground text-[11px] mt-1 max-w-xs mx-auto leading-relaxed">
                  Place candidate's primary index finger flat on the optical
                  sensor. A secure 128-bit hardware token will be generated and
                  bound.
                </p>
              </div>
            </div>
          </FieldGroup>

          <DialogFooter className="p-4 border-t bg-muted/40 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={registerBiometricMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={registerBiometricMutation.isPending}
              className="text-xs font-semibold gap-1.5"
            >
              {registerBiometricMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Register & Confirm Active Enrollment</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
