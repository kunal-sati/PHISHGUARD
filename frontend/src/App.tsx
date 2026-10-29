import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { AboutPage } from './pages/AboutPage';
import type { AnalysisResponse } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse | null>(null);
  const [sessionAnalyses, setSessionAnalyses] = useState<AnalysisResponse[]>([]);

  const handleAnalysisComplete = (result: AnalysisResponse) => {
    setCurrentAnalysis(result);
    setSessionAnalyses((prev) => [...prev, result]);
    setActiveTab('result');
  };

  const handleSelectAnalysis = (analysis: AnalysisResponse) => {
    setCurrentAnalysis(analysis);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#242824] flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onStartAnalysis={() => setActiveTab('analyze')}
            sessionAnalyses={sessionAnalyses}
            onSelectAnalysis={handleSelectAnalysis}
          />
        )}

        {activeTab === 'analyze' && (
          <AnalyzePage onAnalysisComplete={handleAnalysisComplete} />
        )}

        {activeTab === 'result' && currentAnalysis && (
          <AnalysisResultPage
            result={currentAnalysis}
            onBack={() => setActiveTab('analyze')}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      <footer className="border-t border-[#E3E5DF] bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737873]">
          <div>PhishGuard — Lightweight Phishing Email Detection &amp; Security Analysis</div>
          <div className="flex items-center gap-3">
            <span>RFC 822 Forensics</span>
            <span className="text-[#D2D5CD]">/</span>
            <span>SPF &amp; DMARC DNS</span>
            <span className="text-[#D2D5CD]">/</span>
            <span>Heuristic Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
