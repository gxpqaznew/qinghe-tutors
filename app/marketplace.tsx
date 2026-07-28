"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Role = "learner" | "creator";

type Creator = {
  id: number | string;
  name: string;
  initials: string;
  university: string;
  major: string;
  skill: string;
  category: string;
  mode: string;
  price: string;
  intro: string;
  proof: string;
  color: string;
  workUrl?: string;
  source?: "published";
  schoolVerificationStatus?: string;
};

type SkillRequest = {
  id: number | string;
  title: string;
  university: string;
  category: string;
  mode: string;
  budget: string;
  deadline: string;
  description: string;
  createdAt?: string;
};

type Experience = {
  id?: number | string;
  title: string;
  category: string;
  author: string;
  university: string;
  summary: string;
  readTime: string;
  saves: number;
  content?: string;
  sourceUrl?: string;
  source?: "published";
};

const creators: Creator[] = [
  {
    id: 1,
    name: "林小满",
    initials: "林",
    university: "四川大学",
    major: "新闻传播 · 大三",
    skill: "PPT视觉优化",
    category: "设计表达",
    mode: "线上交付",
    price: "¥39 起",
    intro: "帮你理清信息层级、统一版式，让课程展示和社团路演更好讲。",
    proof: "已完成 18 次校园展示优化",
    color: "coral",
  },
  {
    id: 2,
    name: "周予安",
    initials: "周",
    university: "电子科技大学",
    major: "计算机科学 · 研一",
    skill: "Python 数据分析入门",
    category: "编程与数据",
    mode: "线上 60 分钟",
    price: "¥59 / 次",
    intro: "从真实小数据开始，陪你跑通清洗、可视化和结果表达，不代做课程作业。",
    proof: "校内数据社群分享者",
    color: "blue",
  },
  {
    id: 3,
    name: "吴嘉树",
    initials: "吴",
    university: "电子科技大学",
    major: "数学与应用数学 · 大三",
    skill: "高数与线代梳理",
    category: "大学课程",
    mode: "线上 60 分钟",
    price: "¥45 / 次",
    intro: "围绕极限、微积分、矩阵和线性空间讲概念与解题思路，不代做作业或考试。",
    proof: "有校内朋辈辅导经历",
    color: "navy",
  },
  {
    id: 4,
    name: "唐可",
    initials: "唐",
    university: "西南交通大学",
    major: "建筑学 · 大四",
    skill: "校园人像摄影",
    category: "摄影影像",
    mode: "成都线下",
    price: "¥89 起",
    intro: "自然纪实风格，适合毕业照、社团形象照和个人主页照片。",
    proof: "公开作品集可查看",
    color: "gold",
  },
  {
    id: 5,
    name: "许知遥",
    initials: "许",
    university: "西南财经大学",
    major: "金融学 · 大三",
    skill: "英语口语陪练",
    category: "语言表达",
    mode: "线上 45 分钟",
    price: "¥35 / 次",
    intro: "围绕校园、旅行和面试场景练表达，结束后给你一页复盘建议。",
    proof: "雅思口语 7.5",
    color: "green",
  },
  {
    id: 6,
    name: "叶青",
    initials: "叶",
    university: "成都理工大学",
    major: "数字媒体 · 大二",
    skill: "短视频剪辑陪跑",
    category: "摄影影像",
    mode: "线上共创",
    price: "¥49 起",
    intro: "从素材整理到节奏和字幕，带你完成自己的第一支校园短片。",
    proof: "校园媒体中心剪辑",
    color: "violet",
  },
  {
    id: 7,
    name: "陈一",
    initials: "陈",
    university: "四川音乐学院",
    major: "流行演唱 · 大三",
    skill: "零基础吉他入门",
    category: "兴趣生活",
    mode: "成都 / 线上",
    price: "¥45 / 次",
    intro: "不从枯燥理论开始，先学会弹唱一首你喜欢的歌。",
    proof: "3 年校园乐队经历",
    color: "navy",
  },
];

