import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;

  return {
    title: "我是老师我是家长｜老师与家长直接连接",
    description: "老师免费入驻，家长免费发布需求；一对一和小班课都能找到合适的人。",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "我是老师我是家长",
      description: "老师与家长，直接连接。",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: "我是老师我是家长",
      description: "老师与家长，直接连接。",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
