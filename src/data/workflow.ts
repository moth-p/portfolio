export type WorkflowStep = {
  id: string
  /** Label shown in the flow chart node, e.g. "04" or "5-1" */
  index: string
  title: string
  /** Traditional Chinese title, shown under the English one */
  titleTw: string
  brief: string
  /** Traditional Chinese brief, shown under the English one */
  briefTw: string
}

export const workflowSteps: WorkflowStep[] = [
  {
    id: "scope",
    index: "01",
    title: "Project Scope",
    titleTw: "專案範疇",
    brief:
      "Clarify the problem, the people it serves and what needs to iterate.",
    briefTw: "釐清問題、服務對象與迭代需求。",
  },
  {
    id: "references",
    index: "02",
    title: "References Collection",
    titleTw: "資料蒐集",
    brief:
      "Collect visual, interaction and technical references to set the direction.",
    briefTw: "收集視覺、互動與技術參考資料，以確立方向。",
  },
  {
    id: "prototype",
    index: "03",
    title: "Prototype",
    titleTw: "原型設計",
    brief:
      "Turn the direction into clickable flows, so it can keep being discussed and refined.",
    briefTw: "把方向轉化為可點擊的流程體驗，以利持續討論與修正。",
  },
  {
    id: "mvp",
    index: "04",
    title: "MVP",
    titleTw: "最小可行方案",
    brief:
      "Cut the prototype down to the smallest version that delivers the core value, and decide what ships in what order.",
    briefTw: "將原型精簡為能傳遞核心價值的最小版本，並決定上線的先後順序。",
  },
  {
    id: "tech-stack",
    index: "5-1",
    title: "Tech Stack",
    titleTw: "技術棧",
    brief:
      "Choose frameworks, services and tooling that fit the MVP's needs, the team's strengths and the room the product needs to grow.",
    briefTw: "選擇符合 MVP 需求、團隊專長與產品成長空間的框架、服務與工具。",
  },
  {
    id: "implementation",
    index: "5-2",
    title: "Implementation Plan",
    titleTw: "實作計畫",
    brief:
      "Break the MVP into milestones and tasks, with clear owners and checkpoints.",
    briefTw: "將 MVP 拆解為里程碑與任務，確立負責人與檢查點。",
  },
]
