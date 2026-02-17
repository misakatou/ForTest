import { useState, useMemo } from "react";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Calendar, BarChart3, Settings, Plus, Search, X, Check, Circle, Clock, AlertCircle, ArrowLeft, MessageSquare, Paperclip, MoreHorizontal } from "lucide-react";
import { Language, translations, getLanguageFromURL } from "./i18n";

const P = { 50: "#f0f4f8", 100: "#d9e2ec", 200: "#bcccdc", 300: "#9fb3c8", 400: "#829ab1", 500: "#627d98", 600: "#486581", 700: "#334e68", 800: "#243b53", 900: "#102a43" };

type Status = typeof translations.ja.statuses[number] | typeof translations.en.statuses[number];
type Priority = typeof translations.ja.priorities[number] | typeof translations.en.priorities[number];

interface Task {
  id: number;
  title: string;
  status: Status;
  assignee: string;
  due: string;
}

interface Project {
  id: number;
  name: string;
  status: Status;
  priority: Priority;
  assignee: string;
  due: string;
  progress: number;
  tasks: Task[];
}

const getInitialProjects = (lang: Language): Project[] => {
  const t = translations[lang];
  if (lang === "en") {
    return [
      { id: 1, name: "Website Renewal", status: t.statuses[1], priority: t.priorities[0], assignee: t.members[0], due: "2026-02-28", progress: 65,
        tasks: [
          { id: 101, title: "Create Design Mockup", status: t.statuses[3], assignee: t.members[0], due: "2026-02-10" },
          { id: 102, title: "Frontend Implementation", status: t.statuses[1], assignee: t.members[1], due: "2026-02-20" },
          { id: 103, title: "Backend API Development", status: t.statuses[1], assignee: t.members[4], due: "2026-02-22" },
          { id: 104, title: "Integration Testing", status: t.statuses[0], assignee: t.members[2], due: "2026-02-26" },
          { id: 105, title: "Production Deploy", status: t.statuses[0], assignee: t.members[1], due: "2026-02-28" },
        ]},
      { id: 2, name: "Mobile App v2.0", status: t.statuses[1], priority: t.priorities[0], assignee: t.members[1], due: "2026-03-15", progress: 40,
        tasks: [
          { id: 201, title: "UI/UX Research", status: t.statuses[3], assignee: t.members[3], due: "2026-02-05" },
          { id: 202, title: "Prototype Creation", status: t.statuses[3], assignee: t.members[3], due: "2026-02-15" },
          { id: 203, title: "iOS Implementation", status: t.statuses[1], assignee: t.members[1], due: "2026-03-01" },
          { id: 204, title: "Android Implementation", status: t.statuses[0], assignee: t.members[4], due: "2026-03-05" },
          { id: 205, title: "QA Testing", status: t.statuses[0], assignee: t.members[2], due: "2026-03-12" },
        ]},
      { id: 3, name: "CRM System Upgrade", status: t.statuses[2], priority: t.priorities[1], assignee: t.members[2], due: "2026-02-20", progress: 90,
        tasks: [
          { id: 301, title: "Requirements Definition", status: t.statuses[3], assignee: t.members[2], due: "2026-01-20" },
          { id: 302, title: "Database Design", status: t.statuses[3], assignee: t.members[4], due: "2026-02-01" },
          { id: 303, title: "UI Improvements", status: t.statuses[3], assignee: t.members[0], due: "2026-02-10" },
          { id: 304, title: "Code Review", status: t.statuses[2], assignee: t.members[1], due: "2026-02-18" },
        ]},
      { id: 4, name: "Internal Portal", status: t.statuses[0], priority: t.priorities[2], assignee: t.members[3], due: "2026-04-01", progress: 0,
        tasks: [
          { id: 401, title: "Requirements Gathering", status: t.statuses[0], assignee: t.members[3], due: "2026-03-01" },
          { id: 402, title: "Technology Selection", status: t.statuses[0], assignee: t.members[4], due: "2026-03-10" },
        ]},
      { id: 5, name: "API Infrastructure Migration", status: t.statuses[1], priority: t.priorities[0], assignee: t.members[4], due: "2026-03-10", progress: 55,
        tasks: [
          { id: 501, title: "Current API Analysis", status: t.statuses[3], assignee: t.members[4], due: "2026-02-01" },
          { id: 502, title: "New Platform Design", status: t.statuses[3], assignee: t.members[4], due: "2026-02-10" },
          { id: 503, title: "Migration Implementation", status: t.statuses[1], assignee: t.members[1], due: "2026-02-28" },
          { id: 504, title: "Load Testing", status: t.statuses[0], assignee: t.members[2], due: "2026-03-05" },
        ]},
      { id: 6, name: "Security Audit", status: t.statuses[3], priority: t.priorities[1], assignee: t.members[5], due: "2026-02-10", progress: 100,
        tasks: [
          { id: 601, title: "Vulnerability Scan", status: t.statuses[3], assignee: t.members[5], due: "2026-01-25" },
          { id: 602, title: "Report Creation", status: t.statuses[3], assignee: t.members[5], due: "2026-02-05" },
          { id: 603, title: "Remediation", status: t.statuses[3], assignee: t.members[4], due: "2026-02-10" },
        ]},
      { id: 7, name: "Analytics Platform", status: t.statuses[0], priority: t.priorities[1], assignee: t.members[6], due: "2026-04-15", progress: 0,
        tasks: [
          { id: 701, title: "Requirements Analysis", status: t.statuses[0], assignee: t.members[6], due: "2026-03-15" },
          { id: 702, title: "Tool Selection", status: t.statuses[0], assignee: t.members[6], due: "2026-03-25" },
        ]},
    ];
  } else {
    return [
      { id: 1, name: "Webサイトリニューアル", status: t.statuses[1], priority: t.priorities[0], assignee: t.members[0], due: "2026-02-28", progress: 65,
        tasks: [
          { id: 101, title: "デザインカンプ作成", status: t.statuses[3], assignee: t.members[0], due: "2026-02-10" },
          { id: 102, title: "フロントエンド実装", status: t.statuses[1], assignee: t.members[1], due: "2026-02-20" },
          { id: 103, title: "バックエンドAPI開発", status: t.statuses[1], assignee: t.members[4], due: "2026-02-22" },
          { id: 104, title: "結合テスト", status: t.statuses[0], assignee: t.members[2], due: "2026-02-26" },
          { id: 105, title: "本番デプロイ", status: t.statuses[0], assignee: t.members[1], due: "2026-02-28" },
        ]},
      { id: 2, name: "モバイルアプリv2.0", status: t.statuses[1], priority: t.priorities[0], assignee: t.members[1], due: "2026-03-15", progress: 40,
        tasks: [
          { id: 201, title: "UI/UXリサーチ", status: t.statuses[3], assignee: t.members[3], due: "2026-02-05" },
          { id: 202, title: "プロトタイプ作成", status: t.statuses[3], assignee: t.members[3], due: "2026-02-15" },
          { id: 203, title: "iOS実装", status: t.statuses[1], assignee: t.members[1], due: "2026-03-01" },
          { id: 204, title: "Android実装", status: t.statuses[0], assignee: t.members[4], due: "2026-03-05" },
          { id: 205, title: "QAテスト", status: t.statuses[0], assignee: t.members[2], due: "2026-03-12" },
        ]},
      { id: 3, name: "顧客管理システム改修", status: t.statuses[2], priority: t.priorities[1], assignee: t.members[2], due: "2026-02-20", progress: 90,
        tasks: [
          { id: 301, title: "要件定義", status: t.statuses[3], assignee: t.members[2], due: "2026-01-20" },
          { id: 302, title: "DB設計変更", status: t.statuses[3], assignee: t.members[4], due: "2026-02-01" },
          { id: 303, title: "画面改修", status: t.statuses[3], assignee: t.members[0], due: "2026-02-10" },
          { id: 304, title: "コードレビュー", status: t.statuses[2], assignee: t.members[1], due: "2026-02-18" },
        ]},
      { id: 4, name: "社内ポータル構築", status: t.statuses[0], priority: t.priorities[2], assignee: t.members[3], due: "2026-04-01", progress: 0,
        tasks: [
          { id: 401, title: "要件ヒアリング", status: t.statuses[0], assignee: t.members[3], due: "2026-03-01" },
          { id: 402, title: "技術選定", status: t.statuses[0], assignee: t.members[4], due: "2026-03-10" },
        ]},
      { id: 5, name: "API基盤マイグレーション", status: t.statuses[1], priority: t.priorities[0], assignee: t.members[4], due: "2026-03-10", progress: 55,
        tasks: [
          { id: 501, title: "現行API調査", status: t.statuses[3], assignee: t.members[4], due: "2026-02-01" },
          { id: 502, title: "新基盤設計", status: t.statuses[3], assignee: t.members[4], due: "2026-02-10" },
          { id: 503, title: "マイグレーション実装", status: t.statuses[1], assignee: t.members[1], due: "2026-02-28" },
          { id: 504, title: "負荷テスト", status: t.statuses[0], assignee: t.members[2], due: "2026-03-05" },
        ]},
      { id: 6, name: "セキュリティ監査対応", status: t.statuses[3], priority: t.priorities[1], assignee: t.members[5], due: "2026-02-10", progress: 100,
        tasks: [
          { id: 601, title: "脆弱性スキャン", status: t.statuses[3], assignee: t.members[5], due: "2026-01-25" },
          { id: 602, title: "レポート作成", status: t.statuses[3], assignee: t.members[5], due: "2026-02-05" },
          { id: 603, title: "改善対応", status: t.statuses[3], assignee: t.members[4], due: "2026-02-10" },
        ]},
      { id: 7, name: "データ分析基盤構築", status: t.statuses[0], priority: t.priorities[1], assignee: t.members[6], due: "2026-04-15", progress: 0,
        tasks: [
          { id: 701, title: "要件整理", status: t.statuses[0], assignee: t.members[6], due: "2026-03-15" },
          { id: 702, title: "ツール選定", status: t.statuses[0], assignee: t.members[6], due: "2026-03-25" },
        ]},
    ];
  }
};

