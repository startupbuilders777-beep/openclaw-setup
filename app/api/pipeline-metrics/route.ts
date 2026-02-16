import { NextResponse } from 'next/server'

const ASANA_TOKEN = process.env.ASANA_TOKEN || '2/1213287152205467/1213287139030185:70bce90f612d0ea072617e4dc8686bcd'

const PROJECT_GIDS = [
  '1213277278397665', // AgentWatch
  '1213277068607518', // NexusAI
  '1213287173640360', // RedditAutoMarket
  '1213287696255155', // SafeAgent
  '1213287173636195', // Whop Course
  '1213291640888794', // Mission Control
]

export async function GET() {
  try {
    const results = await Promise.all(
      PROJECT_GIDS.map(async (gid) => {
        const response = await fetch(
          `https://app.asana.com/api/1.0/projects/${gid}/tasks?completed=false&opt_fields=name,notes,assignee,completed`,
          {
            headers: {
              'Authorization': `Bearer ${ASANA_TOKEN}`,
            },
          }
        )
        const data = await response.json()
        return {
          projectGid: gid,
          tasks: data.data || [],
        }
      })
    )

    // Aggregate metrics
    const allTasks = results.flatMap(r => r.tasks) as {completed: boolean, assignee: unknown, notes?: string}[]
    const total = allTasks.length
    const completed = allTasks.filter((t: {completed: boolean}) => t.completed).length
    const inProgress = allTasks.filter((t: {completed: boolean, assignee: unknown}) => t.assignee && !t.completed).length
    const unassigned = allTasks.filter((t: {completed: boolean, assignee: unknown}) => !t.assignee && !t.completed).length
    const blocked = allTasks.filter((t: {notes?: string}) => 
      t.notes && t.notes.toLowerCase().includes('blocked')
    ).length

    // Tasks by project
    const byProject = results.map(r => {
      const tasks = r.tasks as {completed: boolean, assignee: unknown}[]
      return {
        projectGid: r.projectGid,
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        inProgress: tasks.filter(t => t.assignee && !t.completed).length,
        unassigned: tasks.filter(t => !t.assignee && !t.completed).length,
      }
    })

    return NextResponse.json({
      total,
      completed,
      inProgress,
      unassigned,
      blocked,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byProject,
    })
  } catch (error) {
    console.error('Error fetching Asana metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Asana metrics' },
      { status: 500 }
    )
  }
}
