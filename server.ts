import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dns from "dns";

// Fix Node system issues resolving local hosts if any
dns.setDefaultResultOrder("ipv4first");

// Initialize Gemini SDK lazily to avoid crashing on launch if key is absent
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using simulation fallbacks.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_FOR_TESTS",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Mock data generator for fallback if Gemini fails or Key is unset
function generateMockCampaign(brief: any) {
  const categories = brief.category || "General Business";
  const pName = brief.productName || "OrbitX Nano";
  const bName = brief.brandName || "Orbit Technologies";
  const goal = brief.goal || "Brand Awareness";
  const audience = brief.targetAudience || "Tech-savvy professionals";

  return {
    id: "camp_" + Date.now(),
    brief: {
      productName: pName,
      brandName: bName,
      websiteUrl: brief.websiteUrl || "https://orbitx.co",
      category: categories,
      targetAudience: audience,
      goal: goal,
      ideaPrompt: brief.ideaPrompt || "Launch this next-gen product with cinematic power."
    },
    brandIntelligence: {
      brandDna: `${bName} stands at the cutting edge of ${categories}. Its design philosophy revolves around minimalist elegance, futuristic sophistication, and flawless reliability.`,
      brandVoice: "Empathetic, highly intellectual, slightly provocative, yet exceptionally premium and reassuring.",
      brandStory: `Born from a vision to revolutionize ${categories}, ${bName} launched to solve the ultimate bottleneck for ${audience}. Every design is treated as a masterpiece.`,
      brandArchetype: "The Visionary (Magician) combined with The Innovator.",
      marketPositioning: "Ultra-premium pricing with unrivaled functionality, carving a blue ocean above existing tech utilities."
    },
    marketReport: {
      competitors: ["Global Conglomerates", "Legacy single-feature providers", "Incumbent budget options"],
      trends: ["Deep customization", "Sustainability as a core expectation", "Intuitive zero-learning curves"],
      marketGaps: ["High design paired with uncompromising performance", "Sincere human stories amidst empty technical specs"],
      opportunities: ["Pre-emptive positioning of luxury utility", "Direct visual storytelling via premium cinematic shorts"]
    },
    consumerPsychology: {
      emotionalTriggers: ["The thrill of being ahead of the curve", "Peace of mind through perfect design", "A sense of high-status alignment"],
      buyingBehavior: "Conducts multi-source elite reviews, prioritizes seamless experience, and makes buying decision within first 15 seconds of premium video content.",
      painPoints: ["Clunky interfaces that slow down daily productivity", "Cheap materials that wear out with high frequency", "Lack of personalized brand touchpoints"],
      aspirations: ["Unlocking maximum personal capability", "Owning aesthetic gear that acts as an extension of identity", "Joining an exclusive community of modern creators"],
      trustFactors: ["Flawless design proof", "5-star direct customer feedback on build quality", "Premium, slow-motion physical display reviews"]
    },
    ads: [
      {
        styleName: "Hollywood Avengers Style",
        adTitle: `Rise of ${pName}`,
        scriptFramework: "Hero Journey",
        hook: "Slow dark reveal. A low cosmic synth rumble vibration shakes the frame.",
        bodyCopy: "They said it was impossible to master this space. But true breakthrough doesn't ask permission. It creates its own atmosphere.",
        callToAction: `Join the Vanguard of Progress. Preorder ${pName} now.`,
        marketingObjective: "Unparalleled prestige creation and immediate pre-orders.",
        storyboard: [
          {
            id: 1,
            timeLine: "0:00 - 0:04",
            headline: "The Void Before Breakthrough",
            visualCgiDescription: "An expansive dark server landscape with floating mathematical holograms. The lighting is deep steel-blue, volumetric god rays piercing the fog.",
            cameraMovement: "A slow, breathless drone dive descending toward a monolithic silhouette.",
            vfxCgiEffects: "Vapor dispersion, micro-particle flares floating like nebulae, anamorphic lens flare.",
            dialogueNarration: "Some spend a lifetime dreaming of the future...",
            audioMusicPrompt: "A single, isolated sub-bass drop followed by a ticking, tense string crescendo.",
            voiceStyle: "Deep, gravelly, commanding male Hollywood narration style.",
            duration: 4,
            conceptPrompt: "Space Avengers style dark cinematic landscape with glowing technological monolith and volumetric god-rays, 8k"
          },
          {
            id: 2,
            timeLine: "0:04 - 0:08",
            headline: "The Spark of Innovation",
            visualCgiDescription: "Close-up on the polished surface of the product. Infinite metallic reflections ripple over curves. A laser thin orange lightning beam charges the inner core.",
            cameraMovement: "Macro 360-degree high speed orbit rotating around the chassis.",
            vfxCgiEffects: "Laser etching sparks, plasma charge glowing from inside, hyper-realistic dust particles.",
            dialogueNarration: "...while others silently construct it.",
            audioMusicPrompt: "Epic cinematic brass horns swell loudly, synchronized with the laser flash.",
            voiceStyle: "Intense, whispers matching the speed of cinematic growth.",
            duration: 4,
            conceptPrompt: "Macro extreme close up of a sleek, ultra-luxury high tech device with internal orange electrical currents, studio-lighting"
          },
          {
            id: 3,
            timeLine: "0:08 - 0:12",
            headline: "Universal Domination",
            visualCgiDescription: "The device rises majestic in front of an ultra-high-resolution view of Planet Earth from orbit. Sunlight bursts through the horizon.",
            cameraMovement: "Expansive camera zoom-out, revealing global scale orbits.",
            vfxCgiEffects: "High-contrast solar flares, planet atmosphere scatter glow, cinematic motion blur.",
            dialogueNarration: `Introducing ${pName} by ${bName}. The paradigm shift is complete.`,
            audioMusicPrompt: "Thundering orchestral percussion kicks in, establishing a powerful heroic rhythm.",
            voiceStyle: "Commanding, triumphant, cinematic and epic.",
            duration: 4,
            conceptPrompt: "Sleek obsidian tech device floating in Earth orbit with sun setting, glorious lens flare, blockbuster cinematic style"
          },
          {
            id: 4,
            timeLine: "0:12 - 0:15",
            headline: "The Absolute Call",
            visualCgiDescription: "Deep matte black background. Golden illuminated typography of the product name dissolves onto the screen with smoke dispersion curves.",
            cameraMovement: "Steady lock-down zoom focus on bold text and product shadow.",
            vfxCgiEffects: "Ethereal smoke dispersion, metallic chrome reflections on text layers.",
            dialogueNarration: "Own the future. Before it owns you.",
            audioMusicPrompt: "Abrupt, dramatic climax cut with a powerful echo tail.",
            voiceStyle: "Whispered, iconic, lingering luxury cadence.",
            duration: 3,
            conceptPrompt: "Elegant typographic layout reading pre-order now with mysterious vapor smoke, corporate luxury matte black backdrop"
          }
        ]
      },
      {
        styleName: "Premium Luxury Apple Style",
        adTitle: `Purely ${pName}`,
        scriptFramework: "AIDA",
        hook: "Impassionate silence. A pristine white studio canvas reflecting soft natural morning light.",
        bodyCopy: "Every detail scrutinized. Every millimeter engineered to perfection. It is not just a tool. It is an extension of you.",
        callToAction: "Experience true design. Orbiting now.",
        marketingObjective: "Cultivating intense desire, status-alignment, and elite branding.",
        storyboard: [
          {
            id: 1,
            timeLine: "0:00 - 0:03",
            headline: "Less is Infinite",
            visualCgiDescription: "Super slow-motion close up of polished titanium alloy. Extremely soft cream backgrounds, flawless shadows, pristine studio aesthetics.",
            cameraMovement: "Subtle linear tracking slide following the metal light reflection.",
            vfxCgiEffects: "Soft volumetric ambient occlusion, shallow depth of field (blurry background), micro-focus shifting.",
            dialogueNarration: "We believe a design shouldn't demand your attention.",
            audioMusicPrompt: "Ambient, warm, minimalist acoustic piano notes ringing out slowly.",
            voiceStyle: "Calm, sophisticated, British luxury corporate style.",
            duration: 3,
            conceptPrompt: "Premium high-end lifestyle background, sleek satin-finish titanium texture, Apple style minimalism, beige and ivory studio lighting"
          },
          {
            id: 2,
            timeLine: "0:03 - 0:07",
            headline: "Uncompromising Precision",
            visualCgiDescription: "An exploded 3D CAD engineering model view of the internal circuit board. Golden logic paths light up in perfect sequential harmony.",
            cameraMovement: "Orthographic slow zoom, rotating 45 degrees.",
            vfxCgiEffects: "Floating vector schematics, 3D component alignment lines, neon copper circuit indicators.",
            dialogueNarration: "It should silently earn it. Through unmatched, uncompromising precision.",
            audioMusicPrompt: "Synthesized warm pads join the piano, adding a sense of wonder.",
            voiceStyle: "Measured, precise, visionary.",
            duration: 4,
            conceptPrompt: "Sleek 3D blueprints of internal microchips and circuitry lit up with golden accents, highly technical luxury style"
          },
          {
            id: 3,
            timeLine: "0:07 - 0:11",
            headline: "Integrated Harmony",
            visualCgiDescription: "The device seamlessly slides into a human hands with flawless fluid ease. The user smiles with absolute comfort and focus.",
            cameraMovement: "A warm tracking portrait panning to the user's expressive, calm face.",
            vfxCgiEffects: "Beautiful golden hour morning light overlay, gentle color grading.",
            dialogueNarration: "To create a seamless integration into your day. Uninterrupted.",
            audioMusicPrompt: "Mellow upbeat electronic synth beat drops, organic and modern.",
            voiceStyle: "Friendly, premium, warm and direct.",
            duration: 4,
            conceptPrompt: "High-end portrait of an executive operating a luxurious sleek tech object in a minimalist sunny office"
          },
          {
            id: 4,
            timeLine: "0:11 - 0:15",
            headline: "The New Standard",
            visualCgiDescription: "Split-screen mockup displaying the device looking incredibly aesthetic alongside the website checkout page. Flawless white-space layout.",
            cameraMovement: "Seamless sliding zoom merging into the ultimate logo splash.",
            vfxCgiEffects: "Fluid CSS smooth transition, pure visual elegance.",
            dialogueNarration: "The waiting is finally over.",
            audioMusicPrompt: "Piano resolve ending on a single high-pitched perfect note.",
            voiceStyle: "Reassuring, premium, exclusive.",
            duration: 4,
            conceptPrompt: "Clean white minimalist mockup card representing premium technology and luxury logo design"
          }
        ]
      },
      {
        styleName: "Anime Tokyo Cyberpunk Style",
        adTitle: `Neon Spark: ${pName}`,
        scriptFramework: "Storytelling",
        hook: "Rain-slicked asphalt reflecting Tokyo glowing neon signs.",
        bodyCopy: "In a world of noise, stand absolute. Awaken the dormant electric power.",
        callToAction: "Uncage the electric force. Available worldwide.",
        marketingObjective: "Youth capture, viral appeal, hyper-futuristic branding.",
        storyboard: [
          {
            id: 1,
            timeLine: "0:00 - 0:04",
            headline: "Tokyo Midnight Run",
            visualCgiDescription: "Stylized hand-drawn anime aesthetic (Studio Ghibli meets Akira). A lone cyberpunk rider speeds past corporate towers casting huge neon pink shadows.",
            cameraMovement: "Fast low-angle tracking shot panning with the speed trails.",
            vfxCgiEffects: "Cell-clipping neon trails, rain particle streaks, dramatic motion line action effects.",
            dialogueNarration: "The dark city never sleeps...",
            audioMusicPrompt: "Fast-tempo retro Japanese synthwave beat, heavy analog synthesizers.",
            voiceStyle: "Cool, energetic Japanese voice, subtitle translations pulsing.",
            duration: 4,
            conceptPrompt: "Sleek anime cyberpunk motorcycle racing down rainy neon-lit Tokyo streets, cell-hued anime keys, Studio Ghibli quality"
          },
          {
            id: 2,
            timeLine: "0:04 - 0:08",
            headline: "The Electric Awakening",
            visualCgiDescription: "The rider halts. Glancing down, she reveals the product glowing in her futuristic backpack. Electric neon-cyan sparks travel over her cyber-suit.",
            cameraMovement: "Dramatic zoom-in on the glowing core.",
            vfxCgiEffects: "Hand-drawn electric arcs, manga impact lines, lightning particle rings.",
            dialogueNarration: "...until now. Witness the spark that disrupts custom grids.",
            audioMusicPrompt: "Electric guitar solo screaming alongside the synth beats.",
            voiceStyle: "Intense, rebellious, youthful and raw.",
            duration: 4,
            conceptPrompt: "Anime girl holding glowing cyberpunk utility device activating neon-blue electric current energy, manga action zoom"
          },
          {
            id: 3,
            timeLine: "0:08 - 0:12",
            headline: "Unparalleled Burst",
            visualCgiDescription: "The rider shoots into the Tokyo night sky, launching beautiful neon lights that overwrite the corporate billboards with the brand emblem.",
            cameraMovement: "Vertigo extreme high-angle orbit around Tokyo skyscraper tops.",
            vfxCgiEffects: "CGI/2D hybrid particles, particle explosions rewriting neon billboards.",
            dialogueNarration: `Rewrite the metropolis rules. With ${pName}.`,
            audioMusicPrompt: "Epic cinematic anime theme beat with heavy orchestral drums and electronic glitch.",
            voiceStyle: "Proud, defiant, high-impact.",
            duration: 4,
            conceptPrompt: "Massive futuristic city view covered in neon sparks and brand billboards, beautiful classic cyberpunk anime background"
          },
          {
            id: 4,
            timeLine: "0:12 - 0:15",
            headline: "Join the Grid",
            visualCgiDescription: "High contrast outline of the character holding the device. Vibrant magenta and toxic green accents glow.",
            cameraMovement: "Classic dynamic anime end frame lock.",
            vfxCgiEffects: "Glitch art layers, stylized high-contrast branding logo.",
            dialogueNarration: "Enter the grid. Rise above.",
            audioMusicPrompt: "Sudden electronic drop leaving an eerie digital hum.",
            voiceStyle: "Energetic, young, digital.",
            duration: 3,
            conceptPrompt: "Bold anime dynamic logo splash frame with magenta background and neon text overlays"
          }
        ]
      }
    ],
    virality: {
      engagementScore: 94,
      viralProbability: 89,
      ctr: 6.4,
      conversionRate: 4.8,
      retentionRate: 72,
      strengths: [
        "Aesthetic variance catches three massive distinct core audiences (Marvel Epic lovers, minimal Apple design purists, and high-energy Anime cultural enthusiasts).",
        "Extremely persuasive emotional copywriting hook tailored directly to high-status aspirational drives.",
        "Deep cinematic cues prompt the mind to recognize maximum luxury value before evaluating price points."
      ],
      improvements: [
        "Include a personalized 3-second founder storytelling snippet to boost general LinkedIn engagement scores.",
        "A/B test an intense localized version referencing local cultural events or cities if deploying to regional hubs."
      ]
    },
    createdAt: new Date().toISOString()
  };
}

