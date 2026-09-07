import { api } from "@/lib/client";

export interface QueuedBiometricScan {
  id: string; // client generated UUID
  deviceSerial: string;
  biometricToken: string;
  scanType: "IN" | "OUT";
  timestamp: string; // ISO string when the scan actually occurred
  metadata?: {
    skillAreaId?: string;
    centreId?: string;
    simulatedBy?: string;
    qualityScore?: number;
    traineeName?: string;
    traineeCode?: string;
    skillName?: string;
  };
  queuedAt: number; // unix ms
  retryCount: number;
}

const STORAGE_KEY = "aef_pos_offline_biometric_queue";

export class OfflineSyncService {
  /**
   * Get all currently queued scans from localStorage
   */
  public static getQueue(): QueuedBiometricScan[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("[OfflineSync] Failed to read queue from localStorage", err);
      return [];
    }
  }

  /**
   * Save queue to localStorage
   */
  private static saveQueue(queue: QueuedBiometricScan[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
      // Dispatch custom event so UI components immediately update
      window.dispatchEvent(new CustomEvent("aef_offline_queue_changed", { detail: queue }));
    } catch (err) {
      console.error("[OfflineSync] Failed to save queue to localStorage", err);
    }
  }

  /**
   * Enqueue a new offline biometric scan
   */
  public static enqueueScan(scan: Omit<QueuedBiometricScan, "id" | "queuedAt" | "retryCount">): QueuedBiometricScan {
    const fullScan: QueuedBiometricScan = {
      ...scan,
      id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      queuedAt: Date.now(),
      retryCount: 0,
    };

    const queue = this.getQueue();
    queue.push(fullScan);
    this.saveQueue(queue);
    return fullScan;
  }

  /**
   * Remove a successfully synced scan from queue
   */
  public static removeScan(id: string): void {
    const queue = this.getQueue();
    const updated = queue.filter((item) => item.id !== id);
    this.saveQueue(updated);
  }

  /**
   * Sync a single item to the backend
   */
  public static async syncSingleScan(scan: QueuedBiometricScan): Promise<boolean> {
    try {
      await api.post("/biometrics/scan", {
        deviceSerial: scan.deviceSerial,
        biometricToken: scan.biometricToken,
        scanType: scan.scanType,
        timestamp: scan.timestamp, // Preserves the exact offline punch time
        metadata: {
          ...scan.metadata,
          isOfflineBuffered: true,
          offlineQueuedAt: scan.queuedAt,
          syncedAt: new Date().toISOString(),
        },
      });

      this.removeScan(scan.id);
      return true;
    } catch (err) {
      console.error(`[OfflineSync] Failed to sync scan ${scan.id}:`, err);
      // Increment retry count
      const queue = this.getQueue();
      const item = queue.find((i) => i.id === scan.id);
      if (item) {
        item.retryCount += 1;
        this.saveQueue(queue);
      }
      return false;
    }
  }

  /**
   * Process all queued offline scans sequentially
   */
  public static async processQueue(): Promise<{ synced: number; failed: number; remaining: number }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { synced: 0, failed: 0, remaining: 0 };

    let synced = 0;
    let failed = 0;

    for (const scan of queue) {
      const success = await this.syncSingleScan(scan);
      if (success) {
        synced += 1;
      } else {
        failed += 1;
      }
    }

    const remaining = this.getQueue().length;
    return { synced, failed, remaining };
  }

  /**
   * Clear all queued records manually
   */
  public static clearQueue(): void {
    this.saveQueue([]);
  }
}
