"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Role = "parent" | "teacher";

type Teacher = {
  id: number;
  name: string;
  initials: string;
  title: string;
  education: string;
  experience: string;
  subjects: string[];
  modes: string[];
  intro: string;
  color: string;
  demoUrl: string;
};

const teachers: Teacher[] = [
  {
    id: 1,
    name: "陈安然",
    initials: "陈",
    title: "小学全科 · 英语启蒙",
    education: "华东师范大学 · 教育学硕士",
    experience: "6年教学经验",
    subjects: ["小学全科", "英语"],
    modes: ["一对一", "4人小班"],
    intro: "擅长培养学习习惯，用孩子听得懂的方式讲清知识。",
    color: "coral",
    demoUrl: "https://example.com",
  },
  {
    id: 2,
    name: "周宇",
    initials: "周",
    title: "初高中数学 · 竞赛思维",
    education: "浙江大学 · 理学学士",
    experience: "8年教学经验",
    subjects: ["初中数学", "高中数学"],
    modes: ["一对一", "6人小班"],
    intro: "重视思维过程和错题复盘，帮助学生建立完整的知识体系。",
    color: "blue",
    demoUrl: "https://example.com",
  },
  {
    id: 3,
    name: "林知夏",
    initials: "林",
    title: "语文阅读 · 写作提升",
    education: "北京师范大学 · 汉语言文学硕士",
    experience: "5年教学经验",
    subjects: ["初中语文", "写作"],
    modes: ["一对一", "8人小班"],
    intro: "从阅读兴趣出发，让表达有内容、有结构，也有自己的声音。",
    color: "green",
    demoUrl: "https://example.com",
  },
  {
    id: 4,
    name: "许嘉言",
    initials: "许",
    title: "高中物理 · 中考科学",
    education: "南京大学 · 物理学硕士",
    experience: "7年教学经验",
    subjects: ["高中物理", "初中科学"],
    modes: ["一对一"],
    intro: "把抽象物理变成生活中的直观模型，注重方法迁移。",
    color: "gold",
    demoUrl: "https://example.com",
  },
];

type PlazaNeed = {
  id: number | string;
  title: string;
  area: string;
  time: string;
  budget: string;
  note: string;
  createdAt?: string;
};

const sampleNeeds: PlazaNeed[] = [
  { id: "sample-1", title: "初二 · 数学", area: "成都 · 郫都", time: "周末下午", budget: "150–200元/小时", note: "基础尚可，希望加强几何和函数。" },
  { id: "sample-2", title: "五年级 · 英语", area: "成都 · 高新", time: "周三、周五晚", budget: "120–180元/小时", note: "希望提升阅读兴趣和口语表达。" },
  { id: "sample-3", title: "高一 · 物理", area: "线上授课", time: "每周2次", budget: "200元/小时", note: "力学部分薄弱，希望系统梳理。" },
  { id: "sample-4", title: "四年级 · 全科作业辅导", area: "成都 · 武侯", time: "工作日18:30后", budget: "100–150元/小时", note: "重视学习习惯，女性老师优先。" },
];

const classes = [
  { teacher: "周宇老师", title: "初二数学思维提升班", meta: "线上 · 6人班 · 每周六 14:00", price: "¥68/节" },
  { teacher: "陈安然老师", title: "四年级英语阅读小班", meta: "成都线下 · 4人班 · 每周日 10:00", price: "¥80/节" },
  { teacher: "林知夏老师", title: "中考语文写作训练营", meta: "线上 · 8人班 · 每周三 19:30", price: "¥59/节" },
];

async function postForm(url: string, form: HTMLFormElement) {
  const payload = Object.fromEntries(new FormData(form).entries());
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(result.error || "提交失败，请稍后再试");
}

