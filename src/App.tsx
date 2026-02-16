import { useState } from "react";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Calendar, BarChart3, Settings, Plus, Search, X, Trash2, Check, Circle, Clock, AlertCircle, ChevronDown, ArrowLeft, MessageSquare, Paperclip, MoreHorizontal } from "lucide-react";

const P = { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a" };

const members = ["田中 美咲", "鈴木 大輝", "佐藤 健太", "山田 花子", "伊藤 翔", "中村 あい", "小林 裕介"];
const statuses = ["未着手", "進行中", "レビュー", "完了"] as const;
const priorities = ["高", "中", "低"] as const;

type Status = typeof statuses[number];
type Priority = typeof priorities[number];

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

const statusColors: Record<Status, { bg: string; text: string; dot: string }> = {
  "未着手": { bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af" },
  "進行中": { bg: "#ecfdf5", text: "#059669", dot: "#10b981" },
  "レビュー": { bg: "#fefce8", text: "#ca8a04", dot: "#eab308" },
  "完了": { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
};
const priorityColors: Record<Priority, string> = { "高": "#ef4444", "中": "#f59e0b", "低": "#6b7280" };

const StatusIcon = ({ status, size = 14 }: { status: Status; size?: number }) => {
  switch (status) {
    case "未着手": return <Circle size={size} />;
    case "進行中": return <Clock size={size} />;
    case "レビュー": return <AlertCircle size={size} />;
    case "完了": return <Check size={size} />;
    default: return null;
  }
};

const initialProjects: Project[] = [
  { id: 1, name: "Webサイトリニューアル", status: "進行中", priority: "高", assignee: "田中 美咲", due: "2026-02-28", progress: 65,
    tasks: [
      { id: 101, title: "デザインカンプ作成", status: "完了", assignee: "田中 美咲", due: "2026-02-10" },
      { id: 102, title: "フロントエンド実装", status: "進行中", assignee: "鈴木 大輝", due: "2026-02-20" },
      { id: 103, title: "バックエンドAPI開発", status: "進行中", assignee: "伊藤 翔", due: "2026-02-22" },
      { id: 104, title: "結合テスト", status: "未着手", assignee: "佐藤 健太", due: "2026-02-26" },
      { id: 105, title: "本番デプロイ", status: "未着手", assignee: "鈴木 大輝", due: "2026-02-28" },
    ]},
  { id: 2, name: "モバイルアプリv2.0", status: "進行中", priority: "高", assignee: "鈴木 大輝", due: "2026-03-15", progress: 40,
    tasks: [
      { id: 201, title: "UI/UXリサーチ", status: "完了", assignee: "山田 花子", due: "2026-02-05" },
      { id: 202, title: "プロトタイプ作成", status: "完了", assignee: "山田 花子", due: "2026-02-15" },
      { id: 203, title: "iOS実装", status: "進行中", assignee: "鈴木 大輝", due: "2026-03-01" },
      { id: 204, title: "Android実装", status: "未着手", assignee: "伊藤 翔", due: "2026-03-05" },
      { id: 205, title: "QAテスト", status: "未着手", assignee: "佐藤 健太", due: "2026-03-12" },
    ]},
  { id: 3, name: "顧客管理システム改修", status: "レビュー", priority: "中", assignee: "佐藤 健太", due: "2026-02-20", progress: 90,
    tasks: [
      { id: 301, title: "要件定義", status: "完了", assignee: "佐藤 健太", due: "2026-01-20" },
      { id: 302, title: "DB設計変更", status: "完了", assignee: "伊藤 翔", due: "2026-02-01" },
      { id: 303, title: "画面改修", status: "完了", assignee: "田中 美咲", due: "2026-02-10" },
      { id: 304, title: "コードレビュー", status: "レビュー", assignee: "鈴木 大輝", due: "2026-02-18" },
    ]},
  { id: 4, name: "社内ポータル構築", status: "未着手", priority: "低", assignee: "山田 花子", due: "2026-04-01", progress: 0,
    tasks: [
      { id: 401, title: "要件ヒアリング", status: "未着手", assignee: "山田 花子", due: "2026-03-01" },
      { id: 402, title: "技術選定", status: "未着手", assignee: "伊藤 翔", due: "2026-03-10" },
    ]},
  { id: 5, name: "API基盤マイグレーション", status: "進行中", priority: "高", assignee: "伊藤 翔", due: "2026-03-10", progress: 55,
    tasks: [
      { id: 501, title: "現行API調査", status: "完了", assignee: "伊藤 翔", due: "2026-02-01" },
      { id: 502, title: "新基盤設計", status: "完了", assignee: "伊藤 翔", due: "2026-02-10" },
      { id: 503, title: "マイグレーション実装", status: "進行中", assignee: "鈴木 大輝", due: "2026-02-28" },
      { id: 504, title: "負荷テスト", status: "未着手", assignee: "佐藤 健太", due: "2026-03-05" },
    ]},
  { id: 6, name: "セキュリティ監査対応", status: "完了", priority: "中", assignee: "中村 あい", due: "2026-02-10", progress: 100,
    tasks: [
      { id: 601, title: "脆弱性スキャン", status: "完了", assignee: "中村 あい", due: "2026-01-25" },
      { id: 602, title: "レポート作成", status: "完了", assignee: "中村 あい", due: "2026-02-05" },
      { id: 603, title: "改善対応", status: "完了", assignee: "伊藤 翔", due: "2026-02-10" },
    ]},
  { id: 7, name: "データ分析基盤構築", status: "未着手", priority: "中", assignee: "小林 裕介", due: "2026-04-15", progress: 0,
    tasks: [
      { id: 701, title: "要件整理", status: "未着手", assignee: "小林 裕介", due: "2026-03-15" },
      { id: 702, title: "ツール選定", status: "未着手", assignee: "小林 裕介", due: "2026-03-25" },
    ]},
];

const navItems = [
  { icon: LayoutDashboard, label: "ダッシュボード" },
  { icon: FolderKanban, label: "プロジェクト" },
  { icon: CheckSquare, label: "タスク" },
  { icon: Users, label: "メンバー" },
  { icon: Calendar, label: "スケジュール" },
  { icon: BarChart3, label: "レポート" },
  { icon: Settings, label: "設定" },
];

interface ProjectListPageProps {
  projects: Project[];
  onSelectProject: (id: number) => void;
  onAddAndNavigate: (project: Project) => void;
}

function ProjectListPage({ projects, onSelectProject, onAddAndNavigate }: ProjectListPageProps) {
  const [filterStatus, setFilterStatus] = useState<Status | "すべて">("すべて");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, "id" | "progress" | "tasks">>({
    name: "",
    status: "未着手" as const,
    priority: "中" as const,
    assignee: members[0] ?? "",
    due: "2026-04-01"
  });
  const [notification, setNotification] = useState<string | null>(null);

  const showNotif = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 2500); };

  const filtered = projects.filter(p => {
    const ms = filterStatus === "すべて" || p.status === filterStatus;
    const mq = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.assignee.includes(searchQuery);
    return ms && mq;
  });

  const handleAdd = () => {
    if (!newProject.name.trim()) return;
    const np = { ...newProject, id: Date.now(), progress: 0, tasks: [] };
    onAddAndNavigate(np);
    setShowAddModal(false);
    setNewProject({ name: "", status: "未着手", priority: "中", assignee: members[0], due: "2026-04-01" });
  };

  const counts = { all: projects.length, active: projects.filter(p => p.status === "進行中").length, review: projects.filter(p => p.status === "レビュー").length, done: projects.filter(p => p.status === "完了").length };

  return (
    <>
      <div style={{ padding: "16px 28px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>プロジェクト一覧</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>全 {counts.all} 件 ・ 進行中 {counts.active} 件 ・ レビュー {counts.review} 件 ・ 完了 {counts.done} 件</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ padding: "9px 18px", background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: `0 2px 8px ${P[500]}50` }}>
          <Plus size={16} /> 新規プロジェクト
        </button>
      </div>

      <div style={{ padding: "12px 28px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={15} style={{ position: "absolute", left: 12, color: "#94a3b8" }} />
          <input type="text" placeholder="プロジェクトを検索..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: "8px 14px 8px 36px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, width: 260, outline: "none", background: "#f8fafc" }} />
        </div>
        {["すべて", ...statuses].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
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
                {["プロジェクト名", "ステータス", "優先度", "担当者", "期限", "進捗"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 13 }} onClick={() => onSelectProject(p.id)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: P[700], cursor: "pointer" }}>
                      <FolderKanban size={15} style={{ color: "#94a3b8", flexShrink: 0 }} />
                      <span style={{ borderBottom: "1px solid transparent", transition: "border-color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = P[700]}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                      >{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, background: statusColors[p.status].bg, color: statusColors[p.status].text }}>
                      <StatusIcon status={p.status} size={13} /> {p.status}
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
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>該当するプロジェクトがありません</div>}
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}><Plus size={20} style={{ color: P[500] }} /> 新規プロジェクト</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>プロジェクト名</label>
                <input type="text" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} placeholder="プロジェクト名を入力" style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>ステータス</label>
                  <select value={newProject.status} onChange={e => setNewProject({ ...newProject, status: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>優先度</label>
                  <select value={newProject.priority} onChange={e => setNewProject({ ...newProject, priority: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}>
                    {priorities.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>担当者</label>
                  <select value={newProject.assignee} onChange={e => setNewProject({ ...newProject, assignee: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}>
                    {members.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>期限</label>
                  <input type="date" value={newProject.due} onChange={e => setNewProject({ ...newProject, due: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setShowAddModal(false)} style={{ padding: "10px 20px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>キャンセル</button>
                <button onClick={handleAdd} style={{ padding: "10px 20px", background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 2px 8px ${P[500]}50`, display: "flex", alignItems: "center", gap: 6 }}><Check size={15} /> 作成する</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#0f172a", color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 100, display: "flex", alignItems: "center", gap: 8 }}>
          <Check size={15} style={{ color: P[400] }} /> {notification}
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
}

function ProjectDetailPage({ project, onBack, onUpdateTask, onAddTask }: ProjectDetailPageProps) {
  const [comment, setComment] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    status: "未着手" as const,
    assignee: members[0] ?? "",
    due: new Date().toISOString().split('T')[0] ?? "2026-02-20"
  });
  const taskCounts = { all: project.tasks.length, done: project.tasks.filter(t => t.status === "完了").length };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = { ...newTask, id: Date.now() };
    onAddTask(project.id, task);
    setShowAddTaskModal(false);
    setNewTask({
      title: "",
      status: "未着手" as const,
      assignee: members[0] ?? "",
      due: new Date().toISOString().split('T')[0] ?? "2026-02-20"
    });
  };

  return (
    <>
      <div style={{ padding: "16px 28px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: P[600], fontSize: 13, fontWeight: 500, padding: "4px 0" }}>
            <ArrowLeft size={16} /> プロジェクト一覧
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{project.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, background: statusColors[project.status].bg, color: statusColors[project.status].text }}>
                <StatusIcon status={project.status} size={13} /> {project.status}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: priorityColors[project.priority] }}>
                <AlertCircle size={13} /> 優先度: {project.priority}
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
            <div style={{ fontSize: 12, color: "#64748b" }}>{taskCounts.done} / {taskCounts.all} タスク完了</div>
          </div>
        </div>
        <div style={{ marginTop: 12, height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${project.progress}%`, background: project.progress === 100 ? "#22c55e" : `linear-gradient(90deg, ${P[500]}, ${P[400]})`, borderRadius: 3 }}></div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>タスク一覧</h2>
          <button onClick={() => setShowAddTaskModal(true)} style={{ padding: "8px 16px", background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: `0 2px 8px ${P[500]}50` }}>
            <Plus size={16} /> 新規タスク
          </button>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                {["タスク名", "ステータス", "担当者", "期限"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: 0.5 }}>{h}</th>
                ))}
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map(t => (
                <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckSquare size={15} style={{ color: t.status === "完了" ? "#22c55e" : "#cbd5e1", flexShrink: 0 }} />
                      <span style={{ textDecoration: t.status === "完了" ? "line-through" : "none", color: t.status === "完了" ? "#94a3b8" : "#1e293b" }}>{t.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <select value={t.status} onChange={e => onUpdateTask(project.id, t.id, e.target.value)}
                      style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, background: statusColors[t.status].bg, color: statusColors[t.status].text, cursor: "pointer", outline: "none", fontWeight: 500 }}>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${P[500]}, ${P[300]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#fff", flexShrink: 0 }}>{t.assignee.slice(0, 1)}</div>
                      {t.assignee}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={13} /> {t.due}</div>
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
            <MessageSquare size={18} style={{ color: P[500] }} /> アクティビティ
          </h2>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${P[500]}, ${P[300]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", flexShrink: 0 }}>TM</div>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="コメントを入力..." value={comment} onChange={e => setComment(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                  <button style={{ padding: "6px 10px", background: "none", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", color: "#64748b" }}>
                    <Paperclip size={14} />
                  </button>
                  <button onClick={() => { if (comment.trim()) setComment(""); }}
                    style={{ padding: "6px 16px", background: P[500], color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>送信</button>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: P[100], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: P[700], flexShrink: 0 }}>SD</div>
                <div>
                  <div style={{ fontSize: 13 }}><strong>鈴木 大輝</strong>がステータスを<span style={{ color: P[600], fontWeight: 500 }}>「進行中」</span>に変更しました</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>2時間前</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: P[100], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: P[700], flexShrink: 0 }}>TM</div>
                <div>
                  <div style={{ fontSize: 13 }}><strong>田中 美咲</strong>がタスク「デザインカンプ作成」を完了しました</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>昨日</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddTaskModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <Plus size={20} style={{ color: P[500] }} /> 新規タスク
              </h2>
              <button onClick={() => setShowAddTaskModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>タスク名</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="タスク名を入力"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f8fafc" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>ステータス</label>
                  <select
                    value={newTask.status}
                    onChange={e => setNewTask({ ...newTask, status: e.target.value as Status })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>担当者</label>
                  <select
                    value={newTask.assignee}
                    onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", cursor: "pointer", outline: "none" }}
                  >
                    {members.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>期限</label>
                <input
                  type="date"
                  value={newTask.due}
                  onChange={e => setNewTask({ ...newTask, due: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  style={{ padding: "10px 20px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddTask}
                  style={{ padding: "10px 20px", background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 2px 8px ${P[500]}50`, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Check size={15} /> 作成する
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
  const [projects, setProjects] = useState(initialProjects);
  const [activeNav, setActiveNav] = useState("プロジェクト");
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
      const tasks = p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
      const done = tasks.filter(t => t.status === "完了").length;
      const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
      return { ...p, tasks, progress };
    }));
  };

  const handleAddTask = (projectId: number, task: Task) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      const tasks = [...p.tasks, task];
      const done = tasks.filter(t => t.status === "完了").length;
      const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
      return { ...p, tasks, progress };
    }));
  };

  const currentProject = projects.find(p => p.id === currentProjectId);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', 'Hiragino Sans', 'Noto Sans JP', sans-serif", background: "#f8fafc", color: "#1e293b", fontSize: 14 }}>
      <div style={{ width: 240, background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", color: "#e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${P[500]}, ${P[400]})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#fff" }}>P</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>ProjectFlow</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>プロジェクト管理</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: "12px 8px", flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} onClick={() => { setActiveNav(item.label); if (item.label === "プロジェクト") handleBack(); }}
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
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${P[500]}, ${P[300]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#fff" }}>TM</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>田中 美咲</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>管理者</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {currentPage === "list" && <ProjectListPage projects={projects} onSelectProject={handleSelectProject} onAddAndNavigate={handleAddAndNavigate} />}
        {currentPage === "detail" && currentProject && <ProjectDetailPage project={currentProject} onBack={handleBack} onUpdateTask={handleUpdateTask} onAddTask={handleAddTask} />}
      </div>
    </div>
  );
}
