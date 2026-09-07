import { Metadata } from "next";
import { BiometricKioskTerminalView } from "@/components/admin/training/attendance";

export const metadata: Metadata = {
  title: "Biometric Attendance Terminal | Adele Foundation",
  description: "Dedicated touchscreen biometric attendance terminal for trainee sign-in and sign-out.",
};

export default function TerminalPage() {
  return <BiometricKioskTerminalView />;
}
