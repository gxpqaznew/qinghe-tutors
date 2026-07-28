import type { Metadata } from "next";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "大学生技能交换所｜同校优先，个人对个人",
    description: "面向中国大陆及海外高校，优先寻找同校技能分享者，坚持个人对个人、严禁中介的大学生技能与学习经验交流平台。",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "大学生技能交换所",
      description: "先找同校，再把范围放大。个人对个人，严禁中介。",
    },
    twitter: {
      card: "summary",
      title: "大学生技能交换所",
      description: "先找同校，再把范围放大。个人对个人，严禁中介。",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
