import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "@/lib/api/attendance.api";
import { AttendanceRecord } from "@/interfaces";
import { toast } from "@/components/ui/toast";

export function useCorrectAttendanceMutation(options?: {
  onSuccess?: (data?: AttendanceRecord) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      reason,
      supportingEvidenceUrl,
    }: {
      id: string;
      status: string;
      reason: string;
      supportingEvidenceUrl?: string;
    }) => {
      const res = await attendanceApi.correct(id, {
        newStatus: status,
        reason,
        supportingEvidenceUrl,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      options?.onSuccess?.(data);
      toast.add({
        title: "Attendance Corrected",
        description: "Attendance record updated and logged to audit trail.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to correct attendance",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to update attendance record.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}
