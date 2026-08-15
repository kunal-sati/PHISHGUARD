import React, { useState } from 'react';
import { api } from '../services/api';
import type { AnalysisResponse } from '../types';

interface AnalyzePageProps {
  onAnalysisComplete: (result: AnalysisResponse) => void;
}

const SAMPLE_EMAILS = [
  {
    name: 'Legitimate_Newsletter.eml',
    type: 'Legitimate',
    badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    content: `From: "Tech Weekly Newsletter" <newsletter@example.com>
To: reader@company.com
Subject: Weekly Technology Digest
Date: Mon, 11 Aug 2026 08:30:00 +0000
Reply-To: newsletter@example.com
Return-Path: <bounce@example.com>
Authentication-Results: mx.company.com; spf=pass; dkim=pass; dmarc=pass

Welcome to this week's Tech Digest!

In this issue:
1. Advances in Explainable Threat Detection
2. Best practices for Zero Trust Architecture

Read full articles: https://example.com/digest/issue-42`
  },
  {
    name: 'Suspicious_Notice.eml',
    type: 'Suspicious',
    badgeClass: 'bg-amber-950 text-amber-400 border-amber-800',
    content: `From: "System Administrator" <security@example.test>
To: user@company.com
Subject: Action Required: Maintenance Notice
Date: Mon, 11 Aug 2026 14:15:00 +0000
Reply-To: support@unverified-relay.test
Return-Path: <bounce@unverified-relay.test>
Authentication-Results: mx.company.com; spf=fail; dmarc=none

Hello Team,

We are performing routine server maintenance. Please verify your portal settings if you experience any connection issues.

Access portal via shortener: http://bit.ly/3sampleLink`
  },
  {
    name: 'Phishing_Credential.eml',
    type: 'Phishing',
    badgeClass: 'bg-rose-950 text-rose-400 border-rose-800',
    content: `From: "Account Security Operations" <no-reply@example-phishing.test>
To: user@company.com
Subject: URGENT: Password Verification Required
Date: Mon, 11 Aug 2026 12:00:00 +0000
Reply-To: verify@attacker-c2.test
Return-Path: <bounce@attacker-c2.test>
Authentication-Results: mx.company.com; spf=fail; dkim=fail; dmarc=fail

Dear Customer,

Your account password will expire within 24 hours. Failure to update your password immediately will result in account suspension.

Please verify your account password and OTP code at:
http://192.168.1.105/login/verify.php

Or click the secure portal link below:
<a href="http://evil-credential-harvest.test/login">https://paypal.com/account/login</a>

Thank you,
Security Operations Team`
  }
];

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onAnalysisComplete }) => {
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [rawEmail, setRawEmail] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSampleClick = (content: string) => {
    setInputMode('paste');
    setRawEmail(content);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result: AnalysisResponse;
      if (inputMode === 'paste') {
        if (!rawEmail.trim()) {
          throw new Error('Please paste raw email headers and body content.');
        }
        result = await api.analyzeEmailPaste(rawEmail);
      } else {
        if (!uploadedFile) {
          throw new Error('Please select an .eml file to upload.');
        }
        result = await api.analyzeEmailFile(uploadedFile);
      }
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Analysis failed. Please check input formatting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pt-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="font-mono text-3xl font-bold text-white tracking-tight mb-1">Inspect &amp; Analyze Email</h1>
          <p className="text-sm text-slate-400">Paste raw email headers and body or upload an .eml file for immediate threat extraction and analysis.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#06b6d4]/10 border border-[#06b6d4]/30 px-3.5 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-[#06b6d4] pulse-dot"></div>
          <span className="font-mono text-xs text-[#06b6d4] uppercase font-semibold">Email Threat Inspection Engine</span>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Form & Action (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Form Card */}
            <div className="soc-card rounded-xl overflow-hidden flex flex-col h-[520px]">
              {/* Tabs Header */}
              <div className="flex border-b border-white/10 bg-slate-900/50">
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`flex-1 py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                    inputMode === 'paste'
                      ? 'text-[#4cd7f6] border-[#4cd7f6] bg-[#4cd7f6]/5'
                      : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">content_paste</span>
                  <span>Paste Email Content</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`flex-1 py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                    inputMode === 'upload'
                      ? 'text-[#4cd7f6] border-[#4cd7f6] bg-[#4cd7f6]/5'
                      : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>Upload .eml File</span>
                </button>
              </div>

              {/* Tab Content: Paste */}
              {inputMode === 'paste' ? (
                <div className="flex-1 p-6 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">Raw Email Source</label>
                    <button
                      type="button"
                      onClick={() => setRawEmail('')}
                      className="font-mono text-xs text-[#4cd7f6] hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span> Clear
                    </button>
                  </div>
                  <textarea
                    value={rawEmail}
                    onChange={(e) => setRawEmail(e.target.value)}
                    className="flex-1 w-full bg-slate-950 border border-white/10 rounded-lg p-4 font-mono text-xs text-slate-200 focus:border-[#4cd7f6] focus:ring-1 focus:ring-[#4cd7f6] focus:outline-none resize-none"
                    placeholder={`From: "Security Notice" <sender@example.com>\nTo: victim@domain.com\nSubject: URGENT: Password Verification Required\n\nPaste full email headers and body content here...`}
                  />
                </div>
              ) : (
                /* Tab Content: Upload */
                <div className="flex-1 p-6">
                  <div className="h-full border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center bg-slate-950/40 hover:bg-slate-950/80 transition-colors hover:border-[#4cd7f6]/50 cursor-pointer group relative">
                    <input
                      type="file"
                      accept=".eml,.txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-[#4cd7f6]">cloud_upload</span>
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white mb-1">
                      {uploadedFile ? uploadedFile.name : 'Drag & Drop .eml file here'}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4 text-center">
                      {uploadedFile ? `Size: ${(uploadedFile.size / 1024).toFixed(1)} KB` : 'Supports standard RFC 822 email format. Max file size: 10MB.'}
                    </p>
                    <span className="px-4 py-2 bg-slate-800 border border-white/10 rounded font-mono text-xs uppercase text-white group-hover:bg-slate-700">
                      {uploadedFile ? 'Change File' : 'Browse Files'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-300 text-xs font-mono">
                🛑 {error}
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl glowing-button font-mono text-base uppercase tracking-widest font-bold flex items-center justify-center gap-3 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  <span>Executing Inspection Engine...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">radar</span>
                  <span>Execute Email Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Presets & Info (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Presets Module */}
          <div className="soc-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <span className="material-symbols-outlined text-[#4cd7f6]">science</span>
              <h2 className="font-mono text-base font-bold text-white">Test Payloads</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">Click any pre-configured email sample below to test PhishGuard's detection rules.</p>
            <div className="flex flex-col gap-3">
              {SAMPLE_EMAILS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSampleClick(sample.content)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-white/5 hover:border-[#4cd7f6]/40 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      sample.type === 'Phishing' ? 'bg-rose-500' :
                      sample.type === 'Suspicious' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></span>
                    <span className="font-mono text-xs text-slate-200 group-hover:text-[#4cd7f6] transition-colors">{sample.name}</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-[#4cd7f6]">download</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info Module */}
          <div className="soc-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#4cd7f6]">info</span>
              <h2 className="font-mono text-base font-bold text-white">Analysis Capabilities</h2>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 pl-5 list-disc mt-3 leading-relaxed">
              <li>Header forgery &amp; Reply-To/Return-Path domain mismatch.</li>
              <li>Live SPF / DKIM / DMARC authentication checks.</li>
              <li>URL extraction, deceptive anchor text, &amp; shortener detection.</li>
              <li>Pattern scanning for credentials &amp; urgency coercion.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
