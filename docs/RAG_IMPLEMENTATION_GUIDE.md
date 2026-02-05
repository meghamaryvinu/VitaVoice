/**
 * RAG Integration Example
 * Shows how to wire Medical Knowledge Base into aiService for Retrieval-Augmented Generation
 * 
 * This demonstrates the next step after KB seeding (Step B onwards)
 */

// ============================================================================
// CURRENT STATE (Step A - Complete)
// ============================================================================

/**
 * medicalKnowledgeBase.ts - Already implemented and working
 * Provides:
 * - searchEntities(query, language) → MedicalEntity[]
 * - getDiseasesForSymptom(symptomId) → SymptomDiseaseMapping[]
 * - getSymptomsForDisease(diseaseId) → SymptomDiseaseMapping[]
 * - isEmergencyCondition(diseaseId) → boolean
 * - getEntityInLanguage(entity, language) → string
 */

// ============================================================================
// NEXT STEPS (Step B onwards - Implementation Guide)
// ============================================================================

// STEP B: Expand dataset from real sources
// -----------------------------------------------------------------------

/**
 * Option 1: Use HuggingFace Datasets Library (Python)
 * 
 * # Download Eka-IndicMTEB dataset
 * from datasets import load_dataset
 * dataset = load_dataset("ekacare/Eka-IndicMTEB")
 * 
 * # Convert to JSON for web app
 * import json
 * data = dataset['train'].to_json()
 * with open('eka-indicmteb.json', 'w') as f:
 *     json.dump(data, f)
 */

/**
 * Option 2: Fetch Disease Ontology directly
 * 
 * Example API call:
 * curl -X GET "https://www.disease-ontology.org/api/metadata/DOID:0081086"
 * 
 * Response:
 * {
 *   "doid": "DOID:0081086",
 *   "name": "COVID-19",
 *   "def": "A viral infectious disease...",
 *   "synonyms": ["Coronavirus Disease 2019", "SARS-CoV-2 infection"],
 *   "xrefs": [{"db": "SNOMED", "id": "840539006"}]
 * }
 */

// STEP C: Create Vector Embeddings
// -----------------------------------------------------------------------

/**
 * Install embeddings library (TypeScript):
 * npm install @xenova/transformers
 * 
 * Creates semantic embeddings for similarity search
 */

interface VectorEmbedding {
  entityId: string;
  embedding: number[]; // 384 or 768 dimensions
  text: string;        // Original text that was embedded
}

/**
 * Example implementation:
 * 
 * import { pipeline } from "@xenova/transformers";
 * 
 * async function createEmbeddings() {
 *   const embedder = await pipeline('feature-extraction', 
 *     'Xenova/multilingual-e5-small'); // lightweight option
 *   
 *   const embeddings: VectorEmbedding[] = [];
 *   
 *   for (const entity of medicalKnowledgeBase.getAllEntities()) {
 *     const text = `${entity.name} ${entity.description}`;
 *     const vector = await embedder(text, { 
 *       pooling: 'mean', 
 *       normalize: true 
 *     });
 *     
 *     embeddings.push({
 *       entityId: entity.id,
 *       embedding: Array.from(vector),
 *       text: text
 *     });
 *   }
 *   
 *   // Save to localStorage or IndexedDB for offline use
 *   localStorage.setItem('medical_embeddings', JSON.stringify(embeddings));
 *   return embeddings;
 * }
 */

// STEP D: Semantic Search
// -----------------------------------------------------------------------

/**
 * Install vector similarity library:
 * npm install onnx-runtime onnxruntime-web
 * 
 * Example:
 */

async function semanticSearch(
  query: string,
  language: string,
  topK: number = 5
): Promise<Array<{ entity: MedicalEntity; similarity: number }>> {
  // 1. Embed the user query
  const embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
  const queryEmbedding = await embedder(query, { pooling: 'mean', normalize: true });
  
  // 2. Load stored embeddings
  const storedEmbeddings = JSON.parse(
    localStorage.getItem('medical_embeddings') || '[]'
  );
  
  // 3. Compute cosine similarity
  const similarities = storedEmbeddings.map((emb: VectorEmbedding) => ({
    entityId: emb.entityId,
    similarity: cosineSimilarity(queryEmbedding, emb.embedding)
  }));
  
  // 4. Sort and return top K
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map(sim => ({
      entity: medicalKnowledgeBase.getEntity(sim.entityId),
      similarity: sim.similarity
    }));
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dotProduct / (normA * normB);
}

// STEP E: RAG Integration with Gemini
// -----------------------------------------------------------------------

/**
 * Current aiService.chat() - BEFORE RAG integration
 */
async function chatBefore(userMessage: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: userMessage
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    }
  );
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Enhanced aiService.chat() - WITH RAG integration
 */