// REST route to generate a campaign
app.post("/api/generate-campaign", async (req, res) => {
  try {
    const brief = req.body;
    if (!brief.productName || !brief.brandName) {
      return res.status(400).json({ error: "Product Name and Brand Name are required." });
    }

    const gemini = getGemini();
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (!hasKey) {
      console.log("Using simulation engine (Reason: No valid GEMINI_API_KEY set)");
      const result = generateMockCampaign(brief);
      return res.json(result);
    }

    // Build model prompt for deep research, brand dna, consumer psychology, writing 3 beautiful cinematic styles we requested
    const prompt = `
      You are the ultimate autonomous AI Advertisement Creation Ecosystem.
      Perform deep marketing, competitive, brand research and write a highly creative, cinematic campaign plan based on the following:
      
      PRODUCT NAME: ${brief.productName}
      BRAND NAME: ${brief.brandName}
      WEBSITE URL: ${brief.websiteUrl || "None provided"}
      PRODUCT CATEGORY: ${brief.category || "General Tech/Lifestyle"}
      TARGET AUDIENCE: ${brief.targetAudience}
      CAMPAIGN GOAL: ${brief.goal}
      USER IDEA/PROMPT: ${brief.ideaPrompt || "Automated luxury campaign strategy"}

      You must return a valid, well-structured JSON object corresponding to this TypeScript shape:
      {
        "id": "string",
        "brief": {
          "productName": "string",
          "brandName": "string",
          "websiteUrl": "string",
          "category": "string",
          "targetAudience": "string",
          "goal": "string",
          "ideaPrompt": "string"
        },
        "brandIntelligence": {
          "brandDna": "string (brand core DNA, values, unique selling prop)",
          "brandVoice": "string",
          "brandStory": "string (immersive compelling founder story pitch)",
          "brandArchetype": "string",
          "marketPositioning": "string"
        },
        "marketReport": {
          "competitors": ["string", "string"],
          "trends": ["string", "string"],
          "marketGaps": ["string", "string"],
          "opportunities": ["string", "string"]
        },
        "consumerPsychology": {
          "emotionalTriggers": ["string", "string"],
          "buyingBehavior": "string",
          "painPoints": ["string", "string"],
          "aspirations": ["string", "string"],
          "trustFactors": ["string", "string"]
        },
        "ads": [
          {
            "styleName": "string (choose a specific epic cinematic style e.g., 'Hollywood Blockbuster Style', 'Premium Luxury Apple Style', 'Anime Studio Ghibli Style', 'Bollywood Emotional Screen')",
            "adTitle": "string",
            "scriptFramework": "string (choose from AIDA, PAS, Storytelling, Hero Journey, Emotional Marketing)",
            "hook": "string (highly engaging hook, the first 3 seconds description)",
            "bodyCopy": "string (perfect sales narrative script copy)",
            "callToAction": "string",
            "marketingObjective": "string",
            "storyboard": [
              {
                "id": 1,
                "timeLine": "0:00 - 0:04",
                "headline": "string scene brief title",
                "visualCgiDescription": "string (incredibly descriptive Hollywood/Disney level visual, lighting, cinematic action, textures)",
                "cameraMovement": "string (epic camera moves e.g., low orbit, drone dive, 360 spin, bullet-time, macro tracking)",
                "vfxCgiEffects": "string (explosions, glowing particles, volumetric rays, hyper realistic fluids, glass reflections)",
                "dialogueNarration": "string (exact dialogue, narration word file)",
                "audioMusicPrompt": "string (audio orchestrations, electronic synths, sound effect descriptions)",
                "voiceStyle": "string (Hollywood deep narrator, soft luxury whispers, high energetic anime, etc)",
                "duration": 4,
                "conceptPrompt": "string (detailed stable diffusion / DALL-E style prompt for generating this frame's concept art base64 image)"
              }
              // Generate exactly 4 scenes per script!
            ]
          }
          // Please output exactly 3 beautiful, distinct cinematic scripts (e.g. Premium Tech, Hollywood Blockbuster, Cyberpunk Anime, or Bollywood Drama)!
        ],
        "virality": {
          "engagementScore": 92, // number out of 100
          "viralProbability": 85, // number out of 100
          "ctr": 5.8, // predicted percentage (e.g., 5.8)
          "conversionRate": 4.1, // predicted percentage (e.g., 4.1)
          "retentionRate": 68, // predicted average watch retention percentage (e.g., 68)
          "strengths": ["string reason why it works", "string"],
          "improvements": ["string", "string"]
        }
      }

      Write high-quality, professional marketing copy. Do not cut off text or return ellipses inside JSON keys. Ensure all text arrays are filled with detailed insights. Make it spectacular.
    `;

    console.log("Calling Gemini API model: gemini-3.5-flash for campaign production...");
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.85,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response returned from Gemini API");
    }

    const campaign = JSON.parse(responseText.trim());
    // Attach current timestamp
    campaign.createdAt = new Date().toISOString();
    return res.json(campaign);

  } catch (error: any) {
    console.error("Gemini Platform generation error:", error);
    // Graceful fallback to simulated campaign so the user doesn't hit a blank page
    console.warn("Falling back to simulator...");
    const fallback = generateMockCampaign(req.body);
    return res.json({
      ...fallback,
      _debug_notice: "Generated via Campaign Production Simulator due to API or credential variance.",
      _error_details: error.message || String(error)
    });
  }
});

