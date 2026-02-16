export type Language = "ja" | "en";

type TranslationConfig = {
  statuses: readonly [string, string, string, string];
  priorities: readonly [string, string, string];
  members: string[];
  nav: {
    dashboard: string;
    projects: string;
    tasks: string;
    members: string;
    schedule: string;
    reports: string;
    settings: string;
  };
  projectList: {
    title: string;
    countText: (all: number, active: number, review: number, done: number) => string;
    newProject: string;
    search: string;
    all: string;
    columns: {
      name: string;
      status: string;
      priority: string;
      assignee: string;
      due: string;
      progress: string;
    };
    noResults: string;
  };
  projectModal: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    statusLabel: string;
    priorityLabel: string;
    assigneeLabel: string;
    dueLabel: string;
    cancel: string;
    submit: string;
  };
  projectDetail: {
    backToList: string;
    priorityLabel: string;
    tasksTitle: string;
    newTask: string;
    taskCompleted: (done: number, all: number) => string;
    columns: {
      name: string;
      status: string;
      assignee: string;
      due: string;
    };
    activity: string;
    commentPlaceholder: string;
    send: string;
  };
  taskModal: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    statusLabel: string;
    assigneeLabel: string;
    dueLabel: string;
    cancel: string;
    submit: string;
  };
  appName: string;
  appSubtitle: string;
  currentUser: string;
  currentUserRole: string;
};

export const translations: Record<Language, TranslationConfig> = {
  ja: {
    statuses: ["未着手", "進行中", "レビュー", "完了"],
    priorities: ["高", "中", "低"],
    members: ["田中 美咲", "鈴木 大輝", "佐藤 健太", "山田 花子", "伊藤 翔", "中村 あい", "小林 裕介"],
    nav: {
      dashboard: "ダッシュボード",
      projects: "プロジェクト",
      tasks: "タスク",
      members: "メンバー",
      schedule: "スケジュール",
      reports: "レポート",
      settings: "設定",
    },
    projectList: {
      title: "プロジェクト一覧",
      countText: (all: number, active: number, review: number, done: number) =>
        `全 ${all} 件 ・ 進行中 ${active} 件 ・ レビュー ${review} 件 ・ 完了 ${done} 件`,
      newProject: "新規プロジェクト",
      search: "プロジェクトを検索...",
      all: "すべて",
      columns: {
        name: "プロジェクト名",
        status: "ステータス",
        priority: "優先度",
        assignee: "担当者",
        due: "期限",
        progress: "進捗",
      },
      noResults: "該当するプロジェクトがありません",
    },
    projectModal: {
      title: "新規プロジェクト",
      nameLabel: "プロジェクト名",
      namePlaceholder: "プロジェクト名を入力",
      statusLabel: "ステータス",
      priorityLabel: "優先度",
      assigneeLabel: "担当者",
      dueLabel: "期限",
      cancel: "キャンセル",
      submit: "作成する",
    },
    projectDetail: {
      backToList: "プロジェクト一覧",
      priorityLabel: "優先度",
      tasksTitle: "タスク一覧",
      newTask: "新規タスク",
      taskCompleted: (done: number, all: number) => `${done} / ${all} タスク完了`,
      columns: {
        name: "タスク名",
        status: "ステータス",
        assignee: "担当者",
        due: "期限",
      },
      activity: "アクティビティ",
      commentPlaceholder: "コメントを入力...",
      send: "送信",
    },
    taskModal: {
      title: "新規タスク",
      nameLabel: "タスク名",
      namePlaceholder: "タスク名を入力",
      statusLabel: "ステータス",
      assigneeLabel: "担当者",
      dueLabel: "期限",
      cancel: "キャンセル",
      submit: "作成する",
    },
    appName: "ProjectFlow",
    appSubtitle: "プロジェクト管理",
    currentUser: "田中 美咲",
    currentUserRole: "管理者",
  },
  en: {
    statuses: ["Not Started", "In Progress", "Review", "Done"] as const,
    priorities: ["High", "Medium", "Low"] as const,
    members: ["Misaki Tanaka", "Daiki Suzuki", "Kenta Sato", "Hanako Yamada", "Sho Ito", "Ai Nakamura", "Yusuke Kobayashi"],
    nav: {
      dashboard: "Dashboard",
      projects: "Projects",
      tasks: "Tasks",
      members: "Members",
      schedule: "Schedule",
      reports: "Reports",
      settings: "Settings",
    },
    projectList: {
      title: "Projects",
      countText: (all: number, active: number, review: number, done: number) =>
        `Total ${all} ・ In Progress ${active} ・ Review ${review} ・ Done ${done}`,
      newProject: "New Project",
      search: "Search projects...",
      all: "All",
      columns: {
        name: "Project Name",
        status: "Status",
        priority: "Priority",
        assignee: "Assignee",
        due: "Due Date",
        progress: "Progress",
      },
      noResults: "No projects found",
    },
    projectModal: {
      title: "New Project",
      nameLabel: "Project Name",
      namePlaceholder: "Enter project name",
      statusLabel: "Status",
      priorityLabel: "Priority",
      assigneeLabel: "Assignee",
      dueLabel: "Due Date",
      cancel: "Cancel",
      submit: "Create",
    },
    projectDetail: {
      backToList: "Back to Projects",
      priorityLabel: "Priority",
      tasksTitle: "Tasks",
      newTask: "New Task",
      taskCompleted: (done: number, all: number) => `${done} / ${all} tasks completed`,
      columns: {
        name: "Task Name",
        status: "Status",
        assignee: "Assignee",
        due: "Due Date",
      },
      activity: "Activity",
      commentPlaceholder: "Enter comment...",
      send: "Send",
    },
    taskModal: {
      title: "New Task",
      nameLabel: "Task Name",
      namePlaceholder: "Enter task name",
      statusLabel: "Status",
      assigneeLabel: "Assignee",
      dueLabel: "Due Date",
      cancel: "Cancel",
      submit: "Create",
    },
    appName: "ProjectFlow",
    appSubtitle: "Project Management",
    currentUser: "Misaki Tanaka",
    currentUserRole: "Administrator",
  },
};

export function getLanguageFromURL(): Language {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  return lang === "en" ? "en" : "ja";
}