const experiences: Experience[] = [
  {
    title: "我把大学四年的文件整理成了一个不会崩的系统",
    category: "效率方法",
    author: "阿屿",
    university: "四川大学",
    summary: "不用复杂软件，只靠四级文件夹、统一命名和每周十分钟归档。",
    readTime: "4 分钟",
    saves: 328,
  },
  {
    title: "第一次做路演 PPT，我最后悔忽略的三件事",
    category: "设计表达",
    author: "林小满",
    university: "四川大学",
    summary: "信息比装饰重要，讲述顺序比动画重要，排练比继续改字体重要。",
    readTime: "5 分钟",
    saves: 216,
  },
  {
    title: "从不敢开口，到能完成英文课堂展示",
    category: "语言表达",
    author: "许知遥",
    university: "西南财经大学",
    summary: "把完整句子拆成可替换的小模块，一周只练三个高频场景。",
    readTime: "6 分钟",
    saves: 189,
  },
];

const sampleRequests: SkillRequest[] = [
  {
    id: "sample-0",
    title: "想把高数极限和导数重新梳理一遍",
    university: "电子科技大学",
    category: "大学课程",
    mode: "线上",
    budget: "40–70 元/次",
    deadline: "下周开始",
    description: "大一课程，希望以概念和典型例题为主，不代做作业或考试。",
  },
  {
    id: "sample-1",
    title: "想找同学帮我优化社团招新 PPT",
    university: "四川大学",
    category: "设计表达",
    mode: "线上",
    budget: "80–150 元",
    deadline: "本周日",
    description: "已经有完整内容，希望重点调整结构、字体和配色，不需要代写。",
  },
  {
    id: "sample-2",
    title: "零基础学会用 Python 整理问卷数据",
    university: "西南财经大学",
    category: "编程与数据",
    mode: "成都 / 线上",
    budget: "50–80 元/次",
    deadline: "两周内",
    description: "希望有人带着做一个练习案例，理解基础流程，不代做课程作业。",
  },
  {
    id: "sample-3",
    title: "毕业季校园人像拍摄",
    university: "西南交通大学",
    category: "摄影影像",
    mode: "成都线下",
    budget: "100–200 元",
    deadline: "下月上旬",
    description: "两个人，希望风格自然，最好可以先看公开作品集。",
  },
  {
    id: "sample-4",
    title: "找一位同学陪练英语面试",
    university: "成都理工大学",
    category: "语言表达",
    mode: "线上",
    budget: "30–60 元/次",
    deadline: "这周开始",
    description: "主要练自我介绍和常见追问，希望每次结束后有简单反馈。",
  },
];

