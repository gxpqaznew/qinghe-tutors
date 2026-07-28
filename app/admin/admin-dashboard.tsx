"use client";

import { FormEvent, useEffect, useState } from "react";

type CreatorSubmission = {
  id: number;
  name: string;
  city: string;
  university: string;
  majorGrade: string;
  skill: string;
  mode: string;
  serviceIntro: string;
  workUrl: string;
  contact: string;
  createdAt: string;
  media: Array<{ id: number; fileName: string; mediaType: "image" | "video"; size: number }>;
  links: Array<{ label: string; url: string }>;
};

type RequestSubmission = {
  id: number;
  title: string;
  university: string;
  category: string;
  mode: string;
  budget: string;
  deadline: string;
  description: string;
  contact: string;
  createdAt: string;
};

type ExperienceSubmission = {
  id: number;
  authorName: string;
  university: string;
  title: string;
  category: string;
  sourceUrl: string;
  summary: string;
  content: string;
  createdAt: string;
};

type Submissions = {
  creators: CreatorSubmission[];
  requests: RequestSubmission[];
  experiences: ExperienceSubmission[];
};

const emptySubmissions: Submissions = { creators: [], requests: [], experiences: [] };

export function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submissions>(emptySubmissions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadSubmissions(key = adminKey) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/submissions", { headers: { "x-admin-key": key } });
      const result = await response.json() as Submissions & { error?: string };
      if (!response.ok) throw new Error(result.error || "加载失败");
      setSubmissions(result);
      setAuthenticated(true);
    } catch (loadError) {
      setAuthenticated(false);
      setError(loadError instanceof Error ? loadError.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadSubmissions(adminKey);
  }

  async function moderate(kind: "creator" | "request" | "experience", id: number, status: "published" | "rejected") {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ kind, id, status }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "操作失败");
      await loadSubmissions();
    } catch (moderationError) {
      setError(moderationError instanceof Error ? moderationError.message : "操作失败");
      setLoading(false);
    }
  }

  if (!authenticated) {
    return (
      <main className="admin-login">
        <form onSubmit={login}>
          <a href="/" className="admin-brand">大学生技能交换所</a>
          <span>仅限站长</span>
          <h1>内容审核后台</h1>
          <p>管理密码不会保存在网页或浏览器中。关闭页面后需要重新输入。</p>
          <label>管理密码<input type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} required autoFocus /></label>
          <button className="primary-button" disabled={loading}>{loading ? "正在验证…" : "进入后台"}</button>
          {error && <small className="form-error">{error}</small>}
        </form>
      </main>
    );
  }

  const total = submissions.creators.length + submissions.requests.length + submissions.experiences.length;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><a href="/">大学生技能交换所</a><span>内容审核</span></div>
        <div><b>{total}</b> 条待处理 <button onClick={() => void loadSubmissions()} disabled={loading}>刷新</button></div>
      </header>

      {error && <div className="admin-error">{error}</div>}
      {!total && <section className="admin-empty"><b>✓</b><h1>暂时没有待审核内容</h1><p>新的入驻、需求和经验投稿会出现在这里。</p></section>}

      <AdminSection title="技能分享者入驻" count={submissions.creators.length}>
        {submissions.creators.map((item) => (
          <AdminCard key={item.id} title={`${item.name} · ${item.skill}`} meta={`${item.university} · ${item.majorGrade} · ${item.city}`} contact={item.contact} createdAt={item.createdAt} onApprove={() => moderate("creator", item.id, "published")} onReject={() => moderate("creator", item.id, "rejected")} disabled={loading}>
            <p>{item.serviceIntro}</p>
            <small>{item.mode}{item.workUrl ? ` · 作品：${item.workUrl}` : ""}</small>
            {!!item.media.length && (
              <div className="admin-media-grid">
                {item.media.map((media) => <AdminMediaPreview key={media.id} media={media} adminKey={adminKey} />)}
              </div>
            )}
            {!!item.links.length && (
              <div className="admin-link-list">
                {item.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} →</a>)}
              </div>
            )}
          </AdminCard>
        ))}
      </AdminSection>

      <AdminSection title="技能需求" count={submissions.requests.length}>
        {submissions.requests.map((item) => (
          <AdminCard key={item.id} title={item.title} meta={`${item.university} · ${item.category} · ${item.mode}`} contact={item.contact} createdAt={item.createdAt} onApprove={() => moderate("request", item.id, "published")} onReject={() => moderate("request", item.id, "rejected")} disabled={loading}>
            <p>{item.description}</p><small>预算：{item.budget} · 时间：{item.deadline}</small>
          </AdminCard>
        ))}
      </AdminSection>

      <AdminSection title="学习心得投稿" count={submissions.experiences.length}>
        {submissions.experiences.map((item) => (
          <AdminCard key={item.id} title={item.title} meta={`${item.authorName} · ${item.university} · ${item.category}`} createdAt={item.createdAt} onApprove={() => moderate("experience", item.id, "published")} onReject={() => moderate("experience", item.id, "rejected")} disabled={loading}>
            <p>{item.summary}</p><details><summary>查看正文</summary><p>{item.content}</p></details>
          </AdminCard>
        ))}
      </AdminSection>
    </main>
  );
}

function AdminMediaPreview({
  media,
  adminKey,
}: {
  media: { id: number; fileName: string; mediaType: "image" | "video"; size: number };
  adminKey: string;
}) {
  const [source, setSource] = useState("");

  useEffect(() => {
    let objectUrl = "";
    fetch(`/api/admin/media?id=${media.id}`, { headers: { "x-admin-key": adminKey } })
      .then((response) => {
        if (!response.ok) throw new Error("预览加载失败");
        return response.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setSource(objectUrl);
      })
      .catch(() => setSource(""));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [adminKey, media.id]);

  return (
    <figure>
      {source
        ? media.mediaType === "video"
          ? <video src={source} controls preload="metadata" />
          : <img src={source} alt={media.fileName} />
        : <div className="media-loading">正在加载预览…</div>}
      <figcaption>{media.fileName} · {(media.size / 1024 / 1024).toFixed(1)}MB</figcaption>
    </figure>
  );
}

function AdminSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (!count) return null;
  return <section className="admin-section"><h2>{title}<span>{count}</span></h2><div className="admin-grid">{children}</div></section>;
}

function AdminCard({
  title,
  meta,
  contact,
  createdAt,
  onApprove,
  onReject,
  disabled,
  children,
}: {
  title: string;
  meta: string;
  contact?: string;
  createdAt: string;
  onApprove: () => void;
  onReject: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <article className="admin-card">
      <div className="admin-card-meta"><span>{meta}</span><time>{createdAt}</time></div>
      <h3>{title}</h3>
      {children}
      {contact && <div className="admin-contact">联系方式：<b>{contact}</b></div>}
      <div className="admin-actions">
        <button className="approve" onClick={onApprove} disabled={disabled}>通过并公开</button>
        <button className="reject" onClick={onReject} disabled={disabled}>拒绝</button>
      </div>
    </article>
  );
}
