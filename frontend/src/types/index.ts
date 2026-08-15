export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Classification = 'LEGITIMATE' | 'SUSPICIOUS' | 'LIKELY_PHISHING' | 'HIGHLY_SUSPICIOUS';

export interface EmailSummary {
  sender: string;
  recipient: string;
  subject: string;
  date?: string;
  reply_to?: string;
  return_path?: string;
  source_domain?: string;
}

export interface SPFResult {
  status: string;
  domain?: string;
  record?: string;
  details: string;
}

export interface DKIMResult {
  status: string;
  selector?: string;
  details: string;
  verified_by_phishguard: boolean;
}

export interface DMARCResult {
  status: string;
  policy?: string;
  record?: string;
  details: string;
}

export interface AuthenticationDetails {
  spf: SPFResult;
  dkim: DKIMResult;
  dmarc: DMARCResult;
}

export interface URLAnalysisItem {
  url: string;
  scheme?: string;
  hostname?: string;
  domain?: string;
  port?: number;
  path?: string;
  query?: string;
  url_length: number;
  subdomain_count: number;
  is_https: boolean;
  is_ip_host: boolean;
  is_shortener: boolean;
  display_text?: string;
  display_mismatch: boolean;
  risk_score_contribution: number;
  flags: string[];
}

export interface RiskIndicatorItem {
  rule_id: string;
  category: string;
  description: string;
  severity: RiskLevel;
  score_impact: number;
}

export interface AnalysisResponse {
  analysis_id: string;
  created_at: string;
  risk_score: number;
  risk_level: RiskLevel;
  classification: Classification;
  explanation: string;
  email: EmailSummary;
  authentication: AuthenticationDetails;
  urls: URLAnalysisItem[];
  indicators: RiskIndicatorItem[];
  recommendations: string[];
}
