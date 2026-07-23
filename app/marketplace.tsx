"use client";

import { useMemo, useState } from "react";

type Teacher = {
  id: number; name: string; initials: string; role: string; school: string; degree: string;
  subjects: string[]; rate: number; city: string; experience: string; intro: string;
  work: string[]; website: string; color: string; verified?: boolean;
};

const teachers: Teacher[] = [
  { id: 1, name: "陈安然", initials: "陈", role: "小学全科 · 英语启蒙", school: "华东师范大学", degree: "教育学硕士", subjects: ["小学全科", "英语"], rate: 160, city: "上海", experience: "6年经验", intro: "擅长培养学习习惯，用孩子听得懂的方式讲清知识。", work: ["上海市实验学校 · 小学部教师（2022—至今）", "好未来 · 英语教研老师（2020—2022）"], website: "https://example.com/anran", color: "coral", verified: true },
  { id: 2, name: "周屿", initials: "周", role: "初高中数学 · 竞赛", school: "浙江大学", degree: "理学学士", subjects: ["初中数学", "高中数学"], rate: 220, city: "杭州", experience: "8年经验", intro: "不靠题海，带学生建立完整的数学思维与错题体系。", work: ["杭州学军中学 · 数学教师（2021—至今）", "猿辅导 · 高中数学主讲（2018—2021）"], website: "https://example.com/zhouyu", color: "blue", verified: true },
  { id: 3, name: "林知夏", initials: "林", role: "语文阅读 · 写作提升", school: "北京师范大学", degree: "汉语言文学硕士", subjects: ["初中语文", "写作"], rate: 180, city: "北京", experience: "5年经验", intro: "从阅读兴趣出发，让表达有内容、有结构，也有自己的声音。", work: ["北京师范大学附属中学 · 语文教师（2023—至今）", "新东方 · 阅读写作教师（2021—2023）"], website: "https://example.com/zhixia", color: "green", verified: true },
  { id: 4, name: "许嘉言", initials: "许", role: "高中物理 · 中考科学", school: "南京大学", degree: "物理学硕士", subjects: ["高中物理", "初中科学"], rate: 200, city: "南京", experience: "7年经验", intro: "把抽象物理变成生活中的直观模型，注重方法迁移。", work: ["南京外国语学校 · 物理教师（2022—至今）", "精锐教育 · 理科组教师（2019—2022）"], website: "https://example.com/jiayan", color: "gold" },
];

const needs = [
  { grade: "初二", subject: "数学", area: "上海 · 徐汇", time: "周末下午", budget: "150–200元/小时", age: "刚刚" },
  { grade: "五年级", subject: "英语", area: "杭州 · 西湖", time: "周三、周五晚", budget: "120–180元/小时", age: "32分钟前" },
  { grade: "高一", subject: "物理", area: "线上授课", time: "每周2次", budget: "200元/小时", age: "1小时前" },
];

