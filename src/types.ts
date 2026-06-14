export interface CampaignBrief {
  productName: string;
  brandName: string;
  websiteUrl: string;
  category: string;
  targetAudience: string;
  goal: string;
  ideaPrompt: string;
}

export interface BrandIntelligence {
  brandDna: string;
  brandVoice: string;
  brandStory: string;
  brandArchetype: string;
  marketPositioning: string;
}

export interface ConsumerPsychology {
  emotionalTriggers: string[];
  buyingBehavior: string;
  painPoints: string[];
  aspirations: string[];
  trustFactors: string[];
}

export interface StoryboardScene {
  id: number;
  timeLine: string; // e.g. "0:00 - 0:04"
  headline: string;
  visualCgiDescription: string;
  cameraMovement: string; // e.g. "Orbiting drone shot", "360 rotation"
  vfxCgiEffects: string; // e.g. "Volumetric lighting", "Lens flares"
  dialogueNarration: string;
  audioMusicPrompt: string;
  voiceStyle: string; // e.g., "Deep Hollywood Nar narration", "Corporate Luxury"
  duration: number; // in seconds
  conceptPrompt: string; // The text prompt for generating this frame
}

export interface CinematicStyleAd {
  styleName: string; // e.g., "Hollywood Marvel", "Netflix Cinematic", "Premium Luxury", "Anime Cyberpunk"
  adTitle: string;
  scriptFramework: "AIDA" | "PAS" | "Storytelling" | "Hero Journey" | "Emotional Marketing";
  hook: string;
  bodyCopy: string;
  callToAction: string;
  marketingObjective: string;
  storyboard: StoryboardScene[];
}

export interface ViralityMetrics {
  engagementScore: number; // 0-100
  viralProbability: number; // 0-100
  ctr: number; // percentage
  conversionRate: number; // percentage
  retentionRate: number; // percentage
  strengths: string[];
  improvements: string[];
}

export interface CampaignData {
  id: string; // UUID or timestamp
  brief: CampaignBrief;
  brandIntelligence: BrandIntelligence;
  marketReport: {
    competitors: string[];
    trends: string[];
    marketGaps: string[];
    opportunities: string[];
  };
  consumerPsychology: ConsumerPsychology;
  ads: CinematicStyleAd[];
  virality: ViralityMetrics;
  createdAt: string;
}
