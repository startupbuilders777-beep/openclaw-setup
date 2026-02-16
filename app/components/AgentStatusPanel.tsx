'use client'

import { useState, useEffect } from 'react'
import { 
  Bot, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Cpu,
  Zap,
  Server
} from 'lucide-react'

type AgentStatus = 'online' | 'idle' | 'busy' | 'offline'

interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  tasksCompleted: number
  uptime: string
  cpu: number
  memory: number
}

const mockAgents: Agent[] = [
  { id: '1', name: 'Killer', role: 'Coordinator', status: 'online', tasksCompleted: 147, uptime: '99.9%', cpu: 23, memory: 45 },
  { id: '2', name: 'Builder', role: 'Build Agent', status: 'busy', tasksCompleted: 89, uptime: '98.5%', cpu: 67, memory: 62 },
  { id: '3', name: 'QA', role: 'Review Agent', status: 'idle', tasksCompleted: 56, uptime: '99.2%', cpu: 12, memory: 28 },
  { id: '4', name: 'Deploy', role: 'Ship Agent', status: 'online', tasksCompleted: 34, uptime: '100%', cpu: 8, memory: 22 },
]

const statusColors = {
  online: 'bg-emerald-500',
  idle: 'bg-amber-500',
  busy: 'bg-blue-500',
  offline: 'bg-gray-400',
}

const statusBgColors = {
  online: 'bg-emerald-500/10 border-emerald-500/20',
  idle: 'bg-amber-500/10 border-amber-500/20',
  busy: 'bg-blue-500/10 border-blue-500/20',
  offline: 'bg-gray-500/10 border-gray-500/20',
}

export default function AgentStatusPanel() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      // Simulate status changes
      setAgents(prev => prev.map(agent => ({
        ...agent,
        cpu: Math.max(5, Math.min(95, agent.cpu + Math.floor(Math.random() * 10) - 5)),
        memory: Math.max(20, Math.min(80, agent.memory + Math.floor(Math.random() * 6) - 3)),
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const onlineCount = agents.filter(a => a.status === 'online').length
  const busyCount = agents.filter(a => a.status === 'busy').length

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Agent Status</h2>
            <p className="text-sm text-slate-400">Real-time agent monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-full">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{onlineCount}</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-full">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{busyCount}</p>
            <p className="text-xs text-slate-400">Busy</p>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="space-y-3">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className={`border rounded-lg p-4 ${statusBgColors[agent.status]} transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[agent.status]} rounded-full border-2 border-slate-800`} />
                </div>
                <div>
                  <h3 className="font-medium text-white">{agent.name}</h3>
                  <p className="text-sm text-slate-400">{agent.role}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBgColors[agent.status]} text-slate-300 capitalize`}>
                {agent.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">Tasks:</span>
                <span className="text-white font-medium">{agent.tasksCompleted}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Server className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">Uptime:</span>
                <span className="text-emerald-400 font-medium">{agent.uptime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">CPU:</span>
                <span className={`font-medium ${agent.cpu > 70 ? 'text-amber-400' : 'text-white'}`}>{agent.cpu}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${agent.cpu}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
