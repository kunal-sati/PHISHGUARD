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
    <div className="min-h-screen bg-[#0e1416] text-[#dee3e6] flex flex-col font-sans relative">
      {/* Decorative Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4cd7f6]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
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


    </div>
  );
}

export default App;
