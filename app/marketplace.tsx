"use client";

import { FormEvent, useMemo, useState } from "react";

type Teacher = {
  id: number; name: string; initials: string; role: string; school: string; degree: string;
  subjects: string[]; rate: number; city: string; experience: string; intro: string;
  work: string[]; website: string; color: string; verified?: boolean; modes: string[];
};

const teachers: Teacher[] = [
  { id: 1, name: "陈安然", initials: "陈", role: "小学全科 · 英语启蒙", school: "华东师范大学", degree: "教育学硕士", subjects: ["小学全科", "英语"], rate: 160, city: "上海", experience: "6年经验", intro: "擅长培养学习习惯，用孩子听得懂的方式讲清知识。", work: ["上海市实验学校 · 小学部教师（2022—至今）", "好未来 · 英语教研老师（2020—2022）"], website: "https://example.com/anran", color: "coral", verified: true, modes: ["一对一", "4人小班"] },
  { id: 2, name: "周屿", initials: "周", role: "初高中数学 · 竞赛", school: "浙江大学", degree: "理学学士", subjects: ["初中数学", "高中数学"], rate: 220, city: "杭州", experience: "8年经验", intro: "不靠题海，带学生建立完整的数学思维与错题体系。", work: ["杭州学军中学 · 数学教师（2021—至今）", "猿辅导 · 高中数学主讲（2018—2021）"], website: "https://example.com/zhouyu", color: "blue", verified: true, modes: ["一对一", "6人小班"] },
  { id: 3, name: "林知夏", initials: "林", role: "语文阅读 · 写作提升", school: "北京师范大学", degree: "汉语言文学硕士", subjects: ["初中语文", "写作"], rate: 180, city: "北京", experience: "5年经验", intro: "从阅读兴趣出发，让表达有内容、有结构，也有自己的声音。", work: ["北京师范大学附属中学 · 语文教师（2023—至今）", "新东方 · 阅读写作教师（2021—2023）"], website: "https://example.com/zhixia", color: "green", verified: true, modes: ["一对一", "8人小班"] },
  { id: 4, name: "许嘉言", initials: "许", role: "高中物理 · 中考科学", school: "南京大学", degree: "物理学硕士", subjects: ["高中物理", "初中科学"], rate: 200, city: "南京", experience: "7年经验", intro: "把抽象物理变成生活中的直观模型，注重方法迁移。", work: ["南京外国语学校 · 物理教师（2022—至今）", "精锐教育 · 理科组教师（2019—2022）"], website: "https://example.com/jiayan", color: "gold", modes: ["一对一"] },
];

const classes = [
  { teacher: "周屿老师", title: "初二数学思维提升班", meta: "线上 · 6人班 · 每周六 14:00", seats: "余2席", price: "¥68/节", tag: "9月开班" },
  { teacher: "陈安然老师", title: "四年级英语阅读小班", meta: "上海徐汇 · 4人班 · 每周日 10:00", seats: "余1席", price: "¥80/节", tag: "随到随学" },
  { teacher: "林知夏老师", title: "中考语文写作训练营", meta: "线上 · 8人班 · 每周三 19:30", seats: "余3席", price: "¥59/节", tag: "8月20日开班" },
];

const needs = [
  { grade: "初二", subject: "数学", area: "成都 · 郫都", time: "周末下午", budget: "150–200元/小时", age: "刚刚" },
  { grade: "五年级", subject: "英语", area: "成都 · 高新", time: "周三、周五晚", budget: "120–180元/小时", age: "32分钟前" },
  { grade: "高一", subject: "物理", area: "线上授课", time: "每周2次", budget: "200元/小时", age: "1小时前" },
];

async function postForm(url: string, form: HTMLFormElement) {
  const payload = Object.fromEntries(new FormData(form).entries());
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const result = await response.json() as { error?: string };
  if (!response.ok) throw new Error(result.error || "提交失败，请稍后再试");
}

