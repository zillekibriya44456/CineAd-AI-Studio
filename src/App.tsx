import React, { useState } from "react";
import { 
  Sparkles, 
  Video, 
  TrendingUp, 
  Brain, 
  Layers, 
  Megaphone, 
  Globe, 
  Search, 
  Zap, 
  Tv, 
  Smartphone, 
  CheckCircle, 
  Users, 
  BarChart2, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight,
  Flame,
  Award,
  Check,
  Copy
} from "lucide-react";
import { CampaignBrief, CampaignData } from "./types";
import { PRESET_CAMPAIGNS } from "./presets";
import CinePlayer from "./components/CinePlayer";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [brief, setBrief] = useState<CampaignBrief>({
    productName: "",
    brandName: "",
    websiteUrl: "",
    category: "",
    targetAudience: "",
    goal: "Brand Awareness",
    ideaPrompt: ""
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(PRESET_CAMPAIGNS[0]); // Default to EV preset for immediate visual brilliance
  const [activeTab, setActiveTab] = useState<string>("storyboards");
  const [activeAdIndex, setActiveAdIndex] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<string>("");
  const [generationError, setGenerationError] = useState<string>("");

  // Simulated live loading status texts matching exact steps
  const loadingSteps = [
    "Contacting Brand Intelligence Engine & Extracting Brand DNA...",
    "Querying Market Research AI for competitor trends & gaps...",
    "Activating Consumer Psychology AI to map core emotional triggers...",
    "Injecting AIDA & Hero's Journey copywriting formulas...",
    "Rendering Cinematic Scene Storyboards with VFX & Director directives...",
    "Running Virality Predictions & compiling adaptation report..."
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrief((prev) => ({ ...prev, [name]: value }));
  };

  const loadPreset = (preset: CampaignData) => {
    setBrief(preset.brief);
    setCampaignData(preset);
    setActiveAdIndex(0);
    setActiveTab("storyboards");
  };

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.productName || !brief.brandName || !brief.targetAudience) {
      alert("Please fill in Product Name, Brand Name, and Target Audience to authorize research.");
      return;
    }

    setIsLoading(true);
    setLoadingStep(0);
    setGenerationError("");

    // Simulate multi-step progress steps to give a hollywood production feeling
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1800);

    try {
      const response = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });

      const data = await response.json();
      if (data) {
        setCampaignData(data);
        setActiveTab("storyboards");
        if (data._debug_notice) {
          setGenerationError(data._debug_notice);
        }
      }
    } catch (error: any) {
      console.error(error);
      setGenerationError("An unexpected error occurred during direct production. Simulated fallback generated.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(""), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-600 selection:text-white" id="main_container">
      {/* Premium Navigation Header */}
      <nav className="border-b border-slate-900 bg-slate-950/90 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-violet-600 to-amber-500 p-2.5 rounded-xl shadow-lg border border-violet-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-violet-400 font-bold block leading-none">AI CREATIVE ALLY</span>
              <h1 className="text-xl font-bold font-sans tracking-tight text-white mt-0.5" id="nav_title">CineAd AI Studio</h1>
            </div>
          </div>

          {/* Quick interactive shortcuts to test immediately */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs text-slate-400 font-mono">⚡ DEMO PRESETS:</span>
            {PRESET_CAMPAIGNS.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  campaignData?.id === p.id 
                    ? "bg-violet-950/40 border-violet-700/80 text-violet-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
                title="Immediately load gorgeous mock campaign"
              >
                {p.brief.productName}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Header introducing features */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/60 px-6 py-10 border-b border-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
            🎬 The Absolute Infinite Advertising Ecosystem
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-4 font-sans max-w-2xl mx-auto">
            Create award-winning cinematic advertising in seconds
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Input a brand concept. Our engine automatically conducts competitor deep-research, studies emotional target psychology, and creates modular Hollywood-grade multi-style storyboards and optimized copy variations.
          </p>
        </div>
      </div>

      {campaignData && generationError && (
        <div className="max-w-7xl mx-auto mt-6 px-6">
          <div className="bg-amber-950/30 border border-amber-900/60 p-3 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{generationError}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Panel: Brand & Campaign Builder */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-850 p-6 rounded-2xl shadow-xl h-fit self-start">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-md font-bold text-slate-100 font-sans uppercase tracking-wide">Brief Configuration</h3>
          </div>

          <form onSubmit={handleLaunchCampaign} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Product Name</label>
              <input
                type="text"
                name="productName"
                placeholder="e.g. Vyom eV-X"
                value={brief.productName}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Brand Name</label>
              <input
                type="text"
                name="brandName"
                placeholder="e.g. Vyom Motors"
                value={brief.brandName}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Website URL (Optional)</label>
              <input
                type="url"
                name="websiteUrl"
                placeholder="e.g. https://vyom-ev.in"
                value={brief.websiteUrl}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Business or Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Premium Electric SUV"
                value={brief.category}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Target Audience</label>
              <textarea
                name="targetAudience"
                placeholder="e.g. Affluent professionals, design pioneers, eco-conscious explorers"
                value={brief.targetAudience}
                onChange={handleInputChange}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Goal of Advertisement</label>
              <select
                name="goal"
                value={brief.goal}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition"
              >
                <option value="Brand Awareness">Prestige Creation & Awareness</option>
                <option value="Product Launch">Preorder Product Launch</option>
                <option value="DTC High-Conversions">DTC Direct-to-Consumer Sales</option>
                <option value="Retention & Loyalty">Loyalty & Retention Story</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Simple Idea or Core Theme</label>
              <textarea
                name="ideaPrompt"
                placeholder="e.g. Himalayan mountain climb under auroras with cosmic music"
                value={brief.ideaPrompt}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg relative overflow-hidden active:scale-[0.98] group"
              id="btn_launch_production"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-white group-hover:animate-ping" />
              )}
              {isLoading ? "PRODUCING WITH GEMINI..." : "LAUNCH CAMPAIGN CREATION"}
            </button>
          </form>

          {/* Loader Stage Indicators */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 border-t border-slate-800/80 pt-4"
              >
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-bold">PRODUCTION PIPELINE</span>
                    <span className="text-[10px] font-mono text-slate-500">{loadingStep + 1}/{loadingSteps.length}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans tracking-wide leading-relaxed font-semibold transition-all">
                    {loadingSteps[loadingStep]}
                  </p>
                  
                  {/* Visual moving bar */}
                  <div className="w-full bg-slate-900 border border-slate-800/40 h-2 mt-3.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-violet-600 to-amber-400 h-full transition-all duration-[1200ms] rounded-full"
                      style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Dashboard Workspace Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {campaignData ? (
            <div className="space-y-6">
              
              {/* Strategic workspace Tab bar */}
              <div className="flex border-b border-slate-900 bg-slate-900/20 p-1.5 rounded-xl border border-slate-850 flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("storyboards")}
                  className={`text-xs font-semibold px-4.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === "storyboards" 
                      ? "bg-violet-950/40 border border-violet-700/60 text-violet-300 shadow" 
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                  id="tab_trigger_storyboards"
                >
                  <Video className="w-4 h-4 text-violet-400" /> Cinematic Storyboards
                </button>

                <button
                  onClick={() => setActiveTab("brand_intelligence")}
                  className={`text-xs font-semibold px-4.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === "brand_intelligence" 
                      ? "bg-violet-950/40 border border-violet-700/60 text-violet-300 shadow" 
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                  id="tab_trigger_brand"
                >
                  <Layers className="w-4 h-4 text-blue-400" /> Brand Intelligence
                </button>

                <button
                  onClick={() => setActiveTab("psychology")}
                  className={`text-xs font-semibold px-4.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === "psychology" 
                      ? "bg-violet-950/40 border border-violet-700/60 text-violet-300 shadow" 
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                  id="tab_trigger_psychology"
                >
                  <Users className="w-4 h-4 text-emerald-400" /> Target Psychology
                </button>

                <button
                  onClick={() => setActiveTab("virality")}
                  className={`text-xs font-semibold px-4.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === "virality" 
                      ? "bg-violet-950/40 border border-violet-700/60 text-violet-300 shadow" 
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                  id="tab_trigger_virality"
                >
                  <TrendingUp className="w-4 h-4 text-amber-400" /> Virality & A/B Variations
                </button>
              </div>

              {/* TAB 1 CONTENT: Dynamic Cinematic Player & Scripts */}
              {activeTab === "storyboards" && (
                <div className="space-y-6">
                  {/* Sub-style Selector buttons inside Storyboards */}
                  <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-center justify-between flex-wrap gap-4">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4 text-violet-400" /> CINEMATIC STYLES:
                    </span>
                    <div className="flex gap-2.5 flex-wrap">
                      {campaignData.ads.map((ad, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveAdIndex(index)}
                          className={`text-xs px-3.5 py-1.5 rounded-lg font-bold border transition-all ${
                            activeAdIndex === index
                              ? "bg-amber-500 border-amber-600 text-slate-950 shadow-md"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {ad.styleName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Render the Cinematic Animatic Video Board Player */}
                  {campaignData.ads[activeAdIndex] && (
                    <CinePlayer ad={campaignData.ads[activeAdIndex]} />
                  )}

                  {/* Copywriting Details Card */}
                  {campaignData.ads[activeAdIndex] && (
                    <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-400" />
                          <h4 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold">Copywriting Directives</h4>
                        </div>
                        <button
                          onClick={() => copyToClipboard(
                            `Hook: ${campaignData.ads[activeAdIndex].hook}\nNarrative: ${campaignData.ads[activeAdIndex].bodyCopy}\nCTA: ${campaignData.ads[activeAdIndex].callToAction}`,
                            `script_${activeAdIndex}`
                          )}
                          className="text-[11px] text-violet-400 hover:text-violet-300 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                          id={`btn_copy_script_${activeAdIndex}`}
                        >
                          {copiedText === `script_${activeAdIndex}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Campaign Copy
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4 space-y-4">
                          <div className="bg-slate-950 border border-slate-800/50 p-3.5 rounded-xl">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 block font-semibold mb-1">AIDA/PAS Core Formula</span>
                            <span className="text-xs text-slate-200 font-bold bg-slate-900 border border-slate-800/60 px-2 py-0.5 rounded">
                              {campaignData.ads[activeAdIndex].scriptFramework}
                            </span>
                          </div>
                          <div className="bg-slate-950 border border-slate-800/50 p-3.5 rounded-xl">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-semibold mb-1">Marketing Target</span>
                            <p className="text-xs text-slate-400 leading-normal">{campaignData.ads[activeAdIndex].marketingObjective}</p>
                          </div>
                        </div>

                        <div className="md:col-span-8 space-y-4">
                          <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                            <p className="text-[10px] font-mono tracking-wider uppercase text-amber-400 font-bold mb-1">STORYTELLER HOOK (First 3s)</p>
                            <p className="text-xs text-slate-200 leading-relaxed font-medium">"{campaignData.ads[activeAdIndex].hook}"</p>
                          </div>

                          <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                            <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold mb-1">NARRATION & STRATEGY COPY</p>
                            <p className="text-xs text-slate-200 leading-relaxed font-sans">{campaignData.ads[activeAdIndex].bodyCopy}</p>
                          </div>

                          <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl border-l-2 border-l-violet-500">
                            <p className="text-[10px] font-mono tracking-wider uppercase text-violet-400 font-bold mb-1">CALL TO ACTION (CTA)</p>
                            <p className="text-xs text-slate-200 font-bold">"{campaignData.ads[activeAdIndex].callToAction}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2 CONTENT: Brand DNA & Competitor analytics */}
              {activeTab === "brand_intelligence" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  
                  {/* Brand DNA Card */}
                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="px-2.5 py-1 rounded bg-violet-950/40 border border-violet-850 text-[10px] font-mono tracking-widest text-violet-400 font-bold uppercase block w-fit mb-3">
                        Brand Identity DNA
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-100 font-sans tracking-wide uppercase mb-2">Internal Strategic Core</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{campaignData.brandIntelligence.brandDna}</p>
                    </div>
                    <div className="border-t border-slate-800/60 pt-4 mt-6">
                      <span className="text-[10px] font-mono text-slate-500 block">Sought Archetype:</span>
                      <p className="text-xs text-amber-400 font-bold italic mt-0.5">{campaignData.brandIntelligence.brandArchetype}</p>
                    </div>
                  </div>

                  {/* Brand Voice / Founder Card */}
                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-850 text-[10px] font-mono tracking-widest text-blue-400 font-bold uppercase block w-fit mb-3">
                        Brand Persona Voice
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-100 font-sans tracking-wide uppercase mb-2">Audible Tone Guide</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">"{campaignData.brandIntelligence.brandVoice}"</p>
                      
                      <h4 className="text-sm font-extrabold text-slate-100 font-sans tracking-wide uppercase mb-2 mt-5">The Founder story</h4>
                      <p className="text-xs text-slate-400 leading-relaxed italic">"{campaignData.brandIntelligence.brandStory}"</p>
                    </div>
                    <div className="border-t border-slate-800/60 pt-4 mt-4">
                      <span className="text-[10px] font-mono text-slate-500 block">Market Positioning:</span>
                      <p className="text-xs text-slate-200 mt-0.5 font-sans font-medium">{campaignData.brandIntelligence.marketPositioning}</p>
                    </div>
                  </div>

                  {/* Market Research Cards */}
                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl md:col-span-2">
                    <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-2">
                      <Search className="w-4 h-4 text-amber-400" /> Market Intelligence Report
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-mono text-red-400 font-bold block mb-1.5 uppercase">Primary Competitors</span>
                        <ul className="space-y-1.5">
                          {campaignData.marketReport.competitors.map((item, id) => (
                            <li key={id} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-red-500 mt-1">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-mono text-violet-400 font-bold block mb-1.5 uppercase">Viral Industry Trends</span>
                        <ul className="space-y-1.5">
                          {campaignData.marketReport.trends.map((item, id) => (
                            <li key={id} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-violet-500 mt-1">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-mono text-amber-400 font-bold block mb-1.5 uppercase">Observed Gaps</span>
                        <ul className="space-y-1.5">
                          {campaignData.marketReport.marketGaps.map((item, id) => (
                            <li key={id} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-amber-500 mt-1">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1.5 uppercase">Exploitable Opportunities</span>
                        <ul className="space-y-1.5">
                          {campaignData.marketReport.opportunities.map((item, id) => (
                            <li key={id} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-emerald-500 mt-1">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3 CONTENT: Consumer Psychology Analysis */}
              {activeTab === "psychology" && (
                <div className="space-y-6">
                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
                    <span className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-850 text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase block w-fit mb-3">
                      Psycho-Dynamic Target Profiling
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-100 font-sans tracking-wide uppercase mb-2">Target Audience Behavior Model</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">"{campaignData.consumerPsychology.buyingBehavior}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Emotional Triggers */}
                    <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-red-400 animate-pulse" /> Subconscious Emotional Triggers
                      </h4>
                      <ul className="space-y-2.5">
                        {campaignData.consumerPsychology.emotionalTriggers.map((t, idx) => (
                          <li key={idx} className="bg-slate-950/80 border border-slate-800/60 p-3 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                            <span className="text-red-400 text-sm font-mono mt-0.5">#{idx + 1}</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Customer Pain points */}
                    <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-500" /> Relieved Pain Points & Friction
                      </h4>
                      <ul className="space-y-2.5">
                        {campaignData.consumerPsychology.painPoints.map((p, idx) => (
                          <li key={idx} className="bg-slate-950/80 border border-slate-800/60 p-3 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                            <span className="text-amber-500 text-sm font-mono mt-0.5">#{idx + 1}</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Aspirations */}
                    <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-violet-400" /> Core Customer Aspirations
                      </h4>
                      <ul className="space-y-2.5">
                        {campaignData.consumerPsychology.aspirations.map((a, idx) => (
                          <li key={idx} className="bg-slate-950/80 border border-slate-800/60 p-3 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                            <span className="text-violet-400 text-sm font-mono mt-0.5">#{idx + 1}</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Trust indicators */}
                    <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Essential Trust Enhancers
                      </h4>
                      <ul className="space-y-2.5">
                        {campaignData.consumerPsychology.trustFactors.map((t, idx) => (
                          <li key={idx} className="bg-slate-950/80 border border-slate-800/60 p-3 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                            <span className="text-emerald-400 text-sm font-mono mt-0.5">#{idx + 1}</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4 CONTENT: Virality & Optimization Metrics page */}
              {activeTab === "virality" && (
                <div className="space-y-6">
                  {/* Performance Indicators Grid */}
                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
                    <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-violet-400" /> Virality Scoreboard Analytics
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-center">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Engagement</span>
                        <div className="text-2xl font-black font-sans text-violet-400">{campaignData.virality.engagementScore}/100</div>
                        <span className="text-[9px] text-slate-500 font-mono">Likely shareability</span>
                      </div>

                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-center">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Viral odds</span>
                        <div className="text-2xl font-black font-sans text-amber-400">{campaignData.virality.viralProbability}%</div>
                        <span className="text-[9px] text-slate-500 font-mono">Algorithmic pick</span>
                      </div>

                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-center">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Predicted CTR</span>
                        <div className="text-2xl font-black font-sans text-blue-400">{campaignData.virality.ctr}%</div>
                        <span className="text-[9px] text-slate-500 font-mono">Industry benchmarks ≈ 2%</span>
                      </div>

                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-center">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Conversions</span>
                        <div className="text-2xl font-black font-sans text-emerald-400">{campaignData.virality.conversionRate}%</div>
                        <span className="text-[9px] text-slate-500 font-mono">Sales target</span>
                      </div>

                      <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-center col-span-2 md:col-span-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Retention</span>
                        <div className="text-2xl font-black font-sans text-pink-400">{campaignData.virality.retentionRate}%</div>
                        <span className="text-[9px] text-slate-500 font-mono">Average watch time</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Platform Auto Adaptation Cards */}
                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
                    <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-400" /> Platform Specific Adaptations (9:16 / 1:1 / 16:9)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl relative overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-pink-400 tracking-wider font-bold uppercase">Vertical Crop</span>
                            <Smartphone className="w-4 h-4 text-pink-400" />
                          </div>
                          <h5 className="text-xs font-bold text-slate-100 uppercase">TikTok & Reels (9:16)</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-2 italic">
                            "Cut intro duration down to 1.5 seconds. Overlay neon-bordered progress bars immediately of {campaignData.brief.productName}. Focus on the visual hook first."
                          </p>
                        </div>
                        <span className="text-[9px] text-pink-300 font-mono mt-4 self-end">Boost hook rate by +14%</span>
                      </div>

                      <div className="bg-slate-955 border border-slate-800 p-4 rounded-xl relative overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-amber-400 tracking-wider font-bold uppercase">Square Grid</span>
                            <Smartphone className="w-4 h-4 text-slate-500" />
                          </div>
                          <h5 className="text-xs font-bold text-slate-100 uppercase">Instagram Feed (1:1)</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-2 italic">
                            "Post as high-resolution carousel showcasing close-ups of pure material craft with cinematic typography cards. Highlight customer review quotes."
                          </p>
                        </div>
                        <span className="text-[9px] text-amber-300 font-mono mt-4 self-end">Boost CTR by +8%</span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl relative overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-blue-400 tracking-wider font-bold uppercase">Widescreen</span>
                            <Tv className="w-4 h-4 text-blue-400" />
                          </div>
                          <h5 className="text-xs font-bold text-slate-100 uppercase">YouTube & TV (16:9)</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-2 italic">
                            "Deploy fully orchestrations with maximum high-frequency dynamic lighting. Keep the deep British voiceover intact for continuous premium immersion."
                          </p>
                        </div>
                        <span className="text-[9px] text-blue-300 font-mono mt-4 self-end">Optimized for brand equity</span>
                      </div>
                    </div>
                  </div>

                  {/* A/B Optimization recommendations */}
                  <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-4">
                      🧠 AI Creative Director Recommendations (A/B testing versions)
                    </h4>
                    <div className="space-y-3">
                      {campaignData.virality.improvements.map((rec, id) => (
                        <div key={id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-300 font-sans leading-relaxed">{rec}</p>
                        </div>
                      ))}
                      {campaignData.virality.strengths.map((st, id) => (
                        <div key={id} className="bg-slate-950/80 border border-slate-800/40 p-3 rounded-xl flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-300 font-sans leading-relaxed"><strong>Strength Multiplier:</strong> {st}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-16 text-center shadow-xl">
              <Megaphone className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-200">No Active Production Workspace</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                Select one of the **Demo Presets** in the navigation bar above or specify your customized brief in the editor, then hit launch to generate.
              </p>
            </div>
          )}

        </div>

      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-900 py-10 mt-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-slate-500 font-mono">
            CineAd AI Studio © 2026. Powered by Google Gemini 3.5 & Imagen. Produced autonomously with Hollywood specifications.
          </p>
        </div>
      </footer>
    </div>
  );
}
