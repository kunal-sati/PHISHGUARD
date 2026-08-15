import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pt-4 pb-12">
      {/* Header Section */}
      <section className="flex flex-col gap-2 border-l-4 border-[#4cd7f6] pl-4">
        <h1 className="font-mono text-3xl font-bold text-white">About System Architecture</h1>
        <p className="text-sm text-slate-400 max-w-3xl">Comprehensive overview of the PHISHGUARD detection engine, technology stack, and operational parameters.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission & Architecture Card */}
        <div className="lg:col-span-2 soc-card soc-card-active rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <span className="material-symbols-outlined text-[#4cd7f6]">architecture</span>
            <h2 className="font-mono text-base font-bold text-[#4cd7f6] uppercase">Mission &amp; Architecture</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            PHISHGUARD is engineered to operate as a lightweight, high-fidelity first line of defense against email-based phishing threats. By combining raw RFC 822 header inspection, live SPF/DKIM/DMARC authentication checks, deceptive URL extraction, and social engineering keyword pattern matching, the engine rapidly evaluates inbound communications with transparent, explainable scoring.
          </p>
        </div>

        {/* Technical Limitations Card */}
        <div className="soc-card rounded-xl p-6 flex flex-col gap-4 border border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3">
            <span className="material-symbols-outlined text-amber-400">warning</span>
            <h2 className="font-mono text-base font-bold text-amber-400 uppercase">Technical Limitations</h2>
          </div>
          <ul className="flex flex-col gap-2.5 font-mono text-xs text-slate-300 list-disc pl-4">
            <li><strong>SPF PASS</strong> verifies sending IP authorization, not content benevolence.</li>
            <li><strong>DKIM PASS</strong> results are parsed from receiving mail server headers; raw RSA key verification is not performed.</li>
            <li><strong>HTTPS URLs</strong> indicate encrypted protocol transport, not destination website safety.</li>
          </ul>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <section className="flex flex-col gap-4 mt-2">
        <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider pl-2 border-l-2 border-slate-700">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="soc-card rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-[#4cd7f6]/50 transition-colors">
            <span className="material-symbols-outlined text-3xl text-[#4cd7f6]">code</span>
            <span className="font-mono text-xs font-bold text-white text-center">Python / FastAPI</span>
            <span className="font-mono text-[10px] text-slate-400">Core Engine</span>
          </div>

          <div className="soc-card rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-[#4cd7f6]/50 transition-colors">
            <span className="material-symbols-outlined text-3xl text-[#4cd7f6]">web</span>
            <span className="font-mono text-xs font-bold text-white text-center">React / TS / Vite</span>
            <span className="font-mono text-[10px] text-slate-400">Frontend UI</span>
          </div>

          <div className="soc-card rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-[#4cd7f6]/50 transition-colors">
            <span className="material-symbols-outlined text-3xl text-[#4cd7f6]">html</span>
            <span className="font-mono text-xs font-bold text-white text-center">BeautifulSoup4</span>
            <span className="font-mono text-[10px] text-slate-400">DOM Parsing</span>
          </div>

          <div className="soc-card rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-[#4cd7f6]/50 transition-colors">
            <span className="material-symbols-outlined text-3xl text-[#4cd7f6]">dns</span>
            <span className="font-mono text-xs font-bold text-white text-center">dnspython</span>
            <span className="font-mono text-[10px] text-slate-400">DNS Verification</span>
          </div>
        </div>
      </section>

      {/* Detection Rules Table */}
      <section className="flex flex-col gap-4 mt-2">
        <div className="flex justify-between items-end mb-1">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider pl-2 border-l-2 border-slate-700">Active Detection Rules (10 Core Rules)</h2>
          <span className="font-mono text-[11px] text-[#4cd7f6] bg-[#4cd7f6]/10 px-2 py-1 rounded border border-[#4cd7f6]/20">MVP Engine</span>
        </div>
        <div className="soc-card rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/50 font-mono text-[11px] text-slate-400 uppercase">
                <th className="p-3.5">Rule ID</th>
                <th className="p-3.5">Name / Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Score Impact</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-slate-200">
              <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">HDR-001</td><td className="p-3.5">Reply-To domain differs from sender domain</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">HEADER</span></td><td className="p-3.5 text-right text-rose-400 font-bold">+15 pts</td></tr>
              <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">HDR-002</td><td className="p-3.5">Return-Path domain differs from sender domain</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">HEADER</span></td><td className="p-3.5 text-right text-amber-400 font-bold">+10 pts</td></tr>
              <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">SPF-001</td><td className="p-3.5">SPF check returned FAIL or SOFTFAIL</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">AUTH</span></td><td className="p-3.5 text-right text-rose-400 font-bold">+20 pts</td></tr>
              <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">DKIM-001</td><td className="p-3.5">DKIM check failed in receiving server header</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">AUTH</span></td><td className="p-3.5 text-right text-rose-400 font-bold">+15 pts</td></tr>
              <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">DMARC-001</td><td className="p-3.5">DMARC check failed for sender domain</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">AUTH</span></td><td className="p-3.5 text-right text-rose-400 font-bold">+20 pts</td></tr>
              <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">URL-001</td><td className="p-3.5">URL uses raw IP address host</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">URL</span></td><td className="p-3.5 text-right text-rose-400 font-bold">+20 pts</td></tr>
              <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">URL-002</td><td className="p-3.5">Displayed anchor text and destination URL do not match</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">URL</span></td><td className="p-3.5 text-right text-rose-400 font-bold">+20 pts</td></tr>
              <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">URL-003</td><td className="p-3.5">URL uses a known shortening service</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">URL</span></td><td className="p-3.5 text-right text-amber-400 font-bold">+10 pts</td></tr>
              <tr className="border-b border-white/5 hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">CNT-001</td><td className="p-3.5">Email content explicitly requests credentials / OTP</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">CONTENT</span></td><td className="p-3.5 text-right text-amber-400 font-bold">+10 pts</td></tr>
              <tr className="hover:bg-white/5"><td className="p-3.5 text-[#4cd7f6] font-bold">CNT-002</td><td className="p-3.5">Urgent pressure language or coercion tactics detected</td><td className="p-3.5"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">CONTENT</span></td><td className="p-3.5 text-right text-emerald-400 font-bold">+5 pts</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Roadmap / Future Scope */}
      <section className="flex flex-col gap-4 mt-2">
        <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider pl-2 border-l-2 border-slate-700">Future Scope Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="soc-card rounded-xl p-5 flex gap-4 border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#4cd7f6]">route</span>
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white mb-1">MITRE ATT&amp;CK Mapping</h3>
              <p className="text-xs text-slate-400">Integrate direct mapping of detected IOCs to specific MITRE ATT&amp;CK techniques.</p>
              <span className="font-mono text-[10px] text-[#4cd7f6] mt-2 block font-bold">Planned Future Scope</span>
            </div>
          </div>

          <div className="soc-card rounded-xl p-5 flex gap-4 border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#4cd7f6]">psychology</span>
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white mb-1">SOC Incident Management</h3>
              <p className="text-xs text-slate-400">SOC ticketing, analyst assignments, persistent search history logs, and PDF reporting.</p>
              <span className="font-mono text-[10px] text-[#4cd7f6] mt-2 block font-bold">Planned Future Scope</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
