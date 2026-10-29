import React, { useState } from 'react';
import { UploadCloud, FileText, X, RotateCcw, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { AnalysisResponse } from '../types';

interface AnalyzePageProps {
  onAnalysisComplete: (result: AnalysisResponse) => void;
}

const SAMPLE_EMAILS = [
  {
    name: 'Legitimate Newsletter',
    filename: 'Legitimate_Newsletter.eml',
    type: 'Low Risk',
    badgeClass: 'status-low',
    description: 'Corporate newsletter passing SPF, DKIM, and DMARC alignment with authentic domains.',
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
    name: 'Suspicious Maintenance Notice',
    filename: 'Suspicious_Notice.eml',
    type: 'Medium Risk',
    badgeClass: 'status-medium',
    description: 'Server maintenance notice failing SPF authentication with a shortened redirect URL.',
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
    name: 'Urgent Credential Harvest',
    filename: 'Phishing_Credential.eml',
    type: 'High Risk',
    badgeClass: 'status-high',
    description: 'Spoofed security notification with failed authentication, raw IP address, and deceptive anchor text.',
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

  const handleClear = () => {
    if (inputMode === 'paste') {
      setRawEmail('');
    } else {
      setUploadedFile(null);
    }
    setError(null);
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

  const isSubmitDisabled = loading || (inputMode === 'paste' ? !rawEmail.trim() : !uploadedFile);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="pb-2 border-b border-[#E3E5DF]">
        <h1 className="text-2xl font-semibold tracking-tight text-[#242824]">
          Analyze an Email
        </h1>
        <p className="text-sm text-[#737873] mt-1 max-w-2xl">
          Paste an email or upload an .eml file to inspect its headers, authentication results, links, and potential phishing indicators.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="pg-panel p-5 space-y-4">
          {/* Segmented Control */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#E3E5DF]">
            <div className="bg-[#F0F2ED] p-1 rounded-md inline-flex border border-[#E3E5DF]">
              <button
                type="button"
                onClick={() => { setInputMode('paste'); setError(null); }}
                className={`text-xs px-3.5 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  inputMode === 'paste'
                    ? 'bg-white text-[#242824] shadow-xs'
                    : 'text-[#737873] hover:text-[#242824]'
                }`}
              >
                Paste Email Content
              </button>
              <button
                type="button"
                onClick={() => { setInputMode('upload'); setError(null); }}
                className={`text-xs px-3.5 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  inputMode === 'upload'
                    ? 'bg-white text-[#242824] shadow-xs'
                    : 'text-[#737873] hover:text-[#242824]'
                }`}
              >
                Upload .eml File
              </button>
            </div>

            {(rawEmail || uploadedFile) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-[#737873] hover:text-[#242824] inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Tab 1: Paste Mode */}
          {inputMode === 'paste' ? (
            <div className="space-y-2">
              <label htmlFor="raw-email-input" className="text-xs font-medium text-[#737873] block">
                RFC 822 Raw Email Source
              </label>
              <textarea
                id="raw-email-input"
                value={rawEmail}
                onChange={(e) => { setRawEmail(e.target.value); setError(null); }}
                className="w-full h-72 bg-white border border-[#E3E5DF] rounded-md p-3.5 font-mono text-xs text-[#242824] placeholder:text-[#9CA3AF] focus:border-[#456B55] focus:ring-1 focus:ring-[#456B55] focus:outline-none resize-y leading-relaxed"
                placeholder={`From: "Security Notice" <sender@example.com>\nTo: recipient@company.com\nSubject: Account Verification Required\nAuthentication-Results: mx.company.com; spf=pass; dkim=pass\n\nPaste full email headers and body content here...`}
              />
            </div>
          ) : (
            /* Tab 2: Upload Mode */
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#737873] block">
                Upload RFC 822 Email File
              </span>

              {!uploadedFile ? (
                <label className="border border-dashed border-[#D2D5CD] bg-[#F7F7F4] hover:bg-white rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors block">
                  <input
                    type="file"
                    accept=".eml,.txt"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#EDF2EE] text-[#456B55] flex items-center justify-center mb-3">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium text-[#242824]">
                    Click to select or drag and drop an .eml file
                  </div>
                  <div className="text-xs text-[#737873] mt-1">
                    Accepts standard RFC 822 (.eml or .txt) files up to 10 MB
                  </div>
                </label>
              ) : (
                <div className="p-4 bg-[#F0F2ED] border border-[#E3E5DF] rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-white border border-[#E3E5DF] text-[#456B55] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#242824] truncate">
                        {uploadedFile.name}
                      </div>
                      <div className="text-xs text-[#737873]">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-xs text-[#737873] hover:text-[#991B1B] p-1.5 rounded transition-colors cursor-pointer"
                    title="Remove selected file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Validation / Error Message */}
          {error && (
            <div className="p-3 bg-[#FEEBEB] border border-[#FCA5A5] rounded-md text-xs text-[#991B1B] font-medium">
              {error}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="pg-btn-primary w-full py-2.5 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Email...</span>
                </>
              ) : (
                <span>Analyze Email</span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Try a Sample Email section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#242824]">Try a Sample Email</h2>
          <span className="text-xs text-[#737873]">Loads sample content into input without automatic submission</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_EMAILS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample.content)}
              className="pg-panel p-4 text-left hover:border-[#456B55] transition-colors cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#242824] group-hover:text-[#456B55] transition-colors">
                    {sample.name}
                  </span>
                  <span className={`status-pill ${sample.badgeClass}`}>
                    {sample.type}
                  </span>
                </div>
                <p className="text-xs text-[#737873] mt-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="text-[11px] font-mono text-[#456B55] font-medium pt-2 border-t border-[#E3E5DF]">
                Load sample →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanatory Technical Notes */}
      <div className="pg-panel p-4 bg-[#F0F2ED]/60 text-xs text-[#737873] space-y-2">
        <div className="font-semibold text-[#242824]">Analysis Scope</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 leading-relaxed">
          <div>• Extracts sender domains, Return-Path, and Reply-To for forgery checks.</div>
          <div>• Queries live DNS for SPF (`v=spf1`) and DMARC (`_dmarc`) policy records.</div>
          <div>• Parses all hyperlinks to identify raw IP addresses and deceptive display anchors.</div>
          <div>• Scans message body for credential harvesting prompts and coercive urgency cues.</div>
        </div>
      </div>
    </div>
  );
};
