import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İstifadə Şərtləri — SafeeBot",
  description:
    "SafeeBot platformasının istifadə şərtləri və qaydaları. Xidmətlərimizdən istifadə qaydaları ilə tanış olun.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
