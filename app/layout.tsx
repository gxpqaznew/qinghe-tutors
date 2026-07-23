import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "青禾家教｜找到真正合适的老师",
    description: "浏览真实、清晰的家教老师信息，或发布您的家庭教学需求。",
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "青禾家教", description: "好老师，不该藏在信息差里。", images: [image] },
    twitter: { card: "summary_large_image", title: "青禾家教", description: "好老师，不该藏在信息差里。", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
