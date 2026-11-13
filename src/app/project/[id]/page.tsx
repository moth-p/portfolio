import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProjectDetail } from "@/components/project-detail"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getAdjacentProjects, getProject, projects } from "@/data/projects"

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }))
}

export async function generateMetadata({ params }: PageProps<"/project/[id]">): Promise<Metadata> {
  const { id } = await params
  const project = getProject(id)
  return project ? { title: project.title, description: project.summary } : {}
}

export default async function ProjectPage({ params }: PageProps<"/project/[id]">) {
  const { id } = await params
  const project = getProject(id)
  if (!project) notFound()

  return (
    <main className="pt-header">
      <SiteHeader active="projects" />
      <ProjectDetail project={project} {...getAdjacentProjects(id)} />
      <SiteFooter />
    </main>
  )
}