export function Marketplace() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("全部科目");
  const [active, setActive] = useState<Teacher | null>(null);
  const [publish, setPublish] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const filtered = useMemo(() => teachers.filter(t => (subject === "全部科目" || t.subjects.some(s => s.includes(subject))) && (`${t.name}${t.role}${t.school}${t.city}`).includes(query)), [query, subject]);

  return <>
    <header className="nav"><a className="brand" href="#top"><span className="brand-mark">青</span><span>青禾家教<small>认真找老师，安心学知识</small></span></a><nav><a href="#teachers">找老师</a><a href="#needs">家长需求</a><a href="#how">如何使用</a></nav><button className="publish-top" onClick={() => setPublish(true)}>发布需求 <b>¥8</b></button></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow">专注一对一家教匹配</div><h1>好老师，不该<br/>藏在信息差里。</h1><p>清晰的学历与经历，真实的教学方向。<br/>先了解，再联系，找到适合孩子的那一位。</p><div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索科目、城市或老师姓名"/><a href="#teachers">找老师</a></div><div className="trust"><span>✓ 资料清晰透明</span><span>✓ 家长自主选择</span><span>✓ 无隐藏服务费</span></div></div><div className="hero-card"><span className="tape"></span><div className="quote">“</div><p>教育不是把篮子装满，<br/>而是把灯点亮。</p><div className="scribble">每个孩子，都值得被认真看见。</div><div className="leaf">青禾</div></div></section>

      <section className="teachers section" id="teachers"><div className="section-head"><div><span className="kicker">精选老师</span><h2>先看看，这些认真教书的人</h2></div><div className="filters">{["全部科目", "数学", "英语", "语文", "物理"].map(s => <button className={subject === s ? "active" : ""} key={s} onClick={() => setSubject(s)}>{s}</button>)}</div></div><div className="teacher-grid">{filtered.map(t => <article className="teacher-card" key={t.id} onClick={() => setActive(t)}><div className={`avatar ${t.color}`}>{t.initials}<span>{t.verified ? "✓" : ""}</span></div><div className="teacher-main"><div className="name-row"><h3>{t.name}</h3><span>{t.experience}</span></div><strong>{t.role}</strong><p className="school">⌂ {t.school} · {t.degree}</p><p>{t.intro}</p><div className="tags">{t.subjects.map(s => <i key={s}>{s}</i>)}</div></div><div className="card-foot"><span>{t.city}</span><b>¥{t.rate}<small>/小时</small></b><button>查看主页 →</button></div></article>)}</div>{filtered.length === 0 && <div className="empty">暂时没有找到匹配的老师，换个关键词试试。</div>}<button className="more">查看全部老师 <span>→</span></button></section>

      <section className="needs section" id="needs"><div className="needs-intro"><span className="kicker light">家长需求</span><h2>这些家庭，正在等一位<br/>合适的老师</h2><p>需求由家长自主发布。老师可以了解情况后，再决定是否联系。</p><button onClick={() => setPublish(true)}>发布我的需求 <b>¥8 / 次</b></button></div><div className="need-list">{needs.map((n, i) => <article key={i}><span className="dot"></span><div><strong>{n.grade} · {n.subject}</strong><p>{n.area}　·　{n.time}</p></div><div><b>{n.budget}</b><small>{n.age}</small></div></article>)}</div></section>

      <section className="how section" id="how"><span className="kicker">简单开始</span><h2>不绕弯，三步找到合适的老师</h2><div><article><em>01</em><h3>看看老师</h3><p>按科目、城市筛选，了解学历、经历与教学方向。</p></article><article><em>02</em><h3>自主联系</h3><p>进入老师个人主页，通过公开方式进一步沟通。</p></article><article><em>03</em><h3>确认安排</h3><p>双方自行确认试听、时间与费用，平台不收中介费。</p></article></div></section>
    </main>
    <footer><div className="brand"><span className="brand-mark">青</span><span>青禾家教<small>让好老师被看见</small></span></div><p>平台仅提供信息展示与连接服务，请双方在沟通中注意核验身份与资质。</p><span>© 2026 青禾家教</span></footer>

    {active && <div className="overlay" onMouseDown={() => setActive(null)}><section className="profile" onMouseDown={e => e.stopPropagation()}><button className="close" onClick={() => setActive(null)}>×</button><div className="profile-hero"><div className={`avatar big ${active.color}`}>{active.initials}</div><div><span className="kicker">老师个人主页</span><h2>{active.name} {active.verified && <i>已核验</i>}</h2><strong>{active.role}</strong><p>{active.city} · {active.experience} · ¥{active.rate}/小时</p></div></div><div className="profile-body"><aside><h4>基本信息</h4><p><b>最高学历</b>{active.degree}</p><p><b>毕业院校</b>{active.school}</p><p><b>擅长科目</b>{active.subjects.join("、")}</p><a href={active.website} target="_blank" rel="noreferrer">访问个人网站 ↗</a></aside><div><h4>关于我</h4><p>{active.intro} 我相信好的辅导不只是提高一次成绩，更重要的是让学生知道问题在哪里、下一步怎么做，并逐渐拥有独立学习的能力。</p><h4>工作经历</h4>{active.work.map(w => <p className="work" key={w}>{w}</p>)}<button className="contact">联系这位老师</button></div></div></section></div>}

    {publish && <div className="overlay"><section className="publish-modal"><button className="close" onClick={() => { setPublish(false); setSubmitted(false); }}>×</button>{submitted ? <div className="success"><span>✓</span><h2>需求已填写完成</h2><p>这是网站演示版本，暂未产生真实扣款。接入正式支付后，完成 ¥8 支付即可发布。</p><button onClick={() => { setPublish(false); setSubmitted(false); }}>知道了</button></div> : <><span className="kicker">发布家教需求</span><h2>说说孩子需要怎样的帮助</h2><p className="modal-note">填写后支付 ¥8 即可发布一次，信息展示 30 天。</p><form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}><label>年级与科目<input required placeholder="例如：初二数学"/></label><label>所在城市 / 授课方式<input required placeholder="例如：上海徐汇 / 可线上"/></label><label>期望时间<input required placeholder="例如：周末下午，每周一次"/></label><label>预算（元/小时）<input required placeholder="例如：150–200"/></label><label>需求说明<textarea required placeholder="孩子目前的学习情况、希望重点提升的方向…"/></label><label>联系方式<input required placeholder="手机号或微信号（发布后可见）"/></label><button className="pay">确认信息并支付 ¥8</button><small>演示版不会真实扣款或保存联系方式</small></form></>}</section></div>}
  </>;
}
