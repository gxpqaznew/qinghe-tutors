import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og-student-skills.png`;

  return {
    title: "大学生技能交换所｜技能、经验与真实需求",
    description: "坚持个人对个人、严禁中介的大学生技能交易与学习经验分享平台。",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "大学生技能交换所",
      description: "个人对个人，严禁中介。把你会的，换成彼此的下一步。",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: "大学生技能交换所",
      description: "个人对个人，严禁中介。把你会的，换成彼此的下一步。",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