export function Marketplace() {
  const [role, setRole] = useState<Role | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [teacherReady, setTeacherReady] = useState(false);
  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [submitted, setSubmitted] = useState<"free" | "fast" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("ws-role");
    if (savedRole === "parent" || savedRole === "teacher") setRole(savedRole);
    setTeacherReady(localStorage.getItem("ws-teacher-ready") === "true");
    setHydrated(true);
  }, []);

  const filteredTeachers = useMemo(() => {
    const key = query.trim();
    if (!key) return teachers;
    return teachers.filter((teacher) =>
      `${teacher.name}${teacher.title}${teacher.education}${teacher.subjects.join("")}`.includes(key),
    );
  }, [query]);

  function chooseRole(nextRole: Role) {
    localStorage.setItem("ws-role", nextRole);
    setRole(nextRole);
  }

  function switchRole() {
    localStorage.removeItem("ws-role");
    setRole(null);
    setActiveTeacher(null);
    setPublishOpen(false);
  }

  async function submitTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await postForm("/api/teacher-applications", event.currentTarget);
      localStorage.setItem("ws-teacher-ready", "true");
      setTeacherReady(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitNeed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    const isFast = new FormData(event.currentTarget).get("fastMatch") === "on";
    try {
      await postForm("/api/parent-needs", event.currentTarget);
      setSubmitted(isFast ? "fast" : "free");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="loading-screen">正在打开网站…</div>;
  if (!role) return <RoleGate onChoose={chooseRole} />;
  if (role === "teacher" && !teacherReady) {
    return (
      <TeacherOnboarding
        onSubmit={submitTeacher}
        submitting={submitting}
        error={formError}
        onSwitch={switchRole}
        onExisting={() => {
          localStorage.setItem("ws-teacher-ready", "true");
          setTeacherReady(true);
        }}
      />
    );
  }

  if (role === "teacher") {
    return <TeacherPlaza onSwitch={switchRole} />;
  }

  return (
    <>
      <header className="site-nav">
        <Brand />
        <nav>
          <a href="#teachers">找老师</a>
          <a href="#classes">找小班</a>
          <a href="#about">平台说明</a>
        </nav>
        <div className="nav-actions">
          <button className="text-button" onClick={switchRole}>切换身份</button>
          <button className="primary-button compact" onClick={() => setPublishOpen(true)}>免费发布需求</button>
        </div>
      </header>

      <main>
        <section className="parent-hero">
          <div>
            <span className="eyebrow">我是家长</span>
            <h1>先了解老师，<br />再决定要不要联系。</h1>
            <p>老师入驻免费，家长发布需求也免费。你可以自己慢慢找，也可以选择 ¥18 极速筛选服务。</p>
            <div className="hero-actions">
              <a className="primary-button" href="#teachers">浏览老师</a>
              <button className="secondary-button" onClick={() => setPublishOpen(true)}>免费发布需求</button>
            </div>
            <div className="trust-row">
              <span>老师资料清晰展示</span>
              <span>支持一对一与小班</span>
              <span>发布需求不收费</span>
            </div>
          </div>
          <aside className="hero-note">
            <span>需要快一点？</span>
            <strong>¥18 极速筛选</strong>
            <p>告诉我们孩子的情况，由平台帮你优先整理更合适的老师。</p>
            <small>自愿选择，不影响免费发布</small>
          </aside>
        </section>

        <section className="content-section" id="teachers">
          <div className="section-heading">
            <div>
              <span className="eyebrow">老师名片</span>
              <h2>看看谁更适合孩子</h2>
            </div>
            <input
              className="teacher-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索科目、学历或老师姓名"
            />
          </div>
          <div className="teacher-grid">
            {filteredTeachers.map((teacher) => (
              <article className="teacher-card" key={teacher.id} onClick={() => setActiveTeacher(teacher)}>
                <div className={`avatar ${teacher.color}`}>{teacher.initials}</div>
                <div className="teacher-card-body">
                  <div className="teacher-title">
                    <h3>{teacher.name}</h3>
                    <span>{teacher.experience}</span>
                  </div>
                  <strong>{teacher.title}</strong>
                  <p className="education">{teacher.education}</p>
                  <p>{teacher.intro}</p>
                  <div className="tag-row">{teacher.modes.map((mode) => <i key={mode}>{mode}</i>)}</div>
                </div>
                <button>查看老师主页 →</button>
              </article>
            ))}
          </div>
        </section>

        <section className="class-section content-section" id="classes">
          <div className="section-heading">
            <div>
              <span className="eyebrow">精品小班</span>
              <h2>一对多，也可以学得认真</h2>
            </div>
            <p>让预算更轻松，也保留充分互动。</p>
          </div>
          <div className="class-grid">
            {classes.map((course) => (
              <article key={course.title}>
                <span>招生中</span>
                <h3>{course.title}</h3>
                <p>{course.teacher}</p>
                <small>{course.meta}</small>
                <strong>{course.price}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <span className="eyebrow">我们的原则</span>
          <h2>老师是平台最重要的内容，家长拥有选择权。</h2>
          <div>
            <article><b>01</b><h3>老师免费入驻</h3><p>完整展示学历、经历、试讲资料与授课方式。</p></article>
            <article><b>02</b><h3>家长免费发布</h3><p>发布后进入求贤广场，让合适的老师看见。</p></article>
            <article><b>03</b><h3>筛选按需付费</h3><p>只有需要平台快速协助时，才选择 ¥18 服务。</p></article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <Brand />
        <p>平台提供信息展示与连接服务。沟通前，请双方核验身份、资质与授课安排。</p>
        <span>© 2026 我是老师我是家长</span>
      </footer>

      {activeTeacher && (
        <div className="overlay" onMouseDown={() => setActiveTeacher(null)}>
          <section className="teacher-profile" onMouseDown={(event) => event.stopPropagation()}>
            <button className="close-button" onClick={() => setActiveTeacher(null)} aria-label="关闭">×</button>
            <div className="profile-top">
              <div className={`avatar large ${activeTeacher.color}`}>{activeTeacher.initials}</div>
              <div>
                <span className="eyebrow">老师个人主页</span>
                <h2>{activeTeacher.name}</h2>
                <strong>{activeTeacher.title}</strong>
              </div>
            </div>
            <div className="profile-content">
              <div>
                <h3>学历</h3>
                <p>{activeTeacher.education}</p>
                <h3>教学经历</h3>
                <p>{activeTeacher.experience}。{activeTeacher.intro}</p>
                <h3>授课方式</h3>
                <p>{activeTeacher.modes.join("、")}</p>
              </div>
              <aside>
                <a href={activeTeacher.demoUrl} target="_blank" rel="noreferrer">查看试讲 / 教学展示 →</a>
                <button className="primary-button" onClick={() => alert("正式上线前会补充登录、隐私保护和联系确认流程。")}>申请联系老师</button>
                <small>联系方式不会直接公开展示</small>
              </aside>
            </div>
          </section>
        </div>
      )}

      {publishOpen && (
        <div className="overlay">
          <section className="publish-modal">
            <button
              className="close-button"
              onClick={() => {
                setPublishOpen(false);
                setSubmitted(null);
                setFormError("");
              }}
              aria-label="关闭"
            >×</button>
            {submitted ? (
              <div className="success-state">
                <span>✓</span>
                <h2>{submitted === "fast" ? "需求已保存" : "免费需求已提交"}</h2>
                <p>
                  {submitted === "fast"
                    ? "极速筛选服务暂未开通真实支付。资料已保存，接入支付后才会向你收取 ¥18。"
                    : "审核后会免费发布到求贤广场，不收取发布费。"}
                </p>
                <button className="primary-button" onClick={() => { setPublishOpen(false); setSubmitted(null); }}>知道了</button>
              </div>
            ) : (
              <>
                <span className="eyebrow">家长发布需求</span>
                <h2>说说孩子需要怎样的帮助</h2>
                <p className="modal-note">默认免费发布，联系方式不会公开展示。</p>
                <form onSubmit={submitNeed}>
                  <label>年级与科目<input name="gradeSubject" required placeholder="例如：初二数学" /></label>
                  <label>地区 / 授课方式<input name="area" required placeholder="例如：成都郫都 / 可线上" /></label>
                  <label>期望时间<input name="schedule" required placeholder="例如：周末下午" /></label>
                  <label>预算<input name="budget" required placeholder="例如：150–200元/小时" /></label>
                  <label className="full-field">具体需求<textarea name="description" required placeholder="孩子目前的情况、希望提升的方向…" /></label>
                  <label className="full-field">联系方式<input name="contact" required placeholder="手机号或微信号" /></label>
                  <label className="fast-option full-field">
                    <input type="checkbox" name="fastMatch" />
                    <span><b>需要平台帮我极速筛选</b><small>可选服务 ¥18；目前为测试入口，暂不扣款</small></span>
                  </label>
                  <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />
                  <button className="primary-button full-field" disabled={submitting}>
                    {submitting ? "正在提交…" : "提交需求"}
                  </button>
                  {formError && <small className="form-error full-field">{formError}</small>}
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function RoleGate({ onChoose }: { onChoose: (role: Role) => void }) {
  return (
    <main className="role-gate">
      <div className="role-shell">
        <Brand />
        <div className="role-intro">
          <span className="eyebrow">欢迎来到</span>
          <h1>我是老师，我是家长。<br />从身份开始，找到彼此。</h1>
          <p>老师免费展示自己，家长免费发布需求。请先告诉我们，你今天以什么身份进入？</p>
        </div>
        <div className="role-choices">
          <button className="role-choice parent-choice" onClick={() => onChoose("parent")}>
            <span>家</span>
            <small>我要找老师</small>
            <strong>我是家长</strong>
            <p>浏览老师、查看小班，或免费发布孩子的学习需求。</p>
            <b>进入家长页面 →</b>
          </button>
          <button className="role-choice teacher-choice" onClick={() => onChoose("teacher")}>
            <span>师</span>
            <small>我要找学生</small>
            <strong>我是老师</strong>
            <p>免费建立老师主页，查看家长发布的真实需求。</p>
            <b>进入老师页面 →</b>
          </button>
        </div>
        <p className="role-footnote">身份会保存在当前设备，之后可以随时切换。</p>
      </div>
    </main>
  );
}

function TeacherOnboarding({
  onSubmit,
  submitting,
  error,
  onSwitch,
  onExisting,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  error: string;
  onSwitch: () => void;
  onExisting: () => void;
}) {
  return (
    <main className="teacher-onboarding">
      <header className="portal-header">
        <Brand />
        <button className="text-button" onClick={onSwitch}>切换身份</button>
      </header>
      <section className="onboarding-layout">
        <aside>
          <span className="eyebrow">老师首次入驻</span>
          <h1>先让家长认识你。</h1>
          <p>资料填写完成后，就可以进入“求贤广场”查看家长需求。入驻和展示均不向老师收费。</p>
          <ol>
            <li><b>1</b>填写真实基础资料</li>
            <li><b>2</b>平台审核后生成主页</li>
            <li><b>3</b>进入求贤广场找学生</li>
          </ol>
        </aside>
        <div className="onboarding-card">
          <h2>建立老师资料</h2>
          <p>“试讲 / 教学展示链接”可以是你已有的录课、公开课或个人网站。</p>
          <form onSubmit={onSubmit}>
            <label>姓名<input name="name" required placeholder="请输入真实姓名" /></label>
            <label>性别
              <select name="gender" required defaultValue="">
                <option value="" disabled>请选择</option>
                <option>女</option>
                <option>男</option>
                <option>不便公开</option>
              </select>
            </label>
            <label className="full-field">学历<input name="education" required placeholder="例如：四川大学，本科，汉语言文学" /></label>
            <label className="full-field">教学经历<textarea name="teachingExperience" required placeholder="教过哪些年级和科目、教学年限、擅长方向…" /></label>
            <label className="full-field">试讲 / 教学展示链接（选填）<input name="demoUrl" type="url" placeholder="https://" /></label>
            <label className="full-field">联系方式<input name="contact" required placeholder="手机号或微信号（不会直接公开）" /></label>
            <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />
            <button className="primary-button full-field" disabled={submitting}>
              {submitting ? "正在提交…" : "提交资料并进入求贤广场"}
            </button>
            {error && <small className="form-error full-field">{error}</small>}
          </form>
          <button className="existing-button" onClick={onExisting}>我已经提交过资料，直接进入求贤广场</button>
        </div>
      </section>
    </main>
  );
}

function TeacherPlaza({ onSwitch }: { onSwitch: () => void }) {
  const [needs, setNeeds] = useState<PlazaNeed[]>(sampleNeeds);

  useEffect(() => {
    fetch("/api/parent-needs")
      .then((response) => response.json())
      .then((result: { needs?: Array<{ id: number; gradeSubject: string; area: string; schedule: string; budget: string; description: string; createdAt: string }> }) => {
        if (!result.needs?.length) return;
        setNeeds(result.needs.map((need) => ({
          id: need.id,
          title: need.gradeSubject,
          area: need.area,
          time: need.schedule,
          budget: need.budget,
          note: need.description,
          createdAt: need.createdAt,
        })));
      })
      .catch(() => {
        // 网络异常时保留示例内容，避免页面空白。
      });
  }, []);

  return (
    <>
      <header className="portal-header sticky">
        <Brand />
        <nav><a href="#plaza">求贤广场</a><a href="#rules">联系规则</a></nav>
        <button className="text-button" onClick={onSwitch}>切换身份</button>
      </header>
      <main className="plaza-page" id="plaza">
        <section className="plaza-hero">
          <span className="eyebrow">老师端 · 求贤广场</span>
          <h1>这些家庭，正在等一位合适的老师。</h1>
          <p>看看孩子的年级、科目、时间和预算，再决定是否申请联系。</p>
          <div><span>今日新增 4 条</span><span>成都及线上需求</span><span>老师免费使用</span></div>
        </section>
        <section className="plaza-content">
          <div className="plaza-filter">
            <strong>最新家长需求</strong>
            <div><button className="active">全部</button><button>小学</button><button>初中</button><button>高中</button><button>线上</button></div>
          </div>
          <div className="task-grid">
            {needs.map((need, index) => (
              <article className="task-card" key={need.id}>
                <div><span>{index < 2 ? "新发布" : "招募中"}</span><small>{index * 18 + 6}分钟前</small></div>
                <h2>{need.title}</h2>
                <dl>
                  <div><dt>地区</dt><dd>{need.area}</dd></div>
                  <div><dt>时间</dt><dd>{need.time}</dd></div>
                  <div><dt>预算</dt><dd>{need.budget}</dd></div>
                </dl>
                <p>{need.note}</p>
                <button onClick={() => alert("正式上线前会加入老师审核、登录和双方同意后的联系方式交换。")}>申请联系家长 →</button>
              </article>
            ))}
          </div>
          <aside className="contact-rules" id="rules">
            <strong>联系规则</strong>
            <p>家长联系方式不会直接公开。老师提交联系申请后，经平台审核并获得家长同意，再开放双方沟通。</p>
          </aside>
        </section>
      </main>
    </>
  );
}

function Brand() {
  return (
    <a className="brand" href="#">
      <span className="brand-mark">我</span>
      <span>我是老师我是家长<small>老师与家长，直接连接</small></span>
    </a>
  );
}