export function Marketplace() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("全部科目");
  const [active, setActive] = useState<Teacher | null>(null);
  const [publish, setPublish] = useState(false);
  const [join, setJoin] = useState(false);
  const [parentSubmitted, setParentSubmitted] = useState(false);
  const [teacherSubmitted, setTeacherSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const filtered = useMemo(() => teachers.filter(t => (subject === "全部科目" || t.subjects.some(s => s.includes(subject))) && (`${t.name}${t.role}${t.school}${t.city}`).includes(query)), [query, subject]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>, type: "parent" | "teacher") {
    event.preventDefault(); setSubmitting(true); setFormError("");
    try {
      await postForm(type === "parent" ? "/api/parent-needs" : "/api/teacher-applications", event.currentTarget);
      if (type === "parent") setParentSubmitted(true); else setTeacherSubmitted(true);
    } catch (error) { setFormError(error instanceof Error ? error.message : "提交失败"); }
    finally { setSubmitting(false); }
  }

  return <>
    <header className="nav"><a className="brand" href="#top"><span className="brand-mark">青</span><span>青禾家教<small>认真找老师，安心学知识</small></span></a><nav><a href="#teachers">找老师</a><a href="#classes">找小班</a><a href="#needs">家长需求</a><a href="#how">如何使用</a></nav><div className="nav-actions"><button className="join-top" onClick={() => setJoin(true)}>老师免费入驻</button><button className="publish-top" onClick={() => setPublish(true)}>发布需求 <b>¥8</b></button></div></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow">一对一与精品小班自由选择</div><h1>好老师，不该<br/>藏在信息差里。</h1><p>清晰的学历与经历，真实的教学方向。<br/>先了解，再联系，找到适合孩子的那一位。</p><div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索科目、城市或老师姓名"/><a href="#teachers">找老师</a></div><div className="trust"><span>✓ 老师免费入驻</span><span>✓ 家长自主选择</span><span>✓ 一对一与小班课</span></div></div><div className="hero-card"><span className="tape"></span><div className="quote">“</div><p>教育不是把篮子装满，<br/>而是把灯点亮。</p><div className="scribble">每个孩子，都值得被认真看见。</div><div className="leaf">青禾</div></div></section>

      <section className="teachers section" id="teachers"><div className="section-head"><div><span className="kicker">精选老师</span><h2>先看看，这些认真教书的人</h2></div><div className="filters">{["全部科目", "数学", "英语", "语文", "物理"].map(s => <button className={subject === s ? "active" : ""} key={s} onClick={() => setSubject(s)}>{s}</button>)}</div></div><div className="teacher-grid">{filtered.map(t => <article className="teacher-card" key={t.id} onClick={() => setActive(t)}><div className={`avatar ${t.color}`}>{t.initials}<span>{t.verified ? "✓" : ""}</span></div><div className="teacher-main"><div className="name-row"><h3>{t.name}</h3><span>{t.experience}</span></div><strong>{t.role}</strong><p className="school">⌂ {t.school} · {t.degree}</p><p>{t.intro}</p><div className="tags">{t.modes.map(s => <i key={s}>{s}</i>)}</div></div><div className="card-foot"><span>{t.city}</span><b>¥{t.rate}<small>/小时起</small></b><button>查看主页 →</button></div></article>)}</div>{filtered.length === 0 && <div className="empty">暂时没有找到匹配的老师，换个关键词试试。</div>}<button className="more" onClick={() => setJoin(true)}>我是老师，免费入驻 <span>→</span></button></section>

      <section className="classes section" id="classes"><div className="section-head"><div><span className="kicker">精品小班</span><h2>费用更轻，也保留充分互动</h2></div><p>2–8人小班，让更多家庭找到适合的学习方式。</p></div><div className="class-grid">{classes.map(course => <article key={course.title}><div className="class-top"><span>{course.tag}</span><b>{course.seats}</b></div><h3>{course.title}</h3><p>{course.teacher}</p><small>{course.meta}</small><div><strong>{course.price}</strong><button onClick={() => alert("课程咨询和联系方式解锁将在下一阶段开放。")} >查看课程 →</button></div></article>)}</div></section>

      <section className="needs section" id="needs"><div className="needs-intro"><span className="kicker light">家长需求</span><h2>这些家庭，正在等一位<br/>合适的老师</h2><p>需求由家长自主发布。老师了解情况后，再决定是否联系。</p><button onClick={() => setPublish(true)}>发布我的需求 <b>¥8 / 次</b></button></div><div className="need-list">{needs.map((n, i) => <article key={i}><span className="dot"></span><div><strong>{n.grade} · {n.subject}</strong><p>{n.area}　·　{n.time}</p></div><div><b>{n.budget}</b><small>{n.age}</small></div></article>)}</div></section>

      <section className="how section" id="how"><span className="kicker">简单开始</span><h2>老师免费加入，家长按需选择</h2><div><article><em>01</em><h3>浏览老师与小班</h3><p>按科目、城市和授课形式筛选，了解真实资料。</p></article><article><em>02</em><h3>发布或主动联系</h3><p>家长可以发布需求，也可以选择心仪老师进一步沟通。</p></article><article><em>03</em><h3>确认学习安排</h3><p>双方确认试听、时间与费用，平台提供信息与安全保障。</p></article></div></section>
    </main>
    <footer><div className="brand"><span className="brand-mark">青</span><span>青禾家教<small>让好老师被看见</small></span></div><p>平台仅提供信息展示与连接服务，请双方在沟通中注意核验身份与资质。</p><span>© 2026 青禾家教</span></footer>

    {active && <div className="overlay" onMouseDown={() => setActive(null)}><section className="profile" onMouseDown={e => e.stopPropagation()}><button className="close" onClick={() => setActive(null)} aria-label="关闭">×</button><div className="profile-hero"><div className={`avatar big ${active.color}`}>{active.initials}</div><div><span className="kicker">老师个人主页</span><h2>{active.name} {active.verified && <i>已核验</i>}</h2><strong>{active.role}</strong><p>{active.city} · {active.experience} · ¥{active.rate}/小时起</p></div></div><div className="profile-body"><aside><h4>基本信息</h4><p><b>最高学历</b>{active.degree}</p><p><b>毕业院校</b>{active.school}</p><p><b>授课形式</b>{active.modes.join("、")}</p><a href={active.website} target="_blank" rel="noreferrer">访问个人网站 ↗</a></aside><div><h4>关于我</h4><p>{active.intro} 我相信好的辅导不只是提高一次成绩，更重要的是让学生逐渐拥有独立学习的能力。</p><h4>工作经历</h4>{active.work.map(w => <p className="work" key={w}>{w}</p>)}<button className="contact" onClick={() => alert("联系方式付费解锁功能将在支付接入后开放。")} >联系这位老师</button></div></div></section></div>}

    {publish && <div className="overlay"><section className="publish-modal"><button className="close" onClick={() => { setPublish(false); setParentSubmitted(false); setFormError(""); }} aria-label="关闭">×</button>{parentSubmitted ? <Success title="需求资料已保存" text="资料已经安全保存，当前处于待支付状态。支付功能接入后，完成 ¥8 支付即可正式发布。" close={() => { setPublish(false); setParentSubmitted(false); }}/>: <><span className="kicker">发布家教需求</span><h2>说说孩子需要怎样的帮助</h2><p className="modal-note">填写后进入待支付状态，正式发布价 ¥8 / 次。</p><form onSubmit={e => handleSubmit(e, "parent")}><label>年级与科目<input name="gradeSubject" required placeholder="例如：初二数学"/></label><label>所在城市 / 授课方式<input name="area" required placeholder="例如：成都郫都 / 可线上"/></label><label>期望时间<input name="schedule" required placeholder="例如：周末下午，每周一次"/></label><label>预算（元/小时）<input name="budget" required placeholder="例如：150–200"/></label><label>需求说明<textarea name="description" required placeholder="孩子目前的情况、希望提升的方向…"/></label><label>联系方式<input name="contact" required placeholder="手机号或微信号（不会公开展示）"/></label><input className="hidden-field" name="website" tabIndex={-1} autoComplete="off"/><button className="pay" disabled={submitting}>{submitting ? "正在保存…" : "保存需求，稍后支付 ¥8"}</button>{formError && <small className="form-error">{formError}</small>}<small>联系方式仅用于匹配和服务通知</small></form></>}</section></div>}

    {join && <div className="overlay"><section className="publish-modal teacher-join"><button className="close" onClick={() => { setJoin(false); setTeacherSubmitted(false); setFormError(""); }} aria-label="关闭">×</button>{teacherSubmitted ? <Success title="入驻申请已提交" text="资料已经保存并进入待审核状态。审核通过后，老师主页和课程信息才会公开展示。" close={() => { setJoin(false); setTeacherSubmitted(false); }}/>: <><span className="kicker">老师免费入驻</span><h2>让更多家庭看见你的专业</h2><p className="modal-note">入驻、发布一对一和小班信息均不向老师收费。</p><form onSubmit={e => handleSubmit(e, "teacher")}><label>姓名<input name="name" required placeholder="真实姓名"/></label><label>手机号<input name="phone" required inputMode="numeric" placeholder="中国大陆手机号"/></label><label>所在城市<input name="city" required placeholder="例如：成都"/></label><label>擅长科目<input name="subject" required placeholder="例如：初高中数学"/></label><label>毕业院校<input name="school" required placeholder="学校全称"/></label><label>最高学历<input name="degree" required placeholder="例如：本科"/></label><label>授课形式<select name="teachingMode" required defaultValue=""><option value="" disabled>请选择</option><option>一对一</option><option>小班课</option><option>一对一和小班课</option></select></label><label>小班人数<input name="classSize" placeholder="例如：4–6人（可不填）"/></label><label>参考价格<input name="rate" required placeholder="例如：150元/小时"/></label><label>个人介绍<textarea name="introduction" required placeholder="教学经验、方法与擅长方向…"/></label><input className="hidden-field" name="website" tabIndex={-1} autoComplete="off"/><button className="pay" disabled={submitting}>{submitting ? "正在提交…" : "免费提交入驻申请"}</button>{formError && <small className="form-error">{formError}</small>}<small>手机号不会直接公开，审核时我们会与您联系</small></form></>}</section></div>}
  </>;
}

function Success({ title, text, close }: { title: string; text: string; close: () => void }) {
  return <div className="success"><span>✓</span><h2>{title}</h2><p>{text}</p><button onClick={close}>知道了</button></div>;
}
