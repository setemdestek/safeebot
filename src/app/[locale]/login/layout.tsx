import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daxil ol — SafeeBot",
  description:
    "SafeeBot hesabınıza daxil olun. Əməyin mühafizəsi və texniki təhlükəsizlik sahəsində süni intellekt dəstəkli platformaya giriş.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
