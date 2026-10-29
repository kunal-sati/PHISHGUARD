import React from 'react';

const DETECTION_RULES = [
  {
    id: 'HDR-001',
    name: 'Reply-To Domain Mismatch',
    description: 'Reply-To domain differs from the sender domain, indicating potential redirection of responses.',
    category: 'HEADER',
    severity: 'HIGH',
    impact: '+15 pts'
  },
  {
    id: 'HDR-002',
    name: 'Return-Path Mismatch',
    description: 'Return-Path (envelope sender) domain differs from the sender domain.',
    category: 'HEADER',
    severity: 'MEDIUM',
    impact: '+10 pts'
  },
  {
    id: 'SPF-001',
    name: 'SPF Validation Failed',
    description: 'SPF check returned FAIL or SOFTFAIL according to receiving mail server or live DNS records.',
    category: 'AUTH',
    severity: 'HIGH',
    impact: '+20 pts'
  },
  {
    id: 'DKIM-001',
    name: 'DKIM Validation Failed',
    description: 'DKIM cryptographic signature verification failed in receiving mail server headers.',
    category: 'AUTH',
    severity: 'HIGH',
    impact: '+15 pts'
  },
  {
    id: 'DMARC-001',
    name: 'DMARC Validation Failed',
    description: 'DMARC evaluation failed for sender domain policy alignment.',
    category: 'AUTH',
    severity: 'HIGH',
    impact: '+20 pts'
  },
  {
    id: 'URL-001',
    name: 'Raw IP Address URL',
    description: 'Hyperlink destination utilizes a numeric IPv4 address host instead of a registered domain.',
    category: 'URL',
    severity: 'HIGH',
    impact: '+20 pts'
  },
  {
    id: 'URL-002',
    name: 'Deceptive Link Text Mismatch',
    description: 'Displayed anchor text presents a domain that does not match the actual destination href.',
    category: 'URL',
    severity: 'HIGH',
    impact: '+20 pts'
  },
  {
    id: 'URL-003',
    name: 'URL Shortener Service Used',
    description: 'Hyperlink relies on an external shortening service (e.g., bit.ly, t.co, tinyurl.com).',
    category: 'URL',
    severity: 'MEDIUM',
    impact: '+10 pts'
  },
  {
    id: 'CNT-001',
    name: 'Credential Request Detected',
    description: 'Message body explicitly requests passwords, credentials, OTP tokens, or PIN entries.',
    category: 'CONTENT',
    severity: 'MEDIUM',
    impact: '+10 pts'
  },
  {
    id: 'CNT-002',
    name: 'Urgency & Coercion Tactics',
    description: 'Message utilizes coercive pressure language threatening account termination or immediate penalties.',
    category: 'CONTENT',
    severity: 'LOW',
    impact: '+5 pts'
  }
];