const getStatusColors = (lang: Language): Record<string, { bg: string; text: string; dot: string }> => {
  const t = translations[lang];
  return {
    [t.statuses[0]]: { bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af" },
    [t.statuses[1]]: { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
    [t.statuses[2]]: { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
    [t.statuses[3]]: { bg: "#ecfdf5", text: "#059669", dot: "#10b981" },
  };
};

const getPriorityColors = (lang: Language): Record<string, string> => {
  const t = translations[lang];
  return {
    [t.priorities[0]]: "#ef4444",
    [t.priorities[1]]: "#f59e0b",
    [t.priorities[2]]: "#6b7280",
  };
};

const StatusIcon = ({ status, statuses, size = 14 }: { status: Status; statuses: readonly string[]; size?: number }) => {
  if (status === statuses[0]) return <Circle size={size} />;
  if (status === statuses[1]) return <Clock size={size} />;
  if (status === statuses[2]) return <AlertCircle size={size} />;
  if (status === statuses[3]) return <Check size={size} />;
  return null;
};

interface ProjectListPageProps {
  projects: Project[];
  onSelectProject: (id: number) => void;
  onAddAndNavigate: (project: Project) => void;
  t: typeof translations.ja;
  statusColors: Record<string, { bg: string; text: string; dot: string }>;
  priorityColors: Record<string, string>;
}

function ProjectListPage({ projects, onSelectProject, onAddAndNavigate, t, statusColors, priorityColors }: ProjectListPageProps) {
  const [filterStatus, setFilterStatus] = useState<Status | string>(t.projectList.all);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, "id" | "progress" | "tasks">>({
    name: "",
    status: t.statuses[0] as Status,
    priority: t.priorities[1] as Priority,
    assignee: t.members[0] ?? "",
    due: "2026-04-01"
  });

  const filtered = projects.filter(p => {
    const ms = filterStatus === t.projectList.all || p.status === filterStatus;
    const mq = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.assignee.includes(searchQuery);
    return ms && mq;
  });

  const handleAdd = () => {
    if (!newProject.name.trim()) return;
    const np = { ...newProject, id: Date.now(), progress: 0, tasks: [] };
    onAddAndNavigate(np);
    setShowAddModal(false);
    setNewProject({ name: "", status: t.statuses[0] as Status, priority: t.priorities[1] as Priority, assignee: t.members[0], due: "2026-04-01" });
  };

  const counts = {
    all: projects.length,
    active: projects.filter(p => p.status === t.statuses[1]).length,
    review: projects.filter(p => p.status === t.statuses[2]).length,
    done: projects.filter(p => p.status === t.statuses[3]).length
  };

  return (
    <>
      <div style={{ padding: "16px 28px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{t.projectList.title}</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{t.projectList.countText(counts.all, counts.active, counts.review, counts.done)}</p>
        </div>
        <button data-testid="add-project-button" onClick={() => setShowAddModal(true)} style={{ padding: "9px 18px", background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: `0 2px 8px ${P[500]}50` }}>
          <Plus size={16} /> {t.projectList.newProject}
        </button>
      </div>

      <div style={{ padding: "12px 28px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={15} style={{ position: "absolute", left: 12, color: "#94a3b8" }} />
          <input data-testid="search-input" type="text" placeholder={t.projectList.search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: "8px 14px 8px 36px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, width: 260, outline: "none", background: "#f8fafc" }} />
        </div>
        {[t.projectList.all, ...t.statuses].map(s => (
          <button key={s} data-testid={`filter-${s}`} onClick={() => setFilterStatus(s)} style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid", fontSize: 12, fontWeight: 500, cursor: "pointer",
            background: filterStatus === s ? P[500] : "#fff", color: filterStatus === s ? "#fff" : "#64748b", borderColor: filterStatus === s ? P[500] : "#e2e8f0",
          }}>{s}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                {[t.projectList.columns.name, t.projectList.columns.status, t.projectList.columns.priority, t.projectList.columns.assignee, t.projectList.columns.due, t.projectList.columns.progress].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} data-testid={`project-row-${p.id}`} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 13 }} onClick={() => onSelectProject(p.id)}>
                    <div data-testid={`project-name-${p.id}`} style={{ display: "flex", alignItems: "center", gap: 8, color: P[700], cursor: "pointer" }}>
                      <FolderKanban size={15} style={{ color: "#94a3b8", flexShrink: 0 }} />
                      <span style={{ borderBottom: "1px solid transparent", transition: "border-color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = P[700]}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                      >{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, background: statusColors[p.status].bg, color: statusColors[p.status].text }}>
                      <StatusIcon status={p.status} statuses={t.statuses} size={13} /> {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: priorityColors[p.priority] }}>
                      <AlertCircle size={13} /> {p.priority}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${P[500]}, ${P[300]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#fff", flexShrink: 0 }}>{p.assignee.slice(0, 1)}</div>
                      {p.assignee}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={13} /> {p.due}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${p.progress}%`, background: p.progress === 100 ? "#22c55e" : `linear-gradient(90deg, ${P[500]}, ${P[400]})`, borderRadius: 3 }}></div>
                      </div>
                      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500, minWidth: 32 }}>{p.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>{t.projectList.noResults}</div>}
        </div>
      </div>

      {showAddModal && (
        <div data-testid="add-project-modal" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}><Plus size={20} style={{ color: P[500] }} /> {t.projectModal.title}</h2>
              <button data-testid="modal-close-button" onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{t.projectModal.nameLabel}</label>
                <input data-testid="project-name-input" type="text" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} placeholder={t.projectModal.namePlaceholder} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{t.projectModal.statusLabel}</label>
                  <select data-testid="project-status-select" value={newProject.status} onChange={e => setNewProject({ ...newProject, status: e.target.value as Status })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}>
                    {t.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{t.projectModal.priorityLabel}</label>
                  <select data-testid="project-priority-select" value={newProject.priority} onChange={e => setNewProject({ ...newProject, priority: e.target.value as Priority })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}>
                    {t.priorities.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{t.projectModal.assigneeLabel}</label>
                  <select data-testid="project-assignee-select" value={newProject.assignee} onChange={e => setNewProject({ ...newProject, assignee: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}>
                    {t.members.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{t.projectModal.dueLabel}</label>
                  <input data-testid="project-due-input" type="date" value={newProject.due} onChange={e => setNewProject({ ...newProject, due: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8, justifyContent: "flex-end" }}>
                <button data-testid="cancel-button" onClick={() => setShowAddModal(false)} style={{ padding: "10px 20px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{t.projectModal.cancel}</button>
                <button data-testid="submit-project-button" onClick={handleAdd} style={{ padding: "10px 20px", background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 2px 8px ${P[500]}50`, display: "flex", alignItems: "center", gap: 6 }}><Check size={15} /> {t.projectModal.submit}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onUpdateTask: (projectId: number, taskId: number, newStatus: Status) => void;
  onAddTask: (projectId: number, task: Task) => void;
  t: typeof translations.ja;
  statusColors: Record<string, { bg: string; text: string; dot: string }>;
  priorityColors: Record<string, string>;
}

function ProjectDetailPage({ project, onBack, onUpdateTask, onAddTask, t, statusColors, priorityColors }: ProjectDetailPageProps) {
  const [comment, setComment] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    status: t.statuses[0] as Status,
    assignee: t.members[0] ?? "",
    due: new Date().toISOString().split('T')[0] ?? "2026-02-20"
  });
  const taskCounts = { all: project.tasks.length, done: project.tasks.filter(task => task.status === t.statuses[3]).length };
  const isEnglish = t.statuses[0] !== "未着手";

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = { ...newTask, id: Date.now() };
    onAddTask(project.id, task);
    setShowAddTaskModal(false);
    setNewTask({
      title: "",
      status: t.statuses[0] as Status,
      assignee: t.members[0] ?? "",
      due: new Date().toISOString().split('T')[0] ?? "2026-02-20"
    });
  };

  return (
    <>
      <div style={{ padding: "16px 28px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <button data-testid="back-button" onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: P[600], fontSize: 13, fontWeight: 500, padding: "4px 0" }}>
            <ArrowLeft size={16} /> {t.projectDetail.backToList}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{project.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, background: statusColors[project.status].bg, color: statusColors[project.status].text }}>
                <StatusIcon status={project.status} statuses={t.statuses} size={13} /> {project.status}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: priorityColors[project.priority] }}>
                <AlertCircle size={13} /> {t.projectDetail.priorityLabel}: {project.priority}
              </span>
              <span style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={13} /> {project.assignee}
              </span>
              <span style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                <Calendar size={13} /> {project.due}
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: project.progress === 100 ? "#22c55e" : P[500] }}>{project.progress}%</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{t.projectDetail.taskCompleted(taskCounts.done, taskCounts.all)}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${project.progress}%`, background: project.progress === 100 ? "#22c55e" : `linear-gradient(90deg, ${P[500]}, ${P[400]})`, borderRadius: 3 }}></div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{t.projectDetail.tasksTitle}</h2>
          <button data-testid="add-task-button" onClick={() => setShowAddTaskModal(true)} style={{ padding: "8px 16px", background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: `0 2px 8px ${P[500]}50` }}>
            <Plus size={16} /> {t.projectDetail.newTask}
          </button>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                {[t.projectDetail.columns.name, t.projectDetail.columns.status, t.projectDetail.columns.assignee, t.projectDetail.columns.due].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: 0.5 }}>{h}</th>
                ))}
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map(task => (
                <tr key={task.id} data-testid={`task-row-${task.id}`} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckSquare size={15} style={{ color: task.status === t.statuses[3] ? "#22c55e" : "#cbd5e1", flexShrink: 0 }} />
                      <span style={{ textDecoration: task.status === t.statuses[3] ? "line-through" : "none", color: task.status === t.statuses[3] ? "#94a3b8" : "#1e293b" }}>{task.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <select data-testid={`task-status-${task.id}`} value={task.status} onChange={e => onUpdateTask(project.id, task.id, e.target.value as Status)}
                      style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, background: statusColors[task.status].bg, color: statusColors[task.status].text, cursor: "pointer", outline: "none", fontWeight: 500 }}>
                      {t.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${P[500]}, ${P[300]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#fff", flexShrink: 0 }}>{task.assignee.slice(0, 1)}</div>
                      {task.assignee}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={13} /> {task.due}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 4 }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 24 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <MessageSquare size={18} style={{ color: P[500] }} /> {t.projectDetail.activity}
          </h2>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${P[500]}, ${P[300]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", flexShrink: 0 }}>{t.currentUser.slice(0, 1)}</div>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder={t.projectDetail.commentPlaceholder} value={comment} onChange={e => setComment(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                  <button style={{ padding: "6px 10px", background: "none", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", color: "#64748b" }}>
                    <Paperclip size={14} />
                  </button>
                  <button onClick={() => { if (comment.trim()) setComment(""); }}
                    style={{ padding: "6px 16px", background: P[500], color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.projectDetail.send}</button>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: P[100], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: P[700], flexShrink: 0 }}>{t.members[1].slice(0, 1)}</div>
                <div>
                  <div style={{ fontSize: 13 }}><strong>{t.members[1]}</strong>{isEnglish ? " changed status to " : "がステータスを"}<span style={{ color: P[600], fontWeight: 500 }}>{isEnglish ? `"${t.statuses[1]}"` : `「${t.statuses[1]}」`}</span>{isEnglish ? "" : "に変更しました"}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{isEnglish ? "2 hours ago" : "2時間前"}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: P[100], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: P[700], flexShrink: 0 }}>{t.currentUser.slice(0, 1)}</div>
                <div>
                  <div style={{ fontSize: 13 }}><strong>{t.currentUser}</strong>{isEnglish ? " completed task \"Create Design Mockup\"" : "がタスク「デザインカンプ作成」を完了しました"}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{isEnglish ? "yesterday" : "昨日"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddTaskModal && (
        <div data-testid="add-task-modal" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <Plus size={20} style={{ color: P[500] }} /> {t.taskModal.title}
              </h2>
              <button data-testid="task-modal-close-button" onClick={() => setShowAddTaskModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{t.taskModal.nameLabel}</label>
                <input
                  data-testid="task-title-input"
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder={t.taskModal.namePlaceholder}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f8fafc" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{t.taskModal.statusLabel}</label>
                  <select
                    data-testid="task-status-select"
                    value={newTask.status}
                    onChange={e => setNewTask({ ...newTask, status: e.target.value as Status })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}
                  >
                    {t.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{t.taskModal.assigneeLabel}</label>
                  <select
                    data-testid="task-assignee-select"
                    value={newTask.assignee}
                    onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}
                  >
                    {t.members.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{t.taskModal.dueLabel}</label>
                <input
                  data-testid="task-due-input"
                  type="date"
                  value={newTask.due}
                  onChange={e => setNewTask({ ...newTask, due: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8, justifyContent: "flex-end" }}>
                <button
                  data-testid="task-cancel-button"
                  onClick={() => setShowAddTaskModal(false)}
                  style={{ padding: "10px 20px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                >
                  {t.taskModal.cancel}
                </button>
                <button
                  data-testid="submit-task-button"
                  onClick={handleAddTask}
                  style={{ padding: "10px 20px", background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 2px 8px ${P[500]}50`, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Check size={15} /> {t.taskModal.submit}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [lang] = useState<Language>(() => getLanguageFromURL());
  const t = translations[lang];
  const statusColors = useMemo(() => getStatusColors(lang), [lang]);
  const priorityColors = useMemo(() => getPriorityColors(lang), [lang]);

  const [projects, setProjects] = useState(() => getInitialProjects(lang));
  const [activeNav, setActiveNav] = useState(t.nav.projects);
  const [currentPage, setCurrentPage] = useState<"list" | "detail">("list");
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);

  const handleSelectProject = (id: number) => { setCurrentProjectId(id); setCurrentPage("detail"); };
  const handleBack = () => { setCurrentPage("list"); setCurrentProjectId(null); };
  const handleAddAndNavigate = (p: Project) => {
    setProjects([p, ...projects]);
    setCurrentProjectId(p.id);
    setCurrentPage("detail");
  };

  const handleUpdateTask = (projectId: number, taskId: number, newStatus: Status) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      const tasks = p.tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task);
      const done = tasks.filter(task => task.status === t.statuses[3]).length;
      const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
      return { ...p, tasks, progress };
    }));
  };

  const handleAddTask = (projectId: number, task: Task) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      const tasks = [...p.tasks, task];
      const done = tasks.filter(task => task.status === t.statuses[3]).length;
      const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
      return { ...p, tasks, progress };
    }));
  };

  const currentProject = projects.find(p => p.id === currentProjectId);

  const navItems = [
    { icon: LayoutDashboard, label: t.nav.dashboard },
    { icon: FolderKanban, label: t.nav.projects },
    { icon: CheckSquare, label: t.nav.tasks },
    { icon: Users, label: t.nav.members },
    { icon: Calendar, label: t.nav.schedule },
    { icon: BarChart3, label: t.nav.reports },
    { icon: Settings, label: t.nav.settings },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', 'Hiragino Sans', 'Noto Sans JP', sans-serif", background: "#f8fafc", color: "#1e293b", fontSize: 14 }}>
      <div style={{ width: 240, background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", color: "#e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#fff" }}>P</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{t.appName}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{t.appSubtitle}</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: "12px 8px", flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} data-testid={`nav-${item.label}`} onClick={() => { setActiveNav(item.label); if (item.label === t.nav.projects) handleBack(); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 2,
                  background: activeNav === item.label ? "rgba(255,255,255,0.08)" : "transparent",
                  color: activeNav === item.label ? "#fff" : "#94a3b8",
                  fontWeight: activeNav === item.label ? 600 : 400, transition: "all 0.15s",
                }}>
                <Icon size={18} />
                <span style={{ fontSize: 13 }}>{item.label}</span>
              </div>
            );
          })}
        </nav>
        <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${P[500]}, ${P[300]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#fff" }}>{t.currentUser.slice(0, 1)}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{t.currentUser}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{t.currentUserRole}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {currentPage === "list" && <ProjectListPage projects={projects} onSelectProject={handleSelectProject} onAddAndNavigate={handleAddAndNavigate} t={t} statusColors={statusColors} priorityColors={priorityColors} />}
        {currentPage === "detail" && currentProject && <ProjectDetailPage project={currentProject} onBack={handleBack} onUpdateTask={handleUpdateTask} onAddTask={handleAddTask} t={t} statusColors={statusColors} priorityColors={priorityColors} />}
      </div>
    </div>
  );
}