const categories = ["全部", "大学课程", "设计表达", "编程与数据", "摄影影像", "语言表达", "兴趣生活"];
const universitySuggestions = ["四川大学", "电子科技大学", "西南交通大学", "西南财经大学", "成都理工大学", "四川音乐学院"];

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
  const [creatorReady, setCreatorReady] = useState(false);
  const [activeCreator, setActiveCreator] = useState<Creator | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [submitted, setSubmitted] = useState<"request" | "creator" | "experience" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [school, setSchool] = useState("");
  const [sameSchoolOnly, setSameSchoolOnly] = useState(false);
  const [listedCreators, setListedCreators] = useState<Creator[]>(creators);
  const [listedExperiences, setListedExperiences] = useState<Experience[]>(experiences);

  useEffect(() => {
    const savedRole = localStorage.getItem("campus-role");
    if (savedRole === "learner" || savedRole === "creator") setRole(savedRole);
    setCreatorReady(localStorage.getItem("campus-creator-ready") === "true");
    setSchool(localStorage.getItem("campus-university") || "");
    setHydrated(true);
  }, []);

  useEffect(() => {
    fetch("/api/creator-profiles")
      .then((response) => response.json())
      .then((result: { profiles?: Array<{
        id: number;
        name: string;
        university: string;
        majorGrade: string;
        skill: string;
        mode: string;
        serviceIntro: string;
        workUrl: string;
        schoolVerificationStatus: string;
      }> }) => {
        if (!result.profiles?.length) return;
        const publishedProfiles: Creator[] = result.profiles.map((profile, index) => ({
          id: `profile-${profile.id}`,
          name: profile.name,
          initials: profile.name.slice(0, 1),
          university: profile.university,
          major: profile.majorGrade,
          skill: profile.skill,
          category: "同学技能",
          mode: profile.mode,
          price: "价格面议",
          intro: profile.serviceIntro,
          proof: profile.workUrl ? "已提交公开作品链接" : "资料已通过平台审核",
          color: ["coral", "blue", "navy", "gold", "green", "violet"][index % 6],
          workUrl: profile.workUrl,
          source: "published",
          schoolVerificationStatus: profile.schoolVerificationStatus,
        }));
        setListedCreators([...publishedProfiles, ...creators]);
      })
      .catch(() => {
        // 网络异常时保留示例内容。
      });

    fetch("/api/experience-posts")
      .then((response) => response.json())
      .then((result: { posts?: Array<{
        id: number;
        authorName: string;
        university: string;
        title: string;
        category: string;
        sourceUrl: string;
        summary: string;
        content: string;
      }> }) => {
        if (!result.posts?.length) return;
        const publishedPosts: Experience[] = result.posts.map((post) => ({
          id: `experience-${post.id}`,
          title: post.title,
          category: post.category,
          author: post.authorName,
          university: post.university,
          summary: post.summary,
          readTime: "经验分享",
          saves: 0,
          content: post.content,
          sourceUrl: post.sourceUrl,
          source: "published",
        }));
        setListedExperiences([...publishedPosts, ...experiences]);
      })
      .catch(() => {
        // 网络异常时保留示例内容。
      });
  }, []);

  const filteredCreators = useMemo(() => {
    const key = query.trim();
    return listedCreators.filter((creator) => {
      const categoryMatches = category === "全部" || creator.category === category;
      const queryMatches = !key || `${creator.name}${creator.university}${creator.major}${creator.skill}${creator.category}`.includes(key);
      const schoolMatches = !sameSchoolOnly || (!!school && creator.university === school);
      return categoryMatches && queryMatches && schoolMatches;
    });
  }, [category, listedCreators, query, sameSchoolOnly, school]);

  function updateSchool(nextSchool: string) {
    const normalized = nextSchool.trim();
    setSchool(nextSchool);
    if (normalized) localStorage.setItem("campus-university", normalized);
    else {
      localStorage.removeItem("campus-university");
      setSameSchoolOnly(false);
    }
  }

  function chooseRole(nextRole: Role) {
    localStorage.setItem("campus-role", nextRole);
    setRole(nextRole);
  }

  function switchRole() {
    localStorage.removeItem("campus-role");
    setRole(null);
    setActiveCreator(null);
    setRequestOpen(false);
    setExperienceOpen(false);
    setSubmitted(null);
  }

  async function submitCreator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedSchool = String(new FormData(event.currentTarget).get("university") || "").trim();
    setSubmitting(true);
    setFormError("");
    try {
      await postForm("/api/creator-profiles", event.currentTarget);
      localStorage.setItem("campus-creator-ready", "true");
      if (submittedSchool) {
        localStorage.setItem("campus-university", submittedSchool);
        setSchool(submittedSchool);
      }
      setCreatorReady(true);
      setSubmitted("creator");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedSchool = String(new FormData(event.currentTarget).get("university") || "").trim();
    setSubmitting(true);
    setFormError("");
    try {
      await postForm("/api/skill-requests", event.currentTarget);
      if (submittedSchool) {
        localStorage.setItem("campus-university", submittedSchool);
        setSchool(submittedSchool);
      }
      setSubmitted("request");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitExperience(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await postForm("/api/experience-posts", event.currentTarget);
      setSubmitted("experience");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="loading-screen">正在打开交换所…</div>;
  if (!role) return <RoleGate onChoose={chooseRole} />;
  if (role === "creator" && !creatorReady) {
    return (
      <CreatorOnboarding
        school={school}
        onSubmit={submitCreator}
        submitting={submitting}
        error={formError}
        onSwitch={switchRole}
        onExisting={() => {
          localStorage.setItem("campus-creator-ready", "true");
          setCreatorReady(true);
        }}
      />
    );
  }
  if (role === "creator") {
    return (
      <CreatorPlaza
        school={school}
        onSchoolChange={updateSchool}
        onSwitch={switchRole}
        onPublish={() => {
          setSubmitted(null);
          setFormError("");
          setExperienceOpen(true);
        }}
        experienceOpen={experienceOpen}
        submitted={submitted}
        submitting={submitting}
        error={formError}
        onSubmitExperience={submitExperience}
        onCloseExperience={() => {
          setExperienceOpen(false);
          setSubmitted(null);
          setFormError("");
        }}
      />
    );
  }

  return (
    <>
      <header className="site-nav">
        <Brand />
        <nav>
          <a href="#skills">找技能</a>
          <a href="#experiences">看经验</a>
          <a href="#rules">交换规则</a>
        </nav>
        <div className="nav-actions">
          <button className="text-button" onClick={switchRole}>切换身份</button>
          <button className="primary-button compact" onClick={() => setRequestOpen(true)}>发布需求</button>
        </div>
      </header>

      <main>
        <section className="learner-hero">
          <div className="hero-copy">
            <span className="eyebrow">大学生技能交换所</span>
            <h1>学校里，总有人<br />刚好会你想学的。</h1>
            <p>找同学搞懂一门大学课程、学一项实用技能、完成一次小服务，或者看看别人走过的学习弯路。身份清楚、需求具体、价格透明。</p>
            <div className="hero-actions">
              <a className="primary-button" href="#skills">逛逛技能</a>
              <button className="secondary-button" onClick={() => setRequestOpen(true)}>免费发需求</button>
            </div>
            <div className="trust-row">
              <span>只允许个人对个人</span>
              <span>服务边界写清楚</span>
              <span>严禁机构与中介</span>
            </div>
          </div>
          <div className="hero-board" aria-label="平台热门技能">
            <span className="board-pin pin-one" />
            <div className="board-card card-main">
              <small>本周想学</small>
              <strong>把一团信息<br />讲成一页好 PPT</strong>
              <p>设计表达 · 线上</p>
            </div>
            <div className="board-card card-mini card-blue">数据分析</div>
            <div className="board-card card-mini card-coral">摄影修图</div>
            <div className="board-note">会一点，也能帮到另一个人。</div>
          </div>
        </section>

        <section className="content-section" id="skills">
          <div className="section-heading">
            <div>
              <span className="eyebrow">技能名片</span>
              <h2>从一个具体的小需求开始</h2>
            </div>
            <div className="search-stack">
              <small>真实资料经审核后公开；标有“示例”的内容仅用于展示功能。</small>
              <input
                className="skill-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索课程、技能、学校或专业"
                aria-label="搜索课程、技能、学校或专业"
              />
            </div>
          </div>
          <SchoolFilter
            school={school}
            sameSchoolOnly={sameSchoolOnly}
            onSchoolChange={updateSchool}
            onSameSchoolChange={setSameSchoolOnly}
          />
          <div className="category-tabs" aria-label="技能分类">
            {categories.map((item) => (
              <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <div className="creator-grid">
            {filteredCreators.map((creator) => (
              <article className="creator-card" key={creator.id} onClick={() => setActiveCreator(creator)}>
                <div className="card-topline">
                  <span>
                    {school && creator.university === school
                      ? `同校 · ${creator.schoolVerificationStatus === "verified" ? "已认证" : "待认证"}`
                      : creator.source === "published"
                        ? "已审核发布"
                        : `${creator.category} · 示例`}
                  </span>
                  <b>{creator.price}</b>
                </div>
                <h3>{creator.skill}</h3>
                <p>{creator.intro}</p>
                <div className="creator-person">
                  <div className={`avatar ${creator.color}`}>{creator.initials}</div>
                  <div><strong>{creator.name}</strong><small>{creator.university} · {creator.major}</small></div>
                </div>
                <div className="card-footer"><span>{creator.mode}</span><button>查看主页 →</button></div>
              </article>
            ))}
            {!filteredCreators.length && (
              <div className="empty-state">
                <strong>暂时没有找到这所学校的技能名片</strong>
                <p>可以关闭“只看同校”继续浏览，或免费发布需求等同校同学回应。</p>
                <button className="secondary-button compact" onClick={() => setSameSchoolOnly(false)}>查看全部学校</button>
              </div>
            )}
          </div>
        </section>

        <section className="experience-section content-section" id="experiences">
          <div className="section-heading">
            <div>
              <span className="eyebrow">学习心得</span>
              <h2>经验不必写成教程</h2>
            </div>
            <p>说清楚你遇到了什么、怎么试、最后有什么改变，就能让别人少绕一点路。</p>
          </div>
          <div className="experience-grid">
            {listedExperiences.map((item, index) => (
              <article key={item.id || item.title}>
                <div className="article-number">{String(index + 1).padStart(2, "0")}</div>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <footer>
                  <b>{item.author} · {item.university}</b>
                  <small>{item.source === "published" ? "已审核发布" : `${item.readTime} · ${item.saves} 人收藏`}</small>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="rules-section" id="rules">
          <div>
            <span className="eyebrow">交换规则</span>
            <h2>个人找到个人，平台不允许任何中介。</h2>
          </div>
          <div className="rules-grid">
            <article><b>只限个人</b><p>发布者和提供技能的人都必须代表自己，不得以机构、工作室、团队、招生代理或经纪人身份入驻。</p></article>
            <article><b>严禁中介</b><p>不得代他人发布、批量招募、转卖订单、赚取差价或把用户导向培训机构；发现后直接停止展示。</p></article>
            <article><b>可以</b><p>大学课程知识讲解、技能陪练、作品优化、经验分享、公开作品展示和真实的小型服务。</p></article>
            <article><b>不可以</b><p>代写作业或论文、替考作弊、伪造证明，以及任何侵犯版权或隐私的交易。</p></article>
            <article><b>平台边界</b><p>平台只提供个人资料展示和双方同意后的连接，不代理谈价、不转售订单、不从中加价；首版暂不代收款。</p></article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <Brand />
        <p>平台坚持个人对个人，严禁机构、中介、代理和订单转售。正式合作前，请双方核验身份、能力、价格与交付边界。</p>
        <span>© 2026 大学生技能交换所</span>
      </footer>

      {activeCreator && (
        <div className="overlay" onMouseDown={() => setActiveCreator(null)}>
          <section className="creator-profile" onMouseDown={(event) => event.stopPropagation()}>
            <button className="close-button" onClick={() => setActiveCreator(null)} aria-label="关闭">×</button>
            <div className="profile-top">
              <div className={`avatar large ${activeCreator.color}`}>{activeCreator.initials}</div>
              <div>
                <span className="eyebrow">{activeCreator.category}</span>
                <h2>{activeCreator.skill}</h2>
                <strong>{activeCreator.name} · {activeCreator.university}</strong>
                <small className="individual-badge">
                  {school && activeCreator.university === school
                    ? `同校 · ${activeCreator.schoolVerificationStatus === "verified" ? "学校身份已认证" : "学校信息待认证"}`
                    : activeCreator.source === "published"
                      ? "个人技能分享者 · 资料已审核"
                      : "个人技能分享者 · 示例资料"}
                </small>
              </div>
            </div>
            <div className="profile-content">
              <div>
                <h3>可以帮你什么</h3>
                <p>{activeCreator.intro}</p>
                <h3>同学背景</h3>
                <p>{activeCreator.major}；{activeCreator.proof}。</p>
                {activeCreator.workUrl && <p><a href={activeCreator.workUrl} target="_blank" rel="noreferrer">查看公开作品或个人主页 →</a></p>}
                <h3>方式与参考价</h3>
                <p>{activeCreator.mode} · {activeCreator.price}</p>
              </div>
              <aside>
                <b>联系前先确认</b>
                <p>具体目标、交付内容、时间和价格。平台不会直接公开任何人的私人联系方式。</p>
                <button className="primary-button" onClick={() => alert("首版正在补充双方同意后的联系流程，暂不直接公开联系方式。")}>申请联系</button>
                <small>禁止代写、替考和学术不端</small>
              </aside>
            </div>
          </section>
        </div>
      )}

      {requestOpen && (
        <RequestModal
          school={school}
          submitted={submitted === "request"}
          submitting={submitting}
          error={formError}
          onSubmit={submitRequest}
          onClose={() => {
            setRequestOpen(false);
            setSubmitted(null);
            setFormError("");
          }}
        />
      )}
    </>
  );
}

function SchoolFilter({
  school,
  sameSchoolOnly,
  onSchoolChange,
  onSameSchoolChange,
}: {
  school: string;
  sameSchoolOnly: boolean;
  onSchoolChange: (school: string) => void;
  onSameSchoolChange: (checked: boolean) => void;
}) {
  return (
    <div className="school-filter">
      <div className="school-picker">
        <label htmlFor="my-university">我的学校</label>
        <input
          id="my-university"
          list="university-options"
          value={school}
          onChange={(event) => onSchoolChange(event.target.value)}
          placeholder="输入学校全称"
        />
        <datalist id="university-options">
          {universitySuggestions.map((university) => <option key={university} value={university} />)}
        </datalist>
      </div>
      <label className={`same-school-toggle ${!school.trim() ? "disabled" : ""}`}>
        <input
          type="checkbox"
          checked={sameSchoolOnly}
          disabled={!school.trim()}
          onChange={(event) => onSameSchoolChange(event.target.checked)}
        />
        <span>只看同校</span>
      </label>
      <p>
        <b>同校标签只表示双方填写的学校名称一致，不等于学生身份已认证。</b>
        只有“已认证”徽章才代表完成核验；联系前请核验身份，不提前转账。
      </p>
    </div>
  );
}

function RoleGate({ onChoose }: { onChoose: (role: Role) => void }) {
  return (
    <main className="role-gate">
      <div className="role-shell">
        <Brand />
        <div className="role-intro">
          <span className="eyebrow">欢迎来到大学生技能交换所</span>
          <h1>把你会的，<br />换成彼此的下一步。</h1>
          <p>这里不做泛泛的信息黄页。每个人都从一个具体身份、一个具体技能和一个具体需求开始。</p>
        </div>
        <div className="role-choices">
          <button className="role-choice learner-choice" onClick={() => onChoose("learner")}>
            <span>学</span>
            <small>我有一个具体需求</small>
            <strong>我想学 / 我需要</strong>
            <p>浏览同学的技能名片、阅读学习心得，或者免费发布一个需求。</p>
            <b>进入技能市场 →</b>
          </button>
          <button className="role-choice creator-choice" onClick={() => onChoose("creator")}>
            <span>会</span>
            <small>我有一项可以分享的技能</small>
            <strong>我会这个</strong>
            <p>建立个人技能主页、查看真实需求，也可以分享自己的学习经验。</p>
            <b>成为技能分享者 →</b>
          </button>
        </div>
        <p className="role-footnote">身份仅保存在当前设备，之后可以随时切换。</p>
      </div>
    </main>
  );
}

function CreatorOnboarding({
  school,
  onSubmit,
  submitting,
  error,
  onSwitch,
  onExisting,
}: {
  school: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  error: string;
  onSwitch: () => void;
  onExisting: () => void;
}) {
  return (
    <main className="creator-onboarding">
      <header className="portal-header">
        <Brand />
        <button className="text-button" onClick={onSwitch}>切换身份</button>
      </header>
      <section className="onboarding-layout">
        <aside>
          <span className="eyebrow">首次入驻</span>
          <h1>先说清楚，<br />你会什么。</h1>
          <p>不需要包装成“大神”。一个真实背景、一项具体能力、一段清晰边界，就足以开始。</p>
          <ol>
            <li><b>1</b>填写学校和技能信息</li>
            <li><b>2</b>说明能做与不能做</li>
            <li><b>3</b>审核后生成个人主页</li>
          </ol>
        </aside>
        <div className="onboarding-card">
          <h2>建立技能主页</h2>
          <p>仅接受大学生个人入驻。机构、工作室、中介、招生代理和替他人接单的账号不会通过审核。</p>
          <form onSubmit={onSubmit}>
            <label>昵称 / 姓名<input name="name" required placeholder="例如：林小满" /></label>
            <label>所在城市<input name="city" required placeholder="例如：成都" /></label>
            <label>
              学校
              <input name="university" required defaultValue={school} list="university-options" placeholder="例如：四川大学" />
              <datalist id="university-options">
                {universitySuggestions.map((university) => <option key={university} value={university} />)}
              </datalist>
            </label>
            <label>专业与年级<input name="majorGrade" required placeholder="例如：新闻传播，大三" /></label>
            <label>你会的课程 / 技能<input name="skill" required placeholder="例如：高数线代 / PPT视觉优化" /></label>
            <label>服务方式<input name="mode" required placeholder="例如：线上交付 / 成都线下" /></label>
            <label className="full-field">技能与服务说明<textarea name="serviceIntro" required placeholder="你能具体帮助什么、如何完成、哪些事情不做…" /></label>
            <label className="full-field">公开作品或主页链接（选填）<input name="workUrl" type="url" placeholder="https://" /></label>
            <label className="full-field">联系方式<input name="contact" required placeholder="手机号或微信号（不会直接公开）" /></label>
            <label className="consent-field full-field"><input type="checkbox" name="individualConfirmed" required /><span>我确认以个人身份入驻，只发布本人能够完成的服务，不代表机构、工作室、中介、代理或他人接单。</span></label>
            <label className="consent-field full-field"><input type="checkbox" name="consent" required /><span>我同意平台保存以上资料用于审核和需求连接，并承诺不提供代写、替考等违规服务。</span></label>
            <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />
            <button className="primary-button full-field" disabled={submitting}>
              {submitting ? "正在提交…" : "提交资料并进入需求广场"}
            </button>
            {error && <small className="form-error full-field">{error}</small>}
          </form>
          <button className="existing-button" onClick={onExisting}>我已经提交过资料，直接进入</button>
        </div>
      </section>
    </main>
  );
}

function CreatorPlaza({
  school,
  onSchoolChange,
  onSwitch,
  onPublish,
  experienceOpen,
  submitted,
  submitting,
  error,
  onSubmitExperience,
  onCloseExperience,
}: {
  school: string;
  onSchoolChange: (school: string) => void;
  onSwitch: () => void;
  onPublish: () => void;
  experienceOpen: boolean;
  submitted: "request" | "creator" | "experience" | null;
  submitting: boolean;
  error: string;
  onSubmitExperience: (event: FormEvent<HTMLFormElement>) => void;
  onCloseExperience: () => void;
}) {
  const [requests, setRequests] = useState<SkillRequest[]>(sampleRequests);
  const [sameSchoolOnly, setSameSchoolOnly] = useState(false);

  useEffect(() => {
    fetch("/api/skill-requests")
      .then((response) => response.json())
      .then((result: { requests?: SkillRequest[] }) => {
        if (result.requests?.length) setRequests([...result.requests, ...sampleRequests]);
      })
      .catch(() => {
        // 网络异常时保留示例内容。
      });
  }, []);

  const visibleRequests = useMemo(
    () => requests.filter((request) => !sameSchoolOnly || (!!school && request.university === school)),
    [requests, sameSchoolOnly, school],
  );

  return (
    <>
      <header className="portal-header sticky">
        <Brand />
        <nav><a href="#requests">需求广场</a><a href="#boundary">交易边界</a></nav>
        <div className="nav-actions">
          <button className="text-button" onClick={onSwitch}>切换身份</button>
          <button className="primary-button compact" onClick={onPublish}>分享经验</button>
        </div>
      </header>
      <main className="plaza-page" id="requests">
        <section className="plaza-hero">
          <span className="eyebrow">技能分享者端</span>
          <h1>别猜别人需要什么，<br />先看看真实需求。</h1>
          <p>只回应能力范围内的事情；先说清交付、价格和时间，再决定是否连接。</p>
          <div><span>只限个人对个人</span><span>联系方式不公开</span><span>严禁中介与机构</span></div>
        </section>
        <section className="plaza-content">
          <div className="plaza-filter">
            <strong>最新技能需求</strong>
            <button className="secondary-button compact" onClick={onPublish}>写一条学习心得</button>
          </div>
          <SchoolFilter
            school={school}
            sameSchoolOnly={sameSchoolOnly}
            onSchoolChange={onSchoolChange}
            onSameSchoolChange={setSameSchoolOnly}
          />
          <div className="request-grid">
            {visibleRequests.map((request, index) => (
              <article className="request-card" key={request.id}>
                <div>
                  <span>{school && request.university === school ? "同校 · 待认证" : typeof request.id === "string" ? "示例需求" : index < 2 ? "新发布" : request.category}</span>
                  <small>{request.university} · {request.mode}</small>
                </div>
                <h2>{request.title}</h2>
                <dl>
                  <div><dt>分类</dt><dd>{request.category}</dd></div>
                  <div><dt>预算</dt><dd>{request.budget}</dd></div>
                  <div><dt>时间</dt><dd>{request.deadline}</dd></div>
                </dl>
                <p>{request.description}</p>
                <button onClick={() => alert("首版正在补充双方同意后的联系流程，需求方联系方式不会直接公开。")}>我能帮忙，申请联系 →</button>
              </article>
            ))}
            {!visibleRequests.length && (
              <div className="empty-state">
                <strong>暂时没有同校需求</strong>
                <p>关闭“只看同校”即可查看其他学校同学发布的需求。</p>
                <button className="secondary-button compact" onClick={() => setSameSchoolOnly(false)}>查看全部学校</button>
              </div>
            )}
          </div>
          <aside className="boundary-note" id="boundary">
            <strong>个人交易边界</strong>
            <p>仅允许本人发布、本人沟通、本人提供服务。禁止机构、中介、代理、订单转售和赚取差价；可以讲解高数、线代等大学课程，但不得代写课程作业、实验报告或论文。</p>
          </aside>
        </section>
      </main>

      {experienceOpen && (
        <ExperienceModal
          submitted={submitted === "experience"}
          submitting={submitting}
          error={error}
          onSubmit={onSubmitExperience}
          onClose={onCloseExperience}
        />
      )}
    </>
  );
}

function RequestModal({
  school,
  submitted,
  submitting,
  error,
  onSubmit,
  onClose,
}: {
  school: string;
  submitted: boolean;
  submitting: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="overlay">
      <section className="form-modal">
        <button className="close-button" onClick={onClose} aria-label="关闭">×</button>
        {submitted ? (
          <SuccessState title="需求已提交" text="审核后会进入技能需求广场。你的联系方式不会直接公开，也不会产生费用。" onClose={onClose} />
        ) : (
          <>
            <span className="eyebrow">免费发布需求</span>
            <h2>把事情说具体一点</h2>
            <p className="modal-note">越具体，越容易遇到真正能帮忙的同学。</p>
            <form onSubmit={onSubmit}>
              <label className="full-field">需求标题<input name="title" required placeholder="例如：想找同学帮我优化社团招新 PPT" /></label>
              <label>学校<input name="university" required defaultValue={school} list="university-options" placeholder="例如：四川大学" /></label>
              <label>技能分类<select name="category" required defaultValue=""><option value="" disabled>请选择</option>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>线上 / 线下<input name="mode" required placeholder="例如：线上 / 成都线下" /></label>
              <label>预算<input name="budget" required placeholder="例如：80–150 元" /></label>
              <label>希望完成时间<input name="deadline" required placeholder="例如：本周日" /></label>
              <label className="full-field">具体说明<textarea name="description" required placeholder="已有材料、希望得到什么、哪些部分需要帮助…" /></label>
              <label className="full-field">联系方式<input name="contact" required placeholder="手机号或微信号（不会直接公开）" /></label>
              <label className="consent-field full-field"><input type="checkbox" name="individualConfirmed" required /><span>我确认这是本人的真实需求，不代表机构、中介、代理，也不会将联系结果转卖给他人。</span></label>
              <label className="consent-field full-field"><input type="checkbox" name="consent" required /><span>我同意平台保存资料用于需求审核和双方同意后的连接；本需求不涉及代写、替考或学术不端。</span></label>
              <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />
              <button className="primary-button full-field" disabled={submitting}>{submitting ? "正在提交…" : "免费提交需求"}</button>
              {error && <small className="form-error full-field">{error}</small>}
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function ExperienceModal({
  submitted,
  submitting,
  error,
  onSubmit,
  onClose,
}: {
  submitted: boolean;
  submitting: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="overlay">
      <section className="form-modal">
        <button className="close-button" onClick={onClose} aria-label="关闭">×</button>
        {submitted ? (
          <SuccessState title="经验已提交审核" text="审核通过后会出现在学习心得区。平台不会要求你把经验写成长文或完整教程。" onClose={onClose} />
        ) : (
          <>
            <span className="eyebrow">分享学习心得</span>
            <h2>写下一次真实尝试</h2>
            <p className="modal-note">不要求长文：遇到什么、怎么做、结果怎样，说清楚即可。</p>
            <form onSubmit={onSubmit}>
              <label>署名<input name="authorName" required placeholder="昵称即可" /></label>
              <label>学校<input name="university" required placeholder="例如：四川大学" /></label>
              <label className="full-field">标题<input name="title" required placeholder="例如：我如何整理大学四年的文件" /></label>
              <label>分类<input name="category" required placeholder="例如：效率方法" /></label>
              <label>公开链接（选填）<input name="sourceUrl" type="url" placeholder="https://" /></label>
              <label className="full-field">一句话摘要<textarea name="summary" required placeholder="最值得别人提前知道的一件事…" /></label>
              <label className="full-field">正文<textarea name="content" required placeholder="我遇到的问题 / 我尝试的方法 / 最后的变化…" /></label>
              <label className="consent-field full-field"><input type="checkbox" name="individualConfirmed" required /><span>我以个人身份投稿，不代表机构、中介、营销团队或代运营账号。</span></label>
              <label className="consent-field full-field"><input type="checkbox" name="consent" required /><span>这是我的原创经验，我同意平台审核并公开展示。</span></label>
              <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />
              <button className="primary-button full-field" disabled={submitting}>{submitting ? "正在提交…" : "提交经验"}</button>
              {error && <small className="form-error full-field">{error}</small>}
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function SuccessState({ title, text, onClose }: { title: string; text: string; onClose: () => void }) {
  return (
    <div className="success-state">
      <span>✓</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="primary-button" onClick={onClose}>知道了</button>
    </div>
  );
}

function Brand() {
  return (
    <a className="brand" href="#">
      <span className="brand-mark">技</span>
      <span>大学生技能交换所<small>个人对个人 · 严禁中介</small></span>
    </a>
  );
}