async function chatAfter(
  userMessage: string,
  language: string = 'en'
): Promise<{ response: string; sources: Array<{ name: string; url: string }> }> {
  // 1. RETRIEVE: Search knowledge base
  const relevantEntities = await semanticSearch(userMessage, language, topK: 3);
  
  if (relevantEntities.length === 0) {
    // Fallback to current rule-based system if no KB matches
    return {
      response: await chatBefore(userMessage),
      sources: []
    };
  }
  
  // 2. BUILD CONTEXT: Format retrieved data for Gemini
  const context = relevantEntities
    .map(item => `
**${item.entity.name}** (${item.entity.source}, confidence: ${item.entity.confidence})
${item.entity.description}
Source: ${item.entity.references?.[0] || 'N/A'}
Emergency: ${item.entity.emergencyFlag ? '⚠️ YES - Seek immediate medical attention' : 'No'}
    `.trim())
    .join('\n\n');
  
  // 3. AUGMENT: Add context to system prompt
  const systemPrompt = `You are Kendall, a healthcare assistant powered by verified medical knowledge.

MEDICAL CONTEXT (from vetted sources):
${context}

INSTRUCTIONS:
- Provide responses based on the medical context above
- Always cite sources when using information from the context
- If a condition is marked as emergency, strongly recommend seeking immediate medical help
- For conditions outside your knowledge base, recommend consulting a healthcare professional
- Maintain a compassionate, clear tone in all responses
- Respond in the user's language: ${language}`;
  
  // 4. GENERATE: Send augmented prompt to Gemini
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: userMessage
          }]
        }],
        systemInstruction: {
          parts: [{
            text: systemPrompt
          }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.9
        }
      })
    }
  );
  
  const data = await response.json();
  const assistantResponse = data.candidates[0].content.parts[0].text;
  
  // 5. ATTRIBUTION: Extract sources used
  const sources = relevantEntities
    .filter(item => item.entity.references?.length)
    .map(item => ({
      name: item.entity.name,
      url: item.entity.references[0]
    }));
  
  return {
    response: assistantResponse,
    sources: sources
  };
}

// ============================================================================
// INTEGRATION CHECKLIST
// ============================================================================

/**
 * ✅ COMPLETED (Step A)
 * - [x] Create MedicalEntity interfaces
 * - [x] Implement MedicalKnowledgeBaseService
 * - [x] Add seed data (5 symptoms, 4 diseases, 10 mappings)
 * - [x] Test entity retrieval methods
 * - [x] Add multilingual support (8 languages)
 * - [x] Implement emergency detection
 * - [x] Create data schema documentation
 * 
 * ⏳ TODO (Step B - Dataset Expansion)
 * - [ ] Download Eka-IndicMTEB from HuggingFace
 * - [ ] Fetch Disease Ontology API data
 * - [ ] Parse and normalize to MedicalEntity format
 * - [ ] Expand KB from 4 to 100+ diseases
 * - [ ] Add WHO/NHS/CDC disease guidelines
 * - [ ] Validate data quality
 * 
 * ⏳ TODO (Step C - Vector Embeddings)
 * - [ ] Install @xenova/transformers
 * - [ ] Create embedding pipeline
 * - [ ] Generate embeddings for all entities
 * - [ ] Store embeddings in IndexedDB
 * - [ ] Implement cosine similarity search
 * - [ ] Add semantic search to medicalKnowledgeBase
 * 
 * ⏳ TODO (Step D - RAG Integration)
 * - [ ] Modify aiService.chat() to retrieve KB context
 * - [ ] Add system prompt with medical context
 * - [ ] Implement source attribution
 * - [ ] Add evidence confidence to responses
 * - [ ] Test with symptom queries
 * - [ ] Validate emergency condition handling
 * 
 * ⏳ TODO (Step E - Production Ready)
 * - [ ] Add response caching
 * - [ ] Implement rate limiting
 * - [ ] Add audit logging
 * - [ ] Create clinician validation workflow
 * - [ ] Add A/B testing for response quality
 * - [ ] Monitor false negative/positive rates
 */

// ============================================================================
// QUICK START: Enable RAG in Current Implementation
// ============================================================================

/**
 * To enable RAG immediately (without vectors):
 * 
 * 1. Modify aiService.ts chat() method:
 * 
 *    async chat(userMessage: string, language: string = 'en') {
 *      // Get relevant entities from KB (lexical search, no vectors)
 *      const entities = medicalKnowledgeBase.searchEntities(userMessage, language);
 *      
 *      // Build context
 *      const context = entities
 *        .slice(0, 3)
 *        .map(e => `${e.name}: ${e.description}`)
 *        .join('\n');
 *      
 *      // Add to Gemini system prompt
 *      const systemPrompt = `Medical context: ${context}. 
 *                           Use this information in your response.
 *                           Always recommend consulting healthcare professionals.`;
 *      
 *      // Send to Gemini with context
 *      return await gemini.generateContent({
 *        prompt: userMessage,
 *        systemPrompt: systemPrompt
 *      });
 *    }
 * 
 * 2. Update Chat.tsx to show sources:
 *    - Display entity references below AI response
 *    - Show confidence scores
 *    - Add "Learn more" links
 * 
 * 3. Test with queries:
 *    - "I have a fever and cough"
 *    - "मुझे बुखार है" (Hindi: I have fever)
 *    - "என்னுடைய தலை வலிக்கிறது" (Tamil: My head hurts)
 */

export { chatAfter, semanticSearch, cosineSimilarity };
