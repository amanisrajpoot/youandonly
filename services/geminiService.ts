import { GoogleGenAI, Type } from "@google/genai";
import type { Outfit, ClothingItem } from '../types';
import { CLOTHING_CATALOG } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface RawOutfit {
  outfitName: string;
  description: string;
  itemNames: string[];
}

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      outfitName: {
        type: Type.STRING,
        description: 'A creative and catchy name for the outfit.'
      },
      description: {
        type: Type.STRING,
        description: 'A short, stylish description of the outfit, explaining why it fits the chosen aesthetic.'
      },
      itemNames: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        },
        description: 'An array of item names from the provided catalog that make up the outfit. Should include a top, a bottom, and shoes at minimum.'
      }
    },
    required: ["outfitName", "description", "itemNames"]
  }
};

export async function generateOutfits(style: string): Promise<Outfit[]> {
  const catalogText = CLOTHING_CATALOG.map(item => `- ${item.name} (${item.category})`).join('\n');

  const prompt = `
    You are the expert AI fashion stylist for "You & Only," a brand focused on unique, personal style. 
    You have a futuristic and creative flair.
    Your task is to create three distinct and complete outfits based on the user's chosen style: "${style}".

    Use only items from the following catalog:
    ${catalogText}

    Rules:
    1.  Each outfit must be complete, containing at least one Top, one Bottom, and one pair of Shoes. You can optionally add an Outerwear piece and/or an Accessory.
    2.  Do not use any item more than once across all three generated outfits.
    3.  The outfits should genuinely reflect the "${style}" aesthetic.
    4.  Provide a creative name and a compelling description for each outfit.
    5.  Return the response in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const rawOutfits: RawOutfit[] = JSON.parse(response.text);

    // Map raw outfit data to the rich Outfit type with full item details
    const outfits: Outfit[] = rawOutfits.map(rawOutfit => {
      const outfitItems: ClothingItem[] = rawOutfit.itemNames
        .map(itemName => {
          const foundItem = CLOTHING_CATALOG.find(item => item.name.toLowerCase() === itemName.toLowerCase());
          return foundItem;
        })
        .filter((item): item is ClothingItem => item !== undefined); // Type guard to filter out undefined

      return {
        outfitName: rawOutfit.outfitName,
        description: rawOutfit.description,
        items: outfitItems,
      };
    }).filter(outfit => outfit.items.length > 0); // Ensure we don't return empty outfits

    if (outfits.length === 0) {
        throw new Error("AI returned empty or invalid outfit data.");
    }

    return outfits;

  } catch (error) {
    console.error("Error generating outfits with Gemini:", error);
    throw new Error("Failed to communicate with the AI stylist.");
  }
}