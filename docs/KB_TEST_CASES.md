/**
 * Medical Knowledge Base - Test Cases & Examples
 * Demonstrates how to use the KB and expected outputs
 */

// ============================================================================
// TEST CASE 1: English Symptom Search
// ============================================================================

/**
 * Query: "I have a fever"
 * Expected Flow:
 * 1. User types message in Chat
 * 2. KB searches for "fever"
 * 3. Finds symptom_fever entity
 * 4. Retrieves related diseases: COVID-19 (85%), Influenza (90%), Pneumonia (80%)
 * 5. Gemini generates contextual response
 * 6. Sources shown below response
 */

import { medicalKnowledgeBase } from '@/services/medicalKnowledgeBase';

async function testEnglishSymptomSearch() {
  // 1. User input
  const userQuery = "I have a fever";
  const language = 'en';
  
  // 2. Search knowledge base
  const searchResults = medicalKnowledgeBase.searchEntities(userQuery, language);
  console.log('🔍 Search Results:', searchResults);
  // Output: [{ id: 'symptom_fever', name: 'Fever', type: 'symptom', ... }]
  
  // 3. For each symptom found, get related diseases
  const symptomFever = searchResults.find(r => r.id === 'symptom_fever');
  if (symptomFever) {
    const relatedDiseases = medicalKnowledgeBase.getDiseasesForSymptom('symptom_fever');
    console.log('🦠 Related Diseases:', relatedDiseases);
    /* Output:
    [
      { symptomId: 'symptom_fever', diseaseId: 'disease_covid19', probability: 0.85, confidence: 0.95 },
      { symptomId: 'symptom_fever', diseaseId: 'disease_influenza', probability: 0.9, confidence: 0.96 },
      { symptomId: 'symptom_fever', diseaseId: 'disease_pneumonia', probability: 0.8, confidence: 0.94 }
    ]
    */
  }
  
  // 4. Get full disease entities for context
  const diseases = ['disease_covid19', 'disease_influenza', 'disease_pneumonia']
    .map(id => medicalKnowledgeBase.getEntity(id));
  
  const context = diseases
    .map(d => `${d.name} (confidence: ${d.confidence}): ${d.description}`)
    .join('\n');
  
  console.log('📚 Context for Gemini:\n', context);
  
  // 5. Gemini response would be something like:
  /* Expected Response:
  "I understand you have a fever. Fever is an elevated body temperature, 
  which can be a symptom of several conditions including:
  
  1. **COVID-19** - If you also have cough or difficulty breathing, 
     get tested and see a doctor
  2. **Influenza (Flu)** - Often comes with cough and headache
  3. **Pneumonia** - More serious, seek medical attention if fever continues
  
  **Important:** Please consult a healthcare professional for proper diagnosis.
  
  Sources: Disease Ontology"
  */
}

// ============================================================================
// TEST CASE 2: Hindi/Multilingual Search
// ============================================================================

/**
 * Query: "मुझे बुखार है" (Hindi: "I have a fever")
 * Expected: Same results as English, but KB returns Hindi names
 */

async function testHindiSymptomSearch() {
  const userQuery = "मुझे बुखार है";
  const language = 'hi'; // Hindi
  
  // Search in Hindi
  const results = medicalKnowledgeBase.searchEntities(userQuery, language);
  console.log('🔍 Hindi Search Results:', results);
  
  // Get entity and request Hindi translation
  if (results.length > 0) {
    const entity = results[0];
    const hindiName = medicalKnowledgeBase.getEntityInLanguage(entity, 'hi');
    console.log(`Hindi name: ${hindiName}`);
    // Output: "बुखार"
    
    const diseases = medicalKnowledgeBase.getDiseasesForSymptom(entity.id);
    const diseaseEntities = diseases
      .map(d => medicalKnowledgeBase.getEntity(d.diseaseId))
      .map(d => ({
        name: medicalKnowledgeBase.getEntityInLanguage(d, 'hi'),
        probability: diseases.find(m => m.diseaseId === d.id)?.probability
      }));
    
    console.log('🦠 Hindi Disease Names:', diseaseEntities);
    // Output: [
    //   { name: 'कोविड-19', probability: 0.85 },
    //   { name: 'फ्लू', probability: 0.9 },
    //   { name: 'निमोनिया', probability: 0.8 }
    // ]
  }
}

// ============================================================================
// TEST CASE 3: Multiple Symptoms
// ============================================================================

/**
 * Query: "I have fever, cough, and headache"
 * Expected: Find all 3 symptoms, then find common diseases
 */

