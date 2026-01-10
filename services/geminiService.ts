import { GoogleGenerativeAI } from "@google/generative-ai";
import { FeedbackData, AnalysisResult } from "../types";

// Initialisation avec la clé sécurisée de Vercel
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY || "");

export const analyzeFeedback = async (data: FeedbackData): Promise<AnalysisResult> => {
  // Choix du modèle (1.5 Flash est le meilleur pour la vitesse/coût actuellement)
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const isEnv = data.subject === 'ENVIRONNEMENT_GLOBAL';

  // Instructions pour l'IA (System Prompt)
  const systemInstruction = `Vous êtes un Expert en Audit de Qualité Académique.
  Analysez les données fournies et produisez une synthèse stratégique.
  
  FORMAT DE RÉPONSE OBLIGATOIRE (JSON) :
  {
    "summary": "Un paragraphe de résumé de la situation",
    "recommendations": ["Action 1 concrète", "Action 2 concrète", "Action 3 concrète"],
    "sentiment": "positif" ou "neutre" ou "negatif"
  }
  
  ${isEnv ? "Contexte : Audit des infrastructures et de l'environnement." : "Contexte : Audit pédagogique d'un cours."}`;

  // Données de l'utilisateur à analyser
  const userPrompt = `
    ${systemInstruction}
    ----------------
    DONNÉES À ANALYSER :
    Sujet : ${data.subject}
    Scores : ${JSON.stringify(data)}
    Commentaire étudiant : "${data.comments || "Aucun commentaire"}"
  `;

  try {
    // Appel à l'IA
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    // Nettoyage et conversion en JSON
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Erreur Gemini:", error);

    // Fallback : Si l'IA échoue (ou pas de clé), on renvoie une réponse par défaut pour ne pas bloquer l'app
    return {
      summary: "L'analyse IA n'est pas disponible pour le moment (Vérifiez la clé API).",
      recommendations: ["Analyser les retours manuellement", "Vérifier la connexion"],
      sentiment: 'neutre'
    };
  }
};