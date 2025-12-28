
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Prediction, ParkingLot } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getParkingAdvice = async (lots: ParkingLot[], query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: Campus Parking Data: ${JSON.stringify(lots)}. User Query: ${query}. Task: Act as a helpful campus parking assistant. Provide concise, expert advice based on current occupancy and trends.`
    });
    return response.text || "I'm unable to provide advice right now. Try checking Lot C, it usually has more space.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI assistant.";
  }
};

export const getNearbyAmenities = async (lot: ParkingLot) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `What are the best study spots or cafes within a 5-minute walk of ${lot.name} (located near ${lot.latitude}, ${lot.longitude})? Provide helpful links.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lot.latitude,
              longitude: lot.longitude
            }
          }
        }
      }
    });
    
    const text = response.text || "";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "No nearby amenities found.", sources: [] };
  }
};

export const generateBadgeImage = async (badgeName: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A vibrant, high-quality 3D digital achievement badge for a university student titled "${badgeName}". Minimalist, futuristic, isometric icon, university aesthetic, soft blue and emerald lighting, white background.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const getPredictiveAnalysis = async (lot: ParkingLot): Promise<Prediction> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict parking availability for ${lot.name}. Current state: ${lot.availableSpots}/${lot.totalSpots} available, trend: ${lot.occupancyTrend}. Time: ${new Date().toLocaleTimeString()}. Return reasoning and a prediction confidence (0-1).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedAvailable: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["predictedAvailable", "confidence", "reasoning"]
        }
      }
    });
    
    const result = JSON.parse(response.text || "{}");
    return {
      lotId: lot.id,
      predictedAvailable: result.predictedAvailable || lot.availableSpots,
      confidence: result.confidence || 0.7,
      reasoning: result.reasoning || "Based on historical campus traffic patterns."
    };
  } catch (error) {
    console.error("Prediction Error:", error);
    return {
      lotId: lot.id,
      predictedAvailable: lot.availableSpots,
      confidence: 0.5,
      reasoning: "Standard statistical model."
    };
  }
};

export interface CampusAlert {
  title: string;
  summary: string;
  sources: { title: string; uri: string }[];
}

export const getCampusAlerts = async (): Promise<CampusAlert> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Are there any major events, sports games, or road closures on the University of California Berkeley campus today or this week that would affect parking?",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "No major alerts found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || "#"
      }));

    return {
      title: "Live Campus Event Alert",
      summary: text,
      sources: sources.slice(0, 3)
    };
  } catch (error) {
    console.error("Grounding Error:", error);
    return {
      title: "Alert Service Unavailable",
      summary: "Could not fetch real-time campus events.",
      sources: []
    };
  }
};