const TECH_STACK = [
  {
    component: 'Backend API Framework',
    technology: 'FastAPI',
    version: '>= 0.110.0',
    purpose: 'High-performance asynchronous REST API handling email intake and forensic pipelines.'
  },
  {
    component: 'Schema Validation',
    technology: 'Pydantic v2',
    version: '>= 2.6.0',
    purpose: 'Strict data modeling and serialization for parsed RFC 822 artifacts and risk reports.'
  },
  {
    component: 'DNS Resolution',
    technology: 'dnspython',
    version: '>= 2.6.0',
    purpose: 'Queries authoritative DNS TXT records for SPF (v=spf1) and DMARC (_dmarc) alignment.'
  },
  {
    component: 'HTML DOM Parsing',
    technology: 'BeautifulSoup4',
    version: '>= 4.12.0',
    purpose: 'Extracts hyperlinks, anchor texts, and formatting elements from HTML email bodies.'
  },
  {
    component: 'Frontend Framework',
    technology: 'React 18 & TypeScript',
    version: '^19.2 / ^6.0',
    purpose: 'Type-safe single-page user interface with client-side state and forensic views.'
  },
  {
    component: 'Build Tooling & Bundling',
    technology: 'Vite',
    version: '^8.2.0',
    purpose: 'Optimized frontend bundling and zero-config local development server.'
  }
];

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="pb-2 border-b border-[#E3E5DF]">
        <h1 className="text-2xl font-semibold tracking-tight text-[#242824]">
          About PhishGuard
        </h1>
        <p className="text-sm text-[#737873] mt-1 max-w-2xl">
          A lightweight, automated, and explainable cybersecurity platform for raw email header inspection, authentication verification, and threat heuristic scoring.
        </p>
      </div>

      {/* Section 1: Methodology Overview */}
      <div className="pg-panel p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#242824]">
          Methodology &amp; Architecture
        </h2>
        <div className="text-xs text-[#242824] leading-relaxed space-y-3">
          <p>
            PhishGuard operates as a transparent first line of defense for security analysts and developers. Rather than outputting an opaque binary &ldquo;safe/unsafe&rdquo; verdict, PhishGuard unpacks standard RFC 822 email structures into structured metadata, verifies authentication protocol alignment against authoritative DNS records, inspects hyperlink mechanics for deception, and attributes risk score contributions to explicit, documented detection rules.
          </p>
          <p>
            The scoring system normalizes risk from 0 to 100 points across four discrete tiers: <strong>Legitimate (0–30)</strong>, <strong>Suspicious (31–60)</strong>, <strong>Likely Phishing (61–80)</strong>, and <strong>Critical Threat (81–100)</strong>. Every triggered rule provides immediate attribution so incident responders understand exactly why a message triggered security flags.
          </p>
        </div>
      </div>

      {/* Section 2: Technology Stack Table */}
      <div className="pg-panel overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E3E5DF] bg-white">
          <h2 className="text-sm font-semibold text-[#242824]">
            Technology Stack &amp; Dependencies
          </h2>
          <p className="text-xs text-[#737873] mt-0.5">Core tools utilized across the backend analysis engine and frontend interface</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F0F2ED] text-[#737873] font-medium border-b border-[#E3E5DF]">
                <th className="py-2.5 px-4 font-medium w-48">Component</th>
                <th className="py-2.5 px-4 font-medium w-40">Technology</th>
                <th className="py-2.5 px-4 font-medium w-28 font-mono">Version</th>
                <th className="py-2.5 px-4 font-medium">Role in Architecture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5DF] text-[#242824]">
              {TECH_STACK.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F7F7F4] transition-colors">
                  <td className="py-3 px-4 font-medium text-[#242824]">
                    {item.component}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#456B55]">
                    {item.technology}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#737873]">
                    {item.version}
                  </td>
                  <td className="py-3 px-4 text-[#737873] leading-relaxed">
                    {item.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Active Detection Rules Matrix */}
      <div className="pg-panel overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E3E5DF] bg-white flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#242824]">
              Active Detection Rules (10 Core Heuristics)
            </h2>
            <p className="text-xs text-[#737873] mt-0.5">Scoring weights and indicator attribution catalog</p>
          </div>
          <span className="text-xs font-mono text-[#456B55] bg-[#EDF2EE] px-2 py-0.5 rounded border border-[#D2D5CD]">
            Engine v1.0
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F0F2ED] text-[#737873] font-medium border-b border-[#E3E5DF]">
                <th className="py-2.5 px-4 font-medium w-24">Rule ID</th>
                <th className="py-2.5 px-4 font-medium w-48">Rule Name</th>
                <th className="py-2.5 px-4 font-medium">Description</th>
                <th className="py-2.5 px-4 font-medium w-24">Category</th>
                <th className="py-2.5 px-4 font-medium w-24 text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5DF] text-[#242824]">
              {DETECTION_RULES.map((rule) => (
                <tr key={rule.id} className="hover:bg-[#F7F7F4] transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-[#456B55]">
                    {rule.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#242824]">
                    {rule.name}
                  </td>
                  <td className="py-3 px-4 text-[#737873] leading-relaxed">
                    {rule.description}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#737873]">
                    <span className="bg-[#F0F2ED] px-1.5 py-0.5 rounded border border-[#E3E5DF]">
                      {rule.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-[#991B1B]">
                    {rule.impact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Technical Limitations & Disclaimers */}
      <div className="pg-panel p-5 space-y-3 border-l-4 border-l-[#825B00]">
        <h2 className="text-sm font-semibold text-[#242824]">
          Technical Limitations &amp; Security Disclaimers
        </h2>
        <ul className="space-y-2 text-xs text-[#242824] list-disc pl-4 leading-relaxed">
          <li>
            <strong>SPF Authentication:</strong> SPF PASS indicates that the sending server IP address was authorized by the domain&rsquo;s DNS SPF record; it does not guarantee that the email content itself is benign.
          </li>
          <li>
            <strong>DKIM Signature Scope:</strong> PhishGuard inspects DKIM validation results reported by the receiving mail server headers (RFC 8601). In the current release, it does not perform raw RSA cryptographic signature recalculation.
          </li>
          <li>
            <strong>HTTPS Protocol:</strong> The presence of HTTPS indicates encrypted communication channel transport, not destination website legitimacy or benevolence.
          </li>
          <li>
            <strong>Heuristic Boundary:</strong> Detection rules are heuristic risk indicators. PhishGuard is designed as an explainable triage assistant and should be used alongside standard organizational threat intelligence and incident response procedures.
          </li>
        </ul>
      </div>

      {/* Section 5: Future Scope Roadmap */}
      <div className="pg-panel p-5 space-y-3">
        <h2 className="text-sm font-semibold text-[#242824] pb-2 border-b border-[#E3E5DF]">
          Future Scope &amp; Planned Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#242824]">
          <div className="p-3 rounded bg-[#F7F7F4] border border-[#E3E5DF] space-y-1">
            <div className="font-semibold text-[#456B55]">MITRE ATT&amp;CK Mapping</div>
            <div className="text-[#737873] leading-relaxed">
              Automated mapping of detected phishing indicators to standard MITRE Enterprise techniques including T1566 (Phishing) and T1036 (Masquerading).
            </div>
          </div>
          <div className="p-3 rounded bg-[#F7F7F4] border border-[#E3E5DF] space-y-1">
            <div className="font-semibold text-[#456B55]">SOC Incident &amp; Export Reporting</div>
            <div className="text-[#737873] leading-relaxed">
              Analyst queue management, persistent database audit logs, and downloadable executive PDF / JSON security summary reports.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