async function testMultipleSymptomsSearch() {
  const userQuery = "I have fever, cough, and headache";
  const language = 'en';
  
  // Search finds multiple symptoms
  const symptoms = medicalKnowledgeBase.searchEntities(userQuery, language);
  console.log('🔍 Found Symptoms:', symptoms.map(s => s.name));
  // Output: ['Fever', 'Cough', 'Headache']
  
  // Get diseases for each symptom
  const diseasesBySymptom = symptoms.map(symptom => ({
    symptom: symptom.name,
    diseases: medicalKnowledgeBase.getDiseasesForSymptom(symptom.id)
  }));
  
  console.log('🦠 Diseases by Symptom:', diseasesBySymptom);
  /* Output:
  [
    {
      symptom: 'Fever',
      diseases: [
        { diseaseId: 'disease_covid19', probability: 0.85, ... },
        { diseaseId: 'disease_influenza', probability: 0.9, ... },
        { diseaseId: 'disease_pneumonia', probability: 0.8, ... }
      ]
    },
    {
      symptom: 'Cough',
      diseases: [
        { diseaseId: 'disease_covid19', probability: 0.8, ... },
        { diseaseId: 'disease_influenza', probability: 0.85, ... },
        { diseaseId: 'disease_pneumonia', probability: 0.88, ... }
      ]
    },
    {
      symptom: 'Headache',
      diseases: [
        { diseaseId: 'disease_influenza', probability: 0.75, ... }
      ]
    }
  ]
  */
  
  // Find diseases that appear across symptoms (most likely)
  const diseaseScores = new Map<string, number>();
  
  diseasesBySymptom.forEach(({ diseases }) => {
    diseases.forEach(({ diseaseId, probability }) => {
      const current = diseaseScores.get(diseaseId) || 0;
      diseaseScores.set(diseaseId, current + probability);
    });
  });
  
  const topDiseases = Array.from(diseaseScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  console.log('🏆 Top Diseases by Combined Probability:', topDiseases);
  /* Output:
  [
    ['disease_influenza', 2.5],    // 0.9 + 0.85 + 0.75
    ['disease_covid19', 2.25],     // 0.85 + 0.8 + 0
    ['disease_pneumonia', 1.68]    // 0 + 0.88 + 0.8 (headache not in pneumonia)
  ]
  */
}

// ============================================================================
// TEST CASE 4: Emergency Condition Detection
// ============================================================================

/**
 * Query: "I can't breathe" / "Chest pain"
 * Expected: Triggers emergency flag and strong recommendation to seek help
 */

async function testEmergencyCondition() {
  const userQuery = "I can't breathe and have chest pain";
  const language = 'en';
  
  // Search finds critical symptoms
  const symptoms = medicalKnowledgeBase.searchEntities(userQuery, language);
  console.log('🚨 Critical Symptoms Found:', symptoms);
  
  // Check for emergency flags
  const emergencySymptoms = symptoms.filter(s => s.emergencyFlag);
  console.log('⚠️ Emergency Symptoms:', emergencySymptoms.map(s => s.name));
  // Output: ['Breathlessness', 'Chest Pain']
  
  // Get diseases and check if emergency
  const emergencyDiseases = new Set<string>();
  
  symptoms.forEach(symptom => {
    const diseases = medicalKnowledgeBase.getDiseasesForSymptom(symptom.id);
    diseases.forEach(d => {
      if (medicalKnowledgeBase.isEmergencyCondition(d.diseaseId)) {
        emergencyDiseases.add(d.diseaseId);
      }
    });
  });
  
  console.log('🚑 Emergency Conditions Detected:', Array.from(emergencyDiseases));
  // Output: ['disease_covid19', 'disease_pneumonia']
  
  // Response should emphasize urgency
  /* Expected Gemini Response:
  "⚠️ EMERGENCY ⚠️
  
  The symptoms you're describing - difficulty breathing and chest pain - 
  are SERIOUS and require IMMEDIATE medical attention.
  
  Possible conditions include:
  - COVID-19 (severe)
  - Pneumonia (requires hospitalization)
  
  **PLEASE CALL EMERGENCY SERVICES (911 in US, 112 in India) IMMEDIATELY**
  
  Do NOT wait. Do NOT drive yourself if severely affected.
  Get emergency help NOW.
  
  Sources: Disease Ontology"
  */
}

// ============================================================================
// TEST CASE 5: Cross-Language Translation
// ============================================================================

/**
 * Query: "fever" (user in Tamil language setting)
 * Expected: Get symptom in Tamil and respond in Tamil
 */

async function testCrossLanguageSupport() {
  const symptomId = 'symptom_fever';
  const targetLanguage = 'ta'; // Tamil
  
  // Get entity
  const entity = medicalKnowledgeBase.getEntity(symptomId);
  
  // Get Tamil translation
  const tamilName = medicalKnowledgeBase.getEntityInLanguage(entity, targetLanguage);
  console.log(`Tamil translation: ${tamilName}`);
  // Output: "காய்ச்சல்"
  
  // Get all languages
  const allLanguages = Object.entries(entity.languages);
  console.log('📚 All Languages Available:', allLanguages);
  /* Output:
  [
    ['en', 'Fever'],
    ['hi', 'बुखार'],
    ['ta', 'காய்ச்சல்'],
    ['te', 'జ్వరం'],
    ['kn', 'ಜ್ವರ'],
    ['ml', 'പനി'],
    ['bn', 'জ্বর'],
    ['mr', 'ज्वर']
  ]
  */
  
  // Fallback if language not in KB
  const unknownLang = medicalKnowledgeBase.getEntityInLanguage(entity, 'fr'); // French not supported
  console.log('Unsupported language fallback:', unknownLang);
  // Output: "Fever" (defaults to English)
}

// ============================================================================
// TEST CASE 6: KB Statistics
// ============================================================================

/**
 * Get overall KB information
 */

function testKBStatistics() {
  const stats = medicalKnowledgeBase.getStats();
  console.log('📊 Knowledge Base Statistics:', stats);
  /* Expected Output:
  {
    totalEntities: 9,
    symptoms: 5,
    diseases: 4,
    mappings: 10,
    emergencyConditions: 2,
    languages: ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr'],
    sources: ['Disease Ontology', 'Eka-IndicMTEB'],
    lastUpdated: '2024-01-20T10:30:00Z'
  }
  */
  
  // Check disease details
  const covidEntity = medicalKnowledgeBase.getEntity('disease_covid19');
  console.log('📄 COVID-19 Details:', {
    name: covidEntity.name,
    severity: covidEntity.severity,
    emergencyFlag: covidEntity.emergencyFlag,
    source: covidEntity.source,
    confidence: covidEntity.confidence,
    references: covidEntity.references
  });
  /* Output:
  {
    name: 'COVID-19',
    severity: 'moderate-high',
    emergencyFlag: true,
    source: 'Disease Ontology',
    confidence: 0.99,
    references: ['https://www.who.int/health-topics/coronavirus']
  }
  */
}

// ============================================================================
// TEST CASE 7: Integration with Chat Component
// ============================================================================

/**
 * How the KB integrates into Chat.tsx
 */

async function testChatIntegration() {
  // Simulating user input in Chat component
  const userMessage = "I have fever and cough for 2 days";
  const selectedLanguage = 'en';
  
  // 1. KB retrieval
  const kbContext = medicalKnowledgeBase.searchEntities(userMessage, selectedLanguage)
    .map(entity => {
      const diseases = medicalKnowledgeBase.getDiseasesForSymptom(entity.id);
      return {
        entity: entity,
        relatedDiseases: diseases
      };
    });
  
  console.log('📚 KB Context for Chat:', kbContext);
  
  // 2. Build message with context for Gemini
  const systemPrompt = `You are Kendall, a healthcare AI assistant. 
You have access to medical knowledge about: ${kbContext.map(c => c.entity.name).join(', ')}

Based on this information, provide helpful guidance. Always recommend seeing a doctor.`;
  
  // 3. Send to Gemini (implemented in aiService.ts)
  // const response = await aiService.chat(userMessage, systemPrompt);
  
  // 4. In Chat component, render with sources
  const chatMessage = {
    text: userMessage,
    sender: 'user',
    timestamp: new Date(),
    sources: kbContext.map(c => ({
      name: c.entity.name,
      url: c.entity.references?.[0]
    }))
  };
  
  console.log('💬 Chat Message with Sources:', chatMessage);
}

// ============================================================================
// TESTING CHECKLIST
// ============================================================================

/**
 * Run these tests to verify KB functionality:
 * 
 * ✅ Test 1: English Symptom Search
 *    - Run: testEnglishSymptomSearch()
 *    - Verify: Finds fever, returns COVID-19/Influenza/Pneumonia
 * 
 * ✅ Test 2: Hindi Search
 *    - Run: testHindiSymptomSearch()
 *    - Verify: Translates symptoms and diseases to Hindi
 * 
 * ✅ Test 3: Multiple Symptoms
 *    - Run: testMultipleSymptomsSearch()
 *    - Verify: Ranks diseases by combined probability
 * 
 * ✅ Test 4: Emergency Detection
 *    - Run: testEmergencyCondition()
 *    - Verify: Flags breathlessness and chest pain as emergency
 * 
 * ✅ Test 5: Cross-Language
 *    - Run: testCrossLanguageSupport()
 *    - Verify: Returns Tamil name, fallback to English if not found
 * 
 * ✅ Test 6: Statistics
 *    - Run: testKBStatistics()
 *    - Verify: Shows 9 entities, 10 mappings, 8 languages
 * 
 * ✅ Test 7: Chat Integration
 *    - Run: testChatIntegration()
 *    - Verify: KB context flows into Chat component
 * 
 * Run all: 
 * testEnglishSymptomSearch();
 * testHindiSymptomSearch();
 * testMultipleSymptomsSearch();
 * testEmergencyCondition();
 * testCrossLanguageSupport();
 * testKBStatistics();
 * testChatIntegration();
 */

export {
  testEnglishSymptomSearch,
  testHindiSymptomSearch,
  testMultipleSymptomsSearch,
  testEmergencyCondition,
  testCrossLanguageSupport,
  testKBStatistics,
  testChatIntegration
};
