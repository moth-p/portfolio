export type WorkflowStep = {
  id: string
  /** Label shown in the flow chart node, e.g. "04" or "5-1" */
  index: string
  title: string
  brief: string
  output: string
}

export const workflowSteps: WorkflowStep[] = [
  {
    id: "scope",
    index: "01",
    title: "Project Scope",
    brief:
      "Pin down the problem, the people it serves and what success looks like, so every later decision has something to be measured against.",
    output: "Goals, audience, constraints, success metrics",
  },
  {
    id: "references",
    index: "02",
    title: "References Collection",
    brief:
      "Gather visual, interaction and technical references into one board to set the tone and agree on direction before drawing anything.",
    output: "Moodboard, interaction patterns",
  },
  {
    id: "prototype",
    index: "03",
    title: "Prototype",
    brief:
      "Turn the direction into clickable flows. Testing early with real people exposes the weak spots while changes are still cheap.",
    output: "Wireframes, interactive prototype",
  },
  {
    id: "mvp",
    index: "04",
    title: "MVP",
    brief:
      "Cut the prototype down to the smallest version that delivers the core value, then define what ships first and what can wait.",
    output: "MVP feature list, priorities",
  },
  {
    id: "tech-stack",
    index: "5-1",
    title: "Tech Stack",
    brief:
      "Choose frameworks, services and tooling that fit the MVP's needs, the team's strengths and the room the product needs to grow.",
    output: "Stack decision record",
  },
  {
    id: "implementation",
    index: "5-2",
    title: "Implementation Plan",
    brief:
      "Break the MVP into milestones and tasks with clear owners and checkpoints, running alongside the stack decision so both inform each other.",
    output: "Milestones, task breakdown, timeline",
  },
]
