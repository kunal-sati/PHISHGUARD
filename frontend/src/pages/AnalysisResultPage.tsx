import React from 'react';
import type { AnalysisResponse, URLAnalysisItem, RiskIndicatorItem } from '../types';

interface AnalysisResultPageProps {
  result: AnalysisResponse;
  onBack: () => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({ result, onBack }) => {
  const isHighRisk = result.risk_score >= 61;
  const isMediumRisk = result.risk_score >= 31 && result.risk_score < 61;


  const getAuthBadge = (status: string) => {
    if (status === 'PASS') {
      return (
        <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold uppercase">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>Pass</span>
        </div>
      );
    }
    if (status === 'FAIL') {
      return (
        <div className="flex items-center gap-1 text-rose-400 font-mono text-xs font-bold uppercase">
          <span className="material-symbols-outlined text-sm">cancel</span>
          <span>Fail</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-slate-400 font-mono text-xs font-bold uppercase">
        <span className="material-symbols-outlined text-sm">help</span>
        <span>{status}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pt-2 pb-12">
      {/* Contextual Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-[#4cd7f6] transition-colors cursor-pointer group font-mono text-xs uppercase"
        >
          <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span>Back to Analysis Input</span>
        </button>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded border border-white/10">
          <span className="material-symbols-outlined text-[#4cd7f6] text-sm">qr_code_scanner</span>
          <span className="font-mono text-xs text-[#4cd7f6] tracking-wide">ID: {result.analysis_id.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>

      {/* Top Section: Risk Gauge & Verdict */}
      <section className={`${isHighRisk ? 'soc-card-error' : 'soc-card'} rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden`}>
        {/* Circle Gauge */}
        <div className="flex flex-col items-center justify-center min-w-[140px]">
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" fill="none" r="48" stroke="rgba(255,255,255,0.1)" strokeWidth="8"></circle>
              <circle
                className="transition-all duration-1000 ease-out"
                cx="56"
                cy="56"
                fill="none"
                r="48"
                stroke={isHighRisk ? '#f43f5e' : isMediumRisk ? '#f59e0b' : '#10b981'}
                strokeDasharray="301.5"
                strokeDashoffset={301.5 - (301.5 * result.risk_score) / 100}
                strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`font-mono text-3xl font-bold ${isHighRisk ? 'text-rose-400' : isMediumRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
                {result.risk_score}
              </span>
              <span className="font-mono text-[9px] uppercase text-slate-400 tracking-wider">Score / 100</span>
            </div>
          </div>
        </div>

        {/* Verdict & Explanation */}
        <div className="flex flex-col gap-2 flex-1 z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className={`pulse-dot w-2.5 h-2.5 rounded-full ${isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            <h1 className={`font-mono text-2xl font-bold tracking-wider uppercase ${isHighRisk ? 'text-rose-400' : isMediumRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
              {result.classification.replace(/_/g, ' ')}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {result.explanation}
          </p>
        </div>
      </section>

      {/* 2-Column Grid: Header Metadata & Authentication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Header Metadata */}
        <section className="soc-card rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-1">
            <span className="material-symbols-outlined text-[#4cd7f6]">data_object</span>
            <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wide">Header Metadata</h2>
          </div>
          <div className="flex flex-col gap-3 text-xs font-mono">
            <div className="grid grid-cols-[90px_1fr] gap-2">
              <span className="text-slate-400 text-right">From:</span>
              <span className="text-slate-200 break-all">{result.email.sender || 'Unknown'}</span>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-2">
              <span className="text-slate-400 text-right">To:</span>
              <span className="text-slate-200 break-all">{result.email.recipient || 'Unknown'}</span>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-2">
              <span className="text-slate-400 text-right">Subject:</span>
              <span className="text-white bg-slate-800 px-2 py-0.5 rounded font-semibold w-fit">
                {result.email.subject || '(No Subject)'}
              </span>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-2">
              <span className="text-slate-400 text-right">Reply-To:</span>
              <span className="text-slate-300 break-all">{result.email.reply_to || 'None'}</span>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-2">
              <span className="text-slate-400 text-right">Return-Path:</span>
              <span className="text-slate-300 break-all">{result.email.return_path || 'None'}</span>
            </div>
          </div>
        </section>

        {/* Authentication Alignment */}
        <section className="soc-card rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-1">
            <span className="material-symbols-outlined text-[#4cd7f6]">verified_user</span>
            <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wide">Authentication Alignment</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-white/5">
              <div>
                <span className="font-mono text-xs font-bold text-white block">SPF Verification</span>
                <span className="text-[11px] text-slate-400 block">{result.authentication.spf.details}</span>
              </div>
              {getAuthBadge(result.authentication.spf.status)}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-white/5">
              <div>
                <span className="font-mono text-xs font-bold text-white block">DKIM Signature</span>
                <span className="text-[11px] text-slate-400 block">{result.authentication.dkim.details}</span>
              </div>
              {getAuthBadge(result.authentication.dkim.status)}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-white/5">
              <div>
                <span className="font-mono text-xs font-bold text-white block">
                  DMARC Policy ({result.authentication.dmarc.policy ? result.authentication.dmarc.policy.toUpperCase() : 'UNSPECIFIED'})
                </span>
                <span className="text-[11px] text-slate-400 block">{result.authentication.dmarc.details}</span>
              </div>
              {getAuthBadge(result.authentication.dmarc.status)}
            </div>
          </div>
        </section>
      </div>

      {/* Triggered Risk Indicators */}
      <section className="soc-card rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6]">warning</span>
            <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wide">Triggered Risk Indicators</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">{result.indicators.length} rules triggered</span>
        </div>

        {result.indicators.length === 0 ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-lg text-emerald-400 text-xs font-mono text-center">
            No risk indicators were triggered for this message.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.indicators.map((ind: RiskIndicatorItem, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-slate-950/80 border border-white/5 rounded-lg gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#4cd7f6]">[{ind.rule_id}]</span>
                  <span className="text-xs text-slate-200">{ind.description}</span>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                    ind.severity === 'HIGH' || ind.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    ind.severity === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {ind.severity}
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-400">+{ind.score_impact} pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Extracted URLs Table */}
      <section className="soc-card rounded-xl p-6 flex flex-col gap-4 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1 min-w-[600px]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6]">link</span>
            <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wide">Extracted URLs &amp; Security Checks</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">{result.urls.length} links</span>
        </div>

        {result.urls.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-3 text-center font-mono">No hyperlinks extracted from body.</p>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[11px] text-slate-400 uppercase">
                <th className="py-2.5 px-3">Destination URL</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">Threat Flags</th>
                <th className="py-2.5 px-3 text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {result.urls.map((u: URLAnalysisItem, idx: number) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 text-slate-200 max-w-[280px] truncate">{u.url}</td>
                  <td className="py-3 px-3 text-slate-400">{u.domain || u.hostname}</td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {u.is_ip_host && <span className="bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded text-[10px] border border-rose-800">URL-001 IP Host</span>}
                      {u.display_mismatch && <span className="bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded text-[10px] border border-rose-800">URL-002 Deceptive Link</span>}
                      {u.is_shortener && <span className="bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px] border border-amber-800">URL-003 Shortener</span>}
                      {!u.is_ip_host && !u.display_mismatch && !u.is_shortener && <span className="text-slate-500 text-[10px]">Clean</span>}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-rose-400 font-bold">
                    {u.risk_score_contribution > 0 ? `+${u.risk_score_contribution}` : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Recommended Security Actions */}
      <section className="soc-card rounded-xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="material-symbols-outlined text-[#4cd7f6]">task_alt</span>
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wide">Recommended Actions</h2>
        </div>
        <ul className="flex flex-col gap-2 text-xs text-slate-300">
          {result.recommendations.map((rec: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#4cd7f6] font-bold">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