// Real-time Storyboard Image Concept Generator via Gemini Image Generator
app.post("/api/generate-concept-art", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required to render concept art." });
    }

    const gemini = getGemini();
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (!hasKey) {
      console.log("Simulating concept artwork (Reason: No valid GEMINI_API_KEY)");
      return res.json({
        imageUrl: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop`,
        isSimulation: true
      });
    }

    console.log("Calling Google Imagen API for visual artwork...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`;
    
    const imageResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [
          { prompt: `High quality cinematic award-winning advertisement concept art, perfect professional photography, cinematic lighting, dramatic style: ${prompt}` }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "16:9"
        }
      })
    });

    const data = await imageResponse.json();
    let base64Data = "";
    if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
      base64Data = data.predictions[0].bytesBase64Encoded;
    }

    if (base64Data) {
      return res.json({
        imageUrl: `data:image/jpeg;base64,${base64Data}`,
        isReal: true
      });
    } else {
      console.warn("Could not find image in Imagen response, falling back.", data);
      return res.json({
        imageUrl: `https://images.unsplash.com/photo-1541701494587-cb52502866ab?q=80&w=600&auto=format&fit=crop`,
        isSimulation: true
      });
    }

  } catch (error: any) {
    console.error("Camera Concept Artwork rendering failure:", error);
    return res.json({
      imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop`,
      isSimulation: true,
      errorInfo: error.message || String(error)
    });
  }
});

// Configure Vite middleware / client static files serving logic
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Enabling Vite client middleware support for live modifications...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`World-Class AI Ad Platform backend online at http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
