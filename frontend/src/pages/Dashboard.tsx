import React from 'react';
import type { AnalysisResponse } from '../types';

interface DashboardProps {
  onStartAnalysis: () => void;
  sessionAnalyses: AnalysisResponse[];
  onSelectAnalysis: (analysis: AnalysisResponse) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartAnalysis,
  sessionAnalyses,
  onSelectAnalysis,
}) => {
  const totalSessionCount = sessionAnalyses.length;

  const riskCounts = {
    LOW: sessionAnalyses.filter((a) => a.risk_level === 'LOW').length,
    MEDIUM: sessionAnalyses.filter((a) => a.risk_level === 'MEDIUM').length,
    HIGH: sessionAnalyses.filter((a) => a.risk_level === 'HIGH').length,
    CRITICAL: sessionAnalyses.filter((a) => a.risk_level === 'CRITICAL').length,
  };

  // Percent calculations for bar chart visualization
  const safePercent = totalSessionCount > 0 ? Math.round((riskCounts.LOW / totalSessionCount) * 100) : 25;
  const mediumPercent = totalSessionCount > 0 ? Math.round((riskCounts.MEDIUM / totalSessionCount) * 100) : 45;
  const highPercent = totalSessionCount > 0 ? Math.round((riskCounts.HIGH / totalSessionCount) * 100) : 20;
  const criticalPercent = totalSessionCount > 0 ? Math.round((riskCounts.CRITICAL / totalSessionCount) * 100) : 10;

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pt-4">
      {/* Hero & Quick Stats */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="font-mono text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Automated &amp; Explainable <span className="text-[#4cd7f6]">Phishing Analysis</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Advanced heuristic inspection engine. Real-time header forensics, SPF/DKIM/DMARC validation, and dynamic risk scoring for immediate threat intelligence.
            </p>
          </div>
          <div>
            <button
              onClick={onStartAnalysis}
              className="glowing-button font-mono text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span className="material-symbols-outlined text-lg">policy</span>
              <span>Start New Email Analysis</span>
            </button>
          </div>
        </div>

        {/* Counter Stat Card */}
        <div className="w-full xl:w-72">
          <div className="soc-card rounded-xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px] soc-card-active relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4cd7f6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest mb-2 relative z-10">
              Analyses Performed (Session)
            </span>
            <div className="font-mono text-3xl text-[#4cd7f6] font-bold flex items-baseline gap-2 relative z-10">
              <span className="text-4xl leading-none tracking-tighter">
                {totalSessionCount > 0 ? totalSessionCount : '0'}
              </span>
              <span className="w-2 h-2 bg-[#4cd7f6] rounded-full animate-pulse mb-1"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bar Chart Area (Left Col - 7 cols) */}
        <div className="lg:col-span-7 soc-card rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-mono text-lg font-semibold text-white">Session Risk Distribution</h3>
            <span className="font-mono text-xs text-slate-400">
              {totalSessionCount} total evaluations
            </span>
          </div>

          <div className="flex-1 flex items-end gap-2 h-48 border-b border-white/10 pb-2 relative">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-slate-500 font-mono text-[10px] pb-2">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>

            <div className="flex-1 flex items-end justify-around pl-8 h-full gap-4">
              {/* Safe / Low Bar */}
              <div className="w-full bg-slate-800 rounded-t relative group" style={{ height: `${safePercent}%` }}>
                <div className="absolute inset-x-0 bottom-0 bg-emerald-500/80 rounded-t h-full transition-all group-hover:brightness-125"></div>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {safePercent}%
                </span>
              </div>

              {/* Medium Bar */}
              <div className="w-full bg-slate-800 rounded-t relative group" style={{ height: `${mediumPercent}%` }}>
                <div className="absolute inset-x-0 bottom-0 bg-[#4cd7f6]/80 rounded-t h-full transition-all group-hover:brightness-125"></div>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {mediumPercent}%
                </span>
              </div>

              {/* High Bar */}
              <div className="w-full bg-slate-800 rounded-t relative group" style={{ height: `${highPercent}%` }}>
                <div className="absolute inset-x-0 bottom-0 bg-amber-500/80 rounded-t h-full transition-all group-hover:brightness-125"></div>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {highPercent}%
                </span>
              </div>

              {/* Critical Bar */}
              <div className="w-full bg-slate-800 rounded-t relative group" style={{ height: `${criticalPercent}%` }}>
                <div className="absolute inset-x-0 bottom-0 bg-rose-500/80 rounded-t h-full transition-all group-hover:brightness-125" style={{ boxShadow: '0 0 10px rgba(244,63,94,0.4)' }}></div>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {criticalPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-around pl-8 pt-3 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
            <span>Safe (Low)</span>
            <span>Medium</span>
            <span>High</span>
            <span className="text-rose-400 font-bold">Critical</span>
          </div>
        </div>

        {/* Feature Cards (Right Col - 5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4">
          <div className="soc-card rounded-xl p-5 border-l-4 border-l-[#4cd7f6] hover:bg-white/5 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded bg-[#4cd7f6]/10 text-[#4cd7f6]">
                <span className="material-symbols-outlined text-2xl">dns</span>
              </div>
              <div>
                <h4 className="font-mono text-base font-bold text-white mb-1">Authentication Pipeline</h4>
                <p className="text-xs text-slate-300">Real-time verification of SPF records, DKIM signatures, and DMARC alignment.</p>
                <div className="mt-3 flex gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/10">SPF: VERIFIED</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/10">DMARC: CHECKED</span>
                </div>
              </div>
            </div>
          </div>

          <div className="soc-card rounded-xl p-5 border-l-4 border-l-amber-400 hover:bg-white/5 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded bg-amber-400/10 text-amber-400">
                <span className="material-symbols-outlined text-2xl">psychology</span>
              </div>
              <div>
                <h4 className="font-mono text-base font-bold text-white mb-1">Heuristic Risk Scoring</h4>
                <p className="text-xs text-slate-300">Weighted rule engine evaluates header mismatches, deceptive URLs, and social engineering indicators.</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#4cd7f6] to-rose-500 w-[75%]"></div>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400 font-bold">0-100 Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed Table */}
      <div className="soc-card rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-sm">list_alt</span>
            <span>Recent Analyses Queue</span>
          </h3>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <span className="w-2 h-2 bg-[#4cd7f6] rounded-full animate-pulse"></span>
            <span>Session History ({sessionAnalyses.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {sessionAnalyses.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No emails analyzed yet in this session. Click "Start New Email Analysis" above to begin inspection.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 font-mono text-[11px] text-slate-400 uppercase tracking-wider border-b border-white/10">
                  <th className="p-4 font-normal">Timestamp</th>
                  <th className="p-4 font-normal">Sender Domain</th>
                  <th className="p-4 font-normal">Subject Line Extract</th>
                  <th className="p-4 font-normal">Risk Score</th>
                  <th className="p-4 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-slate-200">
                {sessionAnalyses.slice().reverse().map((item) => (
                  <tr
                    key={item.analysis_id}
                    onClick={() => onSelectAnalysis(item)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="p-4 text-slate-400">
                      {new Date(item.created_at).toLocaleTimeString()}
                    </td>
                    <td className="p-4 font-semibold text-slate-200">
                      {item.email.source_domain || item.email.sender || 'Unknown'}
                    </td>
                    <td className="p-4 truncate max-w-xs text-slate-300">
                      {item.email.subject || '(No Subject)'}
                    </td>
                    <td className="p-4 font-bold text-[#4cd7f6]">
                      {item.risk_score} / 100
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                        item.risk_level === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        item.risk_level === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        item.risk_level === 'MEDIUM' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {item.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
