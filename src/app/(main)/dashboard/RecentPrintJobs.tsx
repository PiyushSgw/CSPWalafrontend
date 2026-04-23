import { format } from 'date-fns'
import { BookOpen } from 'lucide-react'

interface RecentJob {
  id: number
  customer_name: string
  account_number: string
  bank_code: string
  charge: number
  is_reprint: boolean
  created_at: string
}

interface Props {
  jobs: RecentJob[]
  loading: boolean
}

export default function RecentPrintJobs({ jobs, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-12 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="text-[13px] font-semibold text-slate-700">Recent Print Jobs</h3>
        <span className="text-[11px] text-slate-400">{jobs.length} jobs</span>
      </div>

      {jobs.length === 0 ? (
        <div className="py-10 text-center text-[12px] text-slate-400">
          No print jobs yet
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {jobs.map(job => (
            <div key={job.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[12.5px] font-medium text-slate-800">{job.customer_name}</p>
                  <p className="text-[11px] text-slate-400">
                    {job.bank_code} · {format(new Date(job.created_at), 'dd MMM, hh:mm a')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[12.5px] font-semibold text-slate-700">₹{job.charge}</p>
                {job.is_reprint && (
                  <span className="text-[10px] text-amber-600 font-medium">Reprint</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}