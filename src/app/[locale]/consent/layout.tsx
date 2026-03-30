import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Razılıq — SafeeBot",
  description:
    "SafeeBot məlumat emalı üçün razılıq səhifəsi. Şəxsi məlumatlarınızın istifadəsinə razılıq verin.",
};

export default function ConsentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
