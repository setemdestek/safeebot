import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qeydiyyat — SafeeBot",
  description:
    "SafeeBot-a qeydiyyatdan keçin. Pulsuz hesab yaradın və əmək təhlükəsizliyi sahəsində AI chatbot-dan istifadə edin.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
