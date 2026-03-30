import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Məxfilik Siyasəti — SafeeBot",
  description:
    "SafeeBot məxfilik siyasəti. Şəxsi məlumatlarınızın necə toplandığı, istifadə edildiyi və qorunduğu haqqında məlumat.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
