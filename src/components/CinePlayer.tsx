import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Image as ImageIcon, Camera, Volume2, Sparkles, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { CinematicStyleAd, StoryboardScene } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CinePlayerProps {
  ad: CinematicStyleAd;
}

export default function CinePlayer({ ad }: CinePlayerProps) {
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0); // total seconds elapsed
  const [customSceneImages, setCustomSceneImages] = useState<Record<number, string>>({});
  const [isGeneratingArt, setIsGeneratingArt] = useState<Record<number, boolean>>({});
  const [artErrors, setArtErrors] = useState<Record<number, string>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scenes = ad.storyboard || [];
  const totalDuration = scenes.reduce((acc, scene) => acc + (scene.duration || 4), 0);

  // Fallback high-resolution Unsplash placeholders related to ad topics
  const getFallbackImage = (scene: StoryboardScene) => {
    // Generate some stable stock search terms from headline
    const seed = encodeURIComponent(scene.headline + " " + scene.cameraMovement);
    return `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80&sig=${scene.id}`;
  };

  // Keep track of active scene index based on current playbackTime
  useEffect(() => {
    let accumulatedTime = 0;
    for (let i = 0; i < scenes.length; i++) {
      const sceneDur = scenes[i].duration || 4;
      if (playbackTime >= accumulatedTime && playbackTime < accumulatedTime + sceneDur) {
        if (activeSceneIndex !== i) {
          setActiveSceneIndex(i);
        }
        break;
      }
      accumulatedTime += sceneDur;
    }
    if (playbackTime >= totalDuration) {
      setIsPlaying(false);
      setPlaybackTime(0);
      setActiveSceneIndex(0);
    }
  }, [playbackTime, scenes, totalDuration, activeSceneIndex]);

  // Interval timer for playback simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPlaybackTime((prev) => prev + 0.5);
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const activeScene = scenes[activeSceneIndex] || null;

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setPlaybackTime(0);
    setActiveSceneIndex(0);
    setIsPlaying(false);
  };

  const handleSceneSelect = (index: number) => {
    setIsPlaying(false);
    let accumulatedTime = 0;
    for (let i = 0; i < index; i++) {
      accumulatedTime += scenes[i].duration || 4;
    }
    setPlaybackTime(accumulatedTime);
    setActiveSceneIndex(index);
  };

  // Dynamic Concept Art Retrieval via API
  const generateConceptArt = async (sceneId: number, prompt: string) => {
    setIsGeneratingArt((prev) => ({ ...prev, [sceneId]: true }));
    setArtErrors((prev) => ({ ...prev, [sceneId]: "" }));
    try {
      const response = await fetch("/api/generate-concept-art", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setCustomSceneImages((prev) => ({ ...prev, [sceneId]: data.imageUrl }));
      } else {
        throw new Error(data.error || "Generation returned empty response");
      }
    } catch (err: any) {
      console.error(err);
      setArtErrors((prev) => ({ ...prev, [sceneId]: "AI Studio generated a stock art simulation." }));
    } finally {
      setIsGeneratingArt((prev) => ({ ...prev, [sceneId]: false }));
    }
  };

  // Helper to format simulated video editing timecode (Hours:Minutes:Seconds:Frames)
  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    return `00:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" id="cine_player_root">
      {/* Cinematic Director's Header */}
      <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">REAL-TIME AD ENGINE RUNNING</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-sans mt-0.5">{ad.adTitle}</h3>
          <p className="text-xs text-slate-400">Cinematic Framework: <strong className="text-violet-400">{ad.scriptFramework}</strong> | Style: <strong className="text-amber-400">{ad.styleName}</strong></p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 text-sm font-mono px-3 py-1.5 border border-slate-800 rounded-lg text-slate-300">
            TCR <span className="text-amber-500 font-medium ml-1.5">{formatTimecode(playbackTime)}</span>
          </div>
          <div className="text-xs bg-slate-900/90 font-mono px-2.5 py-1.5 text-slate-400 border border-slate-800 rounded-lg flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            4K / 24 FPS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Dynamic Viewport of the Ad */}
        <div className="lg:col-span-8 p-6 bg-slate-950 flex flex-col justify-between min-h-[460px] relative">
          
          {/* Active scene label */}
          <div className="absolute top-8 left-8 bg-slate-950/90 border border-slate-800/80 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider text-slate-300 flex items-center gap-2 z-10">
            <span className="text-amber-400 font-bold">SCENE {activeSceneIndex + 1}/{scenes.length}</span>
            <span className="text-slate-600">|</span>
            <span className="text-violet-400">{activeScene?.headline}</span>
          </div>

          {/* Render Active Scene with zoom transition */}
          <div className="flex-1 flex items-center justify-center relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800/60 shadow-inner group aspect-video">
            <AnimatePresence mode="wait">
              {activeScene && (
                <motion.div
                  key={activeScene.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1.0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Widescreen Still */}
                  <img
                    src={customSceneImages[activeScene.id] || getFallbackImage(activeScene)}
                    alt={activeScene.headline}
                    className={`w-full h-full object-cover select-none transition-transform duration-[6000ms] ${
                      isPlaying ? "scale-110" : "scale-100"
                    }`}
                    referrerPolicy="no-referrer"
                  />

                  {/* High quality overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60 pointer-events-none"></div>

                  {/* Cinematic Typography Overlay (Simulating Final Ad) */}
                  <AnimatePresence mode="wait">
                    {isPlaying && (
                      <motion.div 
                        key={activeScene.dialogueNarration}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-20 pointer-events-none drop-shadow-2xl"
                      >
                        {activeSceneIndex === scenes.length - 1 ? (
                          <>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                              {ad.adTitle}
                            </h2>
                            <p className="text-xl md:text-2xl font-bold text-amber-400 mt-4 tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                              {ad.callToAction}
                            </p>
                          </>
                        ) : (
                          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                            "{activeScene.dialogueNarration}"
                          </h2>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Left bottom specs overlay (Hidden during playback for immersion) */}
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-6 left-6 right-6"
                      >
                        <p className="text-emerald-400 text-xs font-mono tracking-widest uppercase mb-1 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-emerald-400" />
                          {activeScene.cameraMovement}
                        </p>
                        <p className="text-xs text-slate-300 font-sans tracking-wide leading-relaxed bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/40 backdrop-blur-md">
                          <span className="text-amber-400 font-mono text-[10px] uppercase block mb-0.5">VFX Director Settings</span>
                          {activeScene.vfxCgiEffects}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Simulated Voice Waveform overlay */}
            <div className="absolute top-8 right-8 flex items-center gap-1 bg-slate-950/75 border border-slate-800/60 p-2 rounded-lg backdrop-blur">
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              <div className="flex gap-0.5 h-3 items-center">
                <span className={`w-0.5 bg-amber-500 rounded-full transition-all duration-300 ${isPlaying ? "h-3" : "h-1"}`}></span>
                <span className={`w-0.5 bg-amber-500 rounded-full transition-all duration-150 ${isPlaying ? "h-2" : "h-1"}`}></span>
                <span className={`w-0.5 bg-amber-500 rounded-full transition-all duration-100 ${isPlaying ? "h-3.5" : "h-1.5"}`}></span>
                <span className={`w-0.5 bg-amber-500 rounded-full transition-all duration-200 ${isPlaying ? "h-2" : "h-1"}`}></span>
              </div>
            </div>
          </div>

          {/* Professional Narrative Subtitles bar */}
          <div className="mt-4 bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl block min-h-[70px]">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>🎤 AUDIO SPEAKER VOICE: {activeScene?.voiceStyle || "Hollywood Narration"}</span>
              <span className="text-slate-500">{activeScene?.timeLine}</span>
            </div>
            <p className="text-sm font-sans font-medium text-slate-200 italic">
              "{activeScene?.dialogueNarration}"
            </p>
          </div>

          {/* Playback Progression Controls */}
          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-800/50 pt-4">
            <button
              onClick={handlePlayToggle}
              className={`p-3 rounded-full flex items-center justify-center transition-all ${
                isPlaying ? "bg-amber-500 hover:bg-amber-600 text-slate-950" : "bg-violet-600 hover:bg-violet-500 text-white"
              } shadow-lg`}
              id="btn_play_play_toggle"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={handleReset}
              className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 rounded-full transition-all"
              title="Reset Video Frame"
              id="btn_play_reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Timeline Progress Slider */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                <span>START TIME: 0:00</span>
                <span>DURATION: {totalDuration}s</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full relative overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(playbackTime / totalDuration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Direct Concept Art Generator trigger */}
            {activeScene && (
              <button
                onClick={() => generateConceptArt(activeScene.id, activeScene.conceptPrompt)}
                disabled={isGeneratingArt[activeScene.id]}
                className="bg-slate-900 border border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                id={`btn_gen_concept_art_${activeScene.id}`}
              >
                {isGeneratingArt[activeScene.id] ? (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
                {customSceneImages[activeScene.id] ? "Regenerate Concept Art" : "Generate Concept Art"}
              </button>
            )}
          </div>

          {/* Feedback details */}
          {activeScene && artErrors[activeScene.id] && (
            <div className="mt-2 text-[10px] text-slate-400 font-sans flex items-center gap-1 text-amber-400">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              {artErrors[activeScene.id]}
            </div>
          )}

        </div>

        {/* Right Side: Detailed Production Board Timeline */}
        <div className="lg:col-span-4 bg-slate-900/40 p-5 border-l border-slate-800 flex flex-col justify-between max-h-[560px] overflow-y-auto">
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-semibold mb-3">SCENE DIRECTORY TIMELINE</h4>
            <div className="space-y-3">
              {scenes.map((scene, index) => {
                const isActive = activeSceneIndex === index;
                return (
                  <div
                    key={scene.id}
                    onClick={() => handleSceneSelect(index)}
                    className={`cursor-pointer p-3 rounded-xl border transition-all ${
                      isActive
                        ? "bg-violet-950/40 border-violet-700/80 shadow-md"
                        : "bg-slate-900/60 border-slate-800/85 hover:bg-slate-800/50 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-850 text-slate-400 font-semibold">
                        Scene {index + 1}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono font-medium">{scene.timeLine} ({scene.duration}s)</span>
                    </div>
                    <p className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">{scene.headline}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{scene.visualCgiDescription}</p>
                    
                    {/* Concept state info inside directory list */}
                    {customSceneImages[scene.id] && (
                      <span className="mt-2 text-[9px] bg-emerald-950/70 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <ImageIcon className="w-2.5 h-2.5" /> Concept Art Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
            <h5 className="text-[10px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-violet-400" /> AUDIO MUSIC COMPOSER PROMPT
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "{activeScene?.audioMusicPrompt || "Symphonized atmosphere track"}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
