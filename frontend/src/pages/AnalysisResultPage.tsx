import React from 'react';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import type { AnalysisResponse, URLAnalysisItem, RiskIndicatorItem } from '../types';

interface AnalysisResultPageProps {
  result: AnalysisResponse;
  onBack: () => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({ result, onBack }) => {

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-[#1E5A2A]';
    if (score <= 60) return 'text-[#825B00]';
    return 'text-[#991B1B]';
  };

  const getProgressBarColor = (score: number) => {
    if (score <= 30) return 'bg-[#2E7D32]';
    if (score <= 60) return 'bg-[#D97706]';
    return 'bg-[#DC2626]';
  };

  const getStatusBadge = (classification: string, level: string) => {
    const label = classification.replace(/_/g, ' ');
    switch (level) {
      case 'LOW':
        return <span className="status-pill status-low">{label}</span>;
      case 'MEDIUM':
        return <span className="status-pill status-medium">{label}</span>;
      case 'HIGH':
        return <span className="status-pill status-high">{label}</span>;
      case 'CRITICAL':
        return <span className="status-pill status-critical">{label}</span>;
      default:
        return <span className="status-pill bg-[#F0F2ED] text-[#737873] border border-[#E3E5DF]">{label}</span>;
    }
  };

  const getAuthStatusDisplay = (status: string) => {
    const s = (status || 'UNKNOWN').toUpperCase();
    if (s === 'PASS') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E5A2A] bg-[#EBF5ED] px-2 py-0.5 rounded border border-[#C8E6C9]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Pass</span>
        </span>
      );
    }
    if (s === 'FAIL' || s === 'SOFTFAIL') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#991B1B] bg-[#FEEBEB] px-2 py-0.5 rounded border border-[#FCA5A5]">
          <XCircle className="w-3.5 h-3.5" />
          <span>Fail</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#737873] bg-[#F0F2ED] px-2 py-0.5 rounded border border-[#E3E5DF]">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>{status || 'Unknown'}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Navigation Breadcrumb & Metadata Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E3E5DF] flex-wrap gap-2">
        <button
          onClick={onBack}
          className="text-xs font-medium text-[#737873] hover:text-[#242824] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Analyze Email</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-[#737873] font-mono">
          <span>ID: {result.analysis_id.slice(0, 8).toUpperCase()}</span>
          <span className="text-[#D2D5CD]">•</span>
          <span>{new Date(result.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
      </div>

      {/* Forensic Report Overview Card */}
      <div className="pg-panel p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-[#737873] font-medium uppercase tracking-wider">
              Investigation Verdict
            </div>
            <h1 className="text-xl font-semibold text-[#242824]">
              {result.email.subject || '(No Subject Line)'}
            </h1>
            <div className="text-xs text-[#737873] font-mono">
              Evaluated sender: {result.email.source_domain || result.email.sender || 'Unknown domain'}
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            {getStatusBadge(result.classification, result.risk_level)}
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-semibold font-mono ${getScoreColor(result.risk_score)}`}>
                {result.risk_score}
              </span>
              <span className="text-xs text-[#737873] font-mono font-medium">/ 100</span>
            </div>
            {/* Restrained horizontal meter */}
            <div className="w-36 h-1.5 bg-[#F0F2ED] rounded overflow-hidden border border-[#E3E5DF]">
              <div
                style={{ width: `${Math.min(100, Math.max(0, result.risk_score))}%` }}
                className={`h-full ${getProgressBarColor(result.risk_score)}`}
              />
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded bg-[#F7F7F4] border border-[#E3E5DF] text-xs text-[#242824] leading-relaxed">
          {result.explanation}
        </div>
      </div>

      {/* Two-Column Grid: Header Details & Authentication Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Header Details */}
        <div className="pg-panel p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[#242824] pb-2 border-b border-[#E3E5DF]">
            Email Header Details
          </h2>
          <div className="text-xs space-y-2.5 font-mono">
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="text-[#737873]">From:</span>
              <span className="text-[#242824] break-all">{result.email.sender || 'Unknown'}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="text-[#737873]">To:</span>
              <span className="text-[#242824] break-all">{result.email.recipient || 'Unknown'}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="text-[#737873]">Subject:</span>
              <span className="text-[#242824] font-sans font-medium">{result.email.subject || '(None)'}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="text-[#737873]">Reply-To:</span>
              <span className="text-[#242824] break-all">{result.email.reply_to || 'None specified'}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="text-[#737873]">Return-Path:</span>
              <span className="text-[#242824] break-all">{result.email.return_path || 'None specified'}</span>
            </div>
          </div>
        </div>

        {/* Authentication Alignment */}
        <div className="pg-panel p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[#242824] pb-2 border-b border-[#E3E5DF]">
            Authentication Results
          </h2>
          <div className="space-y-3 text-xs">
            {/* SPF Check */}
            <div className="p-2.5 rounded bg-[#F7F7F4] border border-[#E3E5DF] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-[#242824]">SPF (Sender Policy Framework)</div>
                <div className="text-[#737873] mt-0.5 font-mono text-[11px] break-all">
                  {result.authentication.spf.details}
                </div>
              </div>
              <div className="shrink-0">
                {getAuthStatusDisplay(result.authentication.spf.status)}
              </div>
            </div>

            {/* DKIM Check */}
            <div className="p-2.5 rounded bg-[#F7F7F4] border border-[#E3E5DF] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-[#242824]">DKIM (DomainKeys Identified Mail)</div>
                <div className="text-[#737873] mt-0.5 font-mono text-[11px] break-all">
                  {result.authentication.dkim.details}
                </div>
              </div>
              <div className="shrink-0">
                {getAuthStatusDisplay(result.authentication.dkim.status)}
              </div>
            </div>

            {/* DMARC Check */}
            <div className="p-2.5 rounded bg-[#F7F7F4] border border-[#E3E5DF] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-[#242824]">
                  DMARC Policy {result.authentication.dmarc.policy ? `(${result.authentication.dmarc.policy.toUpperCase()})` : ''}
                </div>
                <div className="text-[#737873] mt-0.5 font-mono text-[11px] break-all">
                  {result.authentication.dmarc.details}
                </div>
              </div>
              <div className="shrink-0">
                {getAuthStatusDisplay(result.authentication.dmarc.status)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triggered Risk Indicators Table */}
      <div className="pg-panel overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E3E5DF] flex items-center justify-between bg-white">
          <h2 className="text-sm font-semibold text-[#242824]">
            Triggered Risk Indicators
          </h2>
          <span className="text-xs font-mono text-[#737873]">
            {result.indicators.length} {result.indicators.length === 1 ? 'rule triggered' : 'rules triggered'}
          </span>
        </div>

        {result.indicators.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#1E5A2A] bg-[#EBF5ED]/40">
            No suspicious indicators or security violations were detected in this message.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F0F2ED] text-[#737873] font-medium border-b border-[#E3E5DF]">
                  <th className="py-2.5 px-4 font-medium w-24">Rule ID</th>
                  <th className="py-2.5 px-4 font-medium">Finding Description</th>
                  <th className="py-2.5 px-4 font-medium w-28 text-center">Severity</th>
                  <th className="py-2.5 px-4 font-medium w-24 text-right">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5DF] text-[#242824]">
                {result.indicators.map((ind: RiskIndicatorItem, idx: number) => (
                  <tr key={idx} className="hover:bg-[#F7F7F4] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#456B55]">
                      {ind.rule_id}
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      {ind.description}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`status-pill ${
                        ind.severity === 'CRITICAL' ? 'status-critical' :
                        ind.severity === 'HIGH' ? 'status-high' :
                        ind.severity === 'MEDIUM' ? 'status-medium' : 'status-low'
                      }`}>
                        {ind.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#991B1B]">
                      +{ind.score_impact} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Extracted URLs Findings Table */}
      <div className="pg-panel overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E3E5DF] flex items-center justify-between bg-white">
          <h2 className="text-sm font-semibold text-[#242824]">
            Extracted Hyperlinks &amp; Security Checks
          </h2>
          <span className="text-xs font-mono text-[#737873]">
            {result.urls.length} {result.urls.length === 1 ? 'URL found' : 'URLs found'}
          </span>
        </div>

        {result.urls.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#737873]">
            No hyperlinks were found in the plain text or HTML body of this email.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F0F2ED] text-[#737873] font-medium border-b border-[#E3E5DF]">
                  <th className="py-2.5 px-4 font-medium max-w-[280px]">Destination URL</th>
                  <th className="py-2.5 px-4 font-medium">Host / Domain</th>
                  <th className="py-2.5 px-4 font-medium">Threat Indicators</th>
                  <th className="py-2.5 px-4 font-medium text-right w-20">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5DF] text-[#242824]">
                {result.urls.map((u: URLAnalysisItem, idx: number) => {
                  const hasThreats = u.is_ip_host || u.display_mismatch || u.is_shortener;
                  return (
                    <tr key={idx} className="hover:bg-[#F7F7F4] transition-colors">
                      <td className="py-3 px-4 font-mono text-[#242824] break-all max-w-[320px]">
                        <div className="truncate" title={u.url}>{u.url}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#737873]">
                        {u.domain || u.hostname || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {u.is_ip_host && (
                            <span className="status-pill status-high">URL-001 IP Host</span>
                          )}
                          {u.display_mismatch && (
                            <span className="status-pill status-high">URL-002 Deceptive Text</span>
                          )}
                          {u.is_shortener && (
                            <span className="status-pill status-medium">URL-003 Shortener</span>
                          )}
                          {!hasThreats && (
                            <span className="status-pill bg-[#F0F2ED] text-[#737873] border border-[#E3E5DF]">Clean</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        {u.risk_score_contribution > 0 ? (
                          <span className="text-[#991B1B]">+{u.risk_score_contribution}</span>
                        ) : (
                          <span className="text-[#737873]">0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Actions */}
      <div className="pg-panel p-5 space-y-3">
        <h2 className="text-sm font-semibold text-[#242824] pb-2 border-b border-[#E3E5DF]">
          Recommended Defensive Actions
        </h2>
        <ul className="space-y-2 text-xs text-[#242824]">
          {result.recommendations.map((rec: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#456B55] font-semibold font-mono mt-0.5">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
