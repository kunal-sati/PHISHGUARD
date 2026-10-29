import React from 'react';
import { ShieldCheck, Plus, ArrowRight, AlertTriangle, ShieldAlert } from 'lucide-react';
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

  const highAndCriticalCount = riskCounts.HIGH + riskCounts.CRITICAL;

  const lowPercent = totalSessionCount > 0 ? Math.round((riskCounts.LOW / totalSessionCount) * 100) : 0;
  const mediumPercent = totalSessionCount > 0 ? Math.round((riskCounts.MEDIUM / totalSessionCount) * 100) : 0;
  const highCriticalPercent = totalSessionCount > 0 ? Math.round((highAndCriticalCount / totalSessionCount) * 100) : 0;

  const getStatusBadge = (level: string) => {
    switch (level) {
      case 'LOW':
        return <span className="status-pill status-low">Legitimate</span>;
      case 'MEDIUM':
        return <span className="status-pill status-medium">Suspicious</span>;
      case 'HIGH':
        return <span className="status-pill status-high">Likely Phishing</span>;
      case 'CRITICAL':
        return <span className="status-pill status-critical">Critical</span>;
      default:
        return <span className="status-pill bg-[#F0F2ED] text-[#737873] border border-[#E3E5DF]">{level}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E3E5DF]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#242824]">
            Email Security Analysis
          </h1>
          <p className="text-sm text-[#737873] mt-1 max-w-2xl">
            Inspect suspicious emails, verify authentication signals, and understand potential phishing threats through transparent, rule-based heuristics.
          </p>
        </div>
        <button
          onClick={onStartAnalysis}
          className="pg-btn-primary self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Analyze an Email</span>
        </button>
      </div>

      {/* Summary section */}
      <div className="pg-panel grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E3E5DF]">
        <div className="p-4 sm:p-5">
          <div className="text-xs text-[#737873] font-medium">Session Analyses</div>
          <div className="text-2xl font-semibold text-[#242824] mt-1.5 font-mono">
            {totalSessionCount}
          </div>
          <div className="text-xs text-[#737873] mt-1">Total evaluated</div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-xs text-[#737873] font-medium">Low Risk</div>
          <div className="text-2xl font-semibold text-[#1E5A2A] mt-1.5 font-mono">
            {riskCounts.LOW}
          </div>
          <div className="text-xs text-[#737873] mt-1">Score 0–30 (Safe)</div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-xs text-[#737873] font-medium">Medium Risk</div>
          <div className="text-2xl font-semibold text-[#825B00] mt-1.5 font-mono">
            {riskCounts.MEDIUM}
          </div>
          <div className="text-xs text-[#737873] mt-1">Score 31–60 (Caution)</div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-xs text-[#737873] font-medium">High &amp; Critical</div>
          <div className="text-2xl font-semibold text-[#991B1B] mt-1.5 font-mono">
            {highAndCriticalCount}
          </div>
          <div className="text-xs text-[#737873] mt-1">Score 61–100 (Phishing)</div>
        </div>
      </div>

      {/* Middle Grid: Risk Distribution & Security Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk distribution */}
        <div className="lg:col-span-6 pg-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E5DF] mb-4">
              <h2 className="text-sm font-semibold text-[#242824]">Session Risk Distribution</h2>
              <span className="text-xs font-mono text-[#737873]">{totalSessionCount} total evaluations</span>
            </div>

            {totalSessionCount === 0 ? (
              <div className="py-10 px-4 text-center text-xs text-[#737873]">
                <p>No emails analyzed in this session yet.</p>
                <p className="mt-1 text-[#9CA3AF]">Analyze an email or load a test sample to generate distribution metrics.</p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {/* Horizontal Segmented Bar */}
                <div className="h-4 w-full bg-[#F0F2ED] rounded overflow-hidden flex border border-[#E3E5DF]">
                  {lowPercent > 0 && (
                    <div
                      style={{ width: `${lowPercent}%` }}
                      className="bg-[#2E7D32] h-full"
                      title={`Low Risk: ${lowPercent}%`}
                    />
                  )}
                  {mediumPercent > 0 && (
                    <div
                      style={{ width: `${mediumPercent}%` }}
                      className="bg-[#D97706] h-full"
                      title={`Medium Risk: ${mediumPercent}%`}
                    />
                  )}
                  {highCriticalPercent > 0 && (
                    <div
                      style={{ width: `${highCriticalPercent}%` }}
                      className="bg-[#DC2626] h-full"
                      title={`High/Critical Risk: ${highCriticalPercent}%`}
                    />
                  )}
                </div>

                {/* Legend list */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#2E7D32]"></span>
                    <div>
                      <span className="text-[#242824] font-medium">Low</span>
                      <span className="text-[#737873] ml-1 font-mono">({lowPercent}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706]"></span>
                    <div>
                      <span className="text-[#242824] font-medium">Med</span>
                      <span className="text-[#737873] ml-1 font-mono">({mediumPercent}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]"></span>
                    <div>
                      <span className="text-[#242824] font-medium">High</span>
                      <span className="text-[#737873] ml-1 font-mono">({highCriticalPercent}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E3E5DF] text-[11px] text-[#737873]">
            Session counts are retained in-memory during this browser visit.
          </div>
        </div>

        {/* Security Pipeline Overview */}
        <div className="lg:col-span-6 pg-panel p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3E5DF] mb-4">
            <h2 className="text-sm font-semibold text-[#242824]">Inspection Pipeline Capabilities</h2>
            <span className="text-xs text-[#456B55] font-medium">10 Core Rules</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-2.5 rounded bg-[#F7F7F4] border border-[#E3E5DF]">
              <div className="mt-0.5 text-[#456B55]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#242824]">Authentication Verification</div>
                <div className="text-[#737873] mt-0.5">
                  Validates SPF records via DNS, parses DKIM signatures, and checks DMARC alignment policy.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded bg-[#F7F7F4] border border-[#E3E5DF]">
              <div className="mt-0.5 text-[#456B55]">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#242824]">Deceptive URL &amp; Link Extraction</div>
                <div className="text-[#737873] mt-0.5">
                  Flags raw IP hosts, anchor text mismatches, and known URL shortening services.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded bg-[#F7F7F4] border border-[#E3E5DF]">
              <div className="mt-0.5 text-[#456B55]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#242824]">Social Engineering Heuristics</div>
                <div className="text-[#737873] mt-0.5">
                  Detects credential harvesting patterns, password expiry traps, and coercive urgency cues.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses History Table */}
      <div className="pg-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E3E5DF] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-sm font-semibold text-[#242824]">Recent Analyses History</h2>
            <p className="text-xs text-[#737873] mt-0.5">Click any record to inspect complete forensic report and indicator attributions</p>
          </div>
          <span className="text-xs font-mono text-[#737873] bg-[#F0F2ED] px-2 py-1 rounded border border-[#E3E5DF]">
            {sessionAnalyses.length} in session
          </span>
        </div>

        {sessionAnalyses.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F0F2ED] text-[#737873] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#242824]">No email analyses recorded yet</p>
            <p className="text-xs text-[#737873] mt-1 max-w-sm mx-auto">
              Analyze raw email headers or upload an .eml file to inspect threats and see your history here.
            </p>
            <button
              onClick={onStartAnalysis}
              className="pg-btn-primary mt-4"
            >
              Analyze Your First Email
            </button>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F0F2ED] text-[#737873] font-medium border-b border-[#E3E5DF]">
                    <th className="py-2.5 px-4 font-medium">Time</th>
                    <th className="py-2.5 px-4 font-medium">Sender Domain</th>
                    <th className="py-2.5 px-4 font-medium">Subject</th>
                    <th className="py-2.5 px-4 font-medium text-right">Score</th>
                    <th className="py-2.5 px-4 font-medium text-right">Classification</th>
                    <th className="py-2.5 px-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E5DF] text-[#242824]">
                  {sessionAnalyses.slice().reverse().map((item) => (
                    <tr
                      key={item.analysis_id}
                      onClick={() => onSelectAnalysis(item)}
                      className="hover:bg-[#F7F7F4] cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono text-[#737873] whitespace-nowrap">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium max-w-[160px] truncate">
                        {item.email.source_domain || item.email.sender || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[#242824]">
                        {item.email.subject || '(No Subject)'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        {item.risk_score} <span className="text-[#737873] font-normal text-[11px]">/ 100</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {getStatusBadge(item.risk_level)}
                      </td>
                      <td className="py-3 px-4 text-right text-[#737873] group-hover:text-[#456B55]">
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="sm:hidden divide-y divide-[#E3E5DF]">
              {sessionAnalyses.slice().reverse().map((item) => (
                <div
                  key={item.analysis_id}
                  onClick={() => onSelectAnalysis(item)}
                  className="p-4 hover:bg-[#F7F7F4] cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#737873]">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {getStatusBadge(item.risk_level)}
                  </div>
                  <div className="font-medium text-sm text-[#242824] truncate">
                    {item.email.subject || '(No Subject)'}
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#737873]">
                    <span className="font-mono truncate max-w-[200px]">
                      {item.email.source_domain || item.email.sender}
                    </span>
                    <span className="font-mono font-semibold text-[#242824]">
                      {item.risk_score}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
