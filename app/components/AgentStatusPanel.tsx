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
  Server,
  DollarSign,
  RefreshCw
} from 'lucide-react'
import AgentDetailModal from './AgentDetailModal'

type AgentStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR'

interface Agent {
  id: string
  name: string
  status: AgentStatus
  description?: string
  tasksCompleted: number
  tasksRunning: number
  uptime: string
  dailyBudget?: number
  monthlyBudget?: number
  totalCost: number
  totalTokens: number
  recentTask?: {
    id: string
    name: string
    status: string
    cost: number
    totalTokens: number
    startedAt: string
  } | null
}

interface ActivityItem {
  id: string
  agentName: string
  action: string
  details: any
  createdAt: string
}

const statusColors: Record<AgentStatus, string> = {
  ACTIVE: 'bg-emerald-500',
  INACTIVE: 'bg-amber-500',
  ERROR: 'bg-red-500',
}

const statusBgColors: Record<AgentStatus, string> = {
  ACTIVE: 'bg-emerald-500/10 border-emerald-500/20',
  INACTIVE: 'bg-amber-500/10 border-amber-500/20',
  ERROR: 'bg-red-500/10 border-red-500/20',
}

export default function AgentStatusPanel() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [metrics, setMetrics] = useState({ totalCost: 0, totalTokens: 0, totalTasks: 0, totalErrors: 0 })
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/agents/status')
      const data = await res.json()
      
      if (data.agents) {
        setAgents(data.agents)
        setActivity(data.activity || [])
        setMetrics(data.metrics || { totalCost: 0, totalTokens: 0, totalTasks: 0, totalErrors: 0 })
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch agent status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const onlineCount = agents.filter(a => a.status === 'ACTIVE').length
  const busyCount = agents.filter(a => a.tasksRunning > 0).length

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getActionIcon = (action: string) => {
    if (action.includes('complete') || action.includes('success')) 
      return <CheckCircle className="w-3 h-3 text-emerald-400" />
    if (action.includes('error') || action.includes('fail')) 
      return <AlertCircle className="w-3 h-3 text-red-400" />
    return <Activity className="w-3 h-3 text-blue-400" />
  }

  return (
    <>
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
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchStatus}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--'}
            </div>
          </div>
        </div>

        {/* Cost Tracking Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-full">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">${metrics.totalCost.toFixed(2)}</p>
              <p className="text-xs text-slate-400">Total Cost (7d)</p>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{metrics.totalTokens.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Total Tokens</p>
            </div>
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
              <p className="text-xs text-slate-400">Active</p>
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
          {loading ? (
            <div className="text-center py-8 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No agents found</p>
            </div>
          ) : (
            agents.map((agent) => (
              <button 
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full text-left border rounded-lg p-4 ${statusBgColors[agent.status]} transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer`}
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
                      <p className="text-sm text-slate-400">{agent.description || 'Agent'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBgColors[agent.status]} text-slate-300`}>
                    {agent.status}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
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
                    <DollarSign className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-400">Cost:</span>
                    <span className="text-emerald-400 font-medium">${agent.totalCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Current Task */}
                {agent.recentTask && (
                  <div className="text-xs text-slate-400 bg-slate-800/30 rounded p-2">
                    <span className="text-slate-500">Current:</span> {agent.recentTask.name}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Activity Feed */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Activity Feed
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {activity.length === 0 ? (
              <p className="text-xs text-slate-500">No recent activity</p>
            ) : (
              activity.slice(0, 10).map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-xs">
                  {getActionIcon(item.action)}
                  <span className="text-slate-500">{formatTimeAgo(item.createdAt)}</span>
                  <span className="text-slate-300">{item.agentName}</span>
                  <span className="text-slate-400">{item.action.replace(/_/g, ' ')}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AgentDetailModal 
        agent={selectedAgent} 
        onClose={() => setSelectedAgent(null)} 
      />
    </>
  )
}
