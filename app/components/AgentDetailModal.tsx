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
  X,
  FileText,
  Bug,
  Calendar
} from 'lucide-react'

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

interface Props {
  agent: Agent | null
  onClose: () => void
}

const statusColors = {
  ACTIVE: 'bg-emerald-500',
  INACTIVE: 'bg-amber-500',
  ERROR: 'bg-red-500',
}

const statusBgColors = {
  ACTIVE: 'bg-emerald-500/10 border-emerald-500/20',
  INACTIVE: 'bg-amber-500/10 border-amber-500/20',
  ERROR: 'bg-red-500/10 border-red-500/20',
}

export default function AgentDetailModal({ agent, onClose }: Props) {
  if (!agent) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{agent.name}</h2>
              <p className="text-sm text-slate-400">{agent.description || 'Agent'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
                <span className="text-sm text-slate-400">Status</span>
              </div>
              <p className="text-lg font-semibold text-white">{agent.status}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-400">Completed</span>
              </div>
              <p className="text-lg font-semibold text-white">{agent.tasksCompleted}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-400">Running</span>
              </div>
              <p className="text-lg font-semibold text-white">{agent.tasksRunning}</p>
            </div>
          </div>

          {/* Cost Tracking */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white">Cost Tracking</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Cost (7 days)</p>
                <p className="text-2xl font-bold text-emerald-400">${agent.totalCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Tokens</p>
                <p className="text-2xl font-bold text-blue-400">{agent.totalTokens.toLocaleString()}</p>
              </div>
            </div>
            {agent.dailyBudget && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Daily Budget</span>
                  <span className="text-white">${agent.totalCost.toFixed(2)} / ${agent.dailyBudget}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${agent.totalCost >= agent.dailyBudget ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (agent.totalCost / agent.dailyBudget) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Recent Task */}
          {agent.recentTask && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Current/Recent Task</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">{agent.recentTask.name}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    agent.recentTask.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                    agent.recentTask.status === 'RUNNING' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {agent.recentTask.status}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-slate-400">
                  <span>Cost: ${agent.recentTask.cost.toFixed(4)}</span>
                  <span>Tokens: {agent.recentTask.totalTokens.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
