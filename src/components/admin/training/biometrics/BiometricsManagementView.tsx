"use client";

import React, { useState, useMemo } from "react";
import { Fingerprint, Cpu, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiometricsDeviceCard } from "./BiometricsDeviceCard";
import { RawScansTable } from "./RawScansTable";
import { ScanDetailsSheet } from "./ScanDetailsSheet";
import { BiometricsFilters } from "./BiometricsFilters";
import { useDebounce } from "@/hooks";
import {
  useBiometricDevicesQuery,
  useBiometricEventsQuery,
} from "@/hooks/queries/useBiometricQueries";
import { useCentresQuery } from "@/hooks/queries/useCentreQueries";
import { BiometricDevice, BiometricEvent } from "@/interfaces";

export const BiometricsManagementView: React.FC = () => {
  const [selectedCentre, setSelectedCentre] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedEvent, setSelectedEvent] = useState<BiometricEvent | null>(
    null,
  );
  const [isScanSheetOpen, setIsScanSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"devices" | "logs">("devices");
  const ITEMS_PER_PAGE = 10;

  const {
    data: devices = [],
    isLoading: isDevicesLoading,
    refetch: refetchDevices,
    isFetching: isFetchingDevices,
  } = useBiometricDevicesQuery(
    selectedCentre !== "all" ? selectedCentre : undefined,
  );

  const {
    data: eventsData,
    isLoading: isEventsLoading,
    refetch: refetchEvents,
    isFetching: isFetchingEvents,
  } = useBiometricEventsQuery({
    centreId: selectedCentre !== "all" ? selectedCentre : undefined,
    search: debouncedSearch.trim() || undefined,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const rawEvents = eventsData?.docs || [];
  const pagination = eventsData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const { data: centres = [] } = useCentresQuery();

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const name = device.deviceName || "";
      const serial = device.deviceSerial || "";
      const loc = device.locationDescription || "";

      const matchesSearch =
        searchQuery === "" ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || device.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [devices, searchQuery, statusFilter]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCentreChange = (centre: string) => {
    setSelectedCentre(centre);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCentre("all");
    setStatusFilter("all");
    setPage(1);
  };

  const handleViewDetails = (evt: BiometricEvent) => {
    setSelectedEvent(evt);
    setIsScanSheetOpen(true);
  };

  const isRefreshing = isFetchingDevices || isFetchingEvents;

  const handleRefresh = () => {
    refetchDevices();
    refetchEvents();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Biometrics & Hardware
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor turnstile terminals, verify network telemetry, and inspect
            live scan event stream.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-border text-foreground hover:bg-muted"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Sync Hardware
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <BiometricsFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCentre={selectedCentre}
        onCentreChange={handleCentreChange}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        centres={centres}
        onReset={handleResetFilters}
      />

      {/* Tabs View */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "devices" | "logs")}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="devices" className="text-xs font-medium">
              <Cpu className="h-3.5 w-3.5 mr-1.5" />
              Hardware Terminals ({devices.length})
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs font-medium">
              <Fingerprint className="h-3.5 w-3.5 mr-1.5" />
              Raw Biometric Scans ({pagination.total})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-4">
          {isDevicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-44 rounded-xl border border-border bg-card animate-pulse"
                />
              ))}
            </div>
          ) : filteredDevices.length === 0 ? (
            <Card className="border-border bg-card p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground font-heading">
                No biometric devices found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No hardware units match the current filter selection or none are
                configured.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices.map((device) => (
                <BiometricsDeviceCard
                  key={device._id || (device as any).id}
                  device={device}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <RawScansTable
            events={rawEvents}
            isLoading={isEventsLoading}
            onViewDetails={handleViewDetails}
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={setPage}
          />
        </TabsContent>
      </Tabs>

      {/* Scan Detail Sheet */}
      <ScanDetailsSheet
        event={selectedEvent}
        isOpen={isScanSheetOpen}
        onOpenChange={setIsScanSheetOpen}
      />
    </div>
  );
};
