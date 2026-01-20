// Language detection and translation service for VitaVoice

import { SUPPORTED_LANGUAGES } from '@/config/constants';

type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Common medical terms and UI translations
const translations: Record<LanguageCode, Record<string, string>> = {
    en: {
        // Greetings
        'greeting': 'Hello! I am VitaVoice, your healthcare assistant.',
        'how_can_help': 'How can I help you today?',
        'welcome_back': 'Welcome back!',

        // Symptom questions
        'main_problem': 'What is the main problem?',
        'when_started': 'When did it start?',
        'severity_question': 'How severe is it on a scale of 1-10?',
        'any_fever': 'Do you have fever?',
        'any_pain': 'Are you experiencing pain?',
        'breathing_ok': 'Is breathing normal?',

        // Common symptoms
        'fever': 'Fever',
        'headache': 'Headache',
        'cough': 'Cough',
        'cold': 'Cold',
        'body_ache': 'Body ache',
        'stomach_pain': 'Stomach pain',
        'diarrhea': 'Diarrhea',
        'vomiting': 'Vomiting',
        'weakness': 'Weakness',
        'dizziness': 'Dizziness',

        // Recommendations
        'rest_advice': 'Please take adequate rest',
        'hydration': 'Drink plenty of water',
        'see_doctor': 'Please consult a doctor',
        'emergency_call': 'This is an emergency. Call 108 immediately',

        // UI elements
        'speak_now': 'Speak now...',
        'listening': 'Listening...',
        'processing': 'Processing...',
        'send': 'Send',
        'cancel': 'Cancel',
        'continue': 'Continue',
        'back': 'Back',
    },
    ta: {
        'greeting': 'வணக்கம்! நான் விடாவாய்ஸ், உங்கள் சுகாதார உதவியாளர்.',
        'how_can_help': 'இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
        'welcome_back': 'மீண்டும் வரவேற்கிறோம்!',
        'main_problem': 'முக்கிய பிரச்சனை என்ன?',
        'when_started': 'இது எப்போது தொடங்கியது?',
        'severity_question': '1-10 அளவில் எவ்வளவு கடுமையானது?',
        'any_fever': 'காய்ச்சல் உள்ளதா?',
        'any_pain': 'வலி இருக்கிறதா?',
        'breathing_ok': 'சுவாசம் சாதாரணமாக உள்ளதா?',
        'fever': 'காய்ச்சல்',
        'headache': 'தலைவலி',
        'cough': 'இருமல்',
        'cold': 'சளி',
        'body_ache': 'உடல் வலி',
        'stomach_pain': 'வயிற்று வலி',
        'diarrhea': 'வயிற்றுப்போக்கு',
        'vomiting': 'வாந்தி',
        'weakness': 'பலவீனம்',
        'dizziness': 'தலைசுற்றல்',
        'rest_advice': 'தயவுசெய்து போதுமான ஓய்வு எடுங்கள்',
        'hydration': 'நிறைய தண்ணீர் குடியுங்கள்',
        'see_doctor': 'தயவுசெய்து மருத்துவரை அணுகவும்',
        'emergency_call': 'இது அவசரம். உடனடியாக 108 ஐ அழைக்கவும்',
        'speak_now': 'இப்போது பேசுங்கள்...',
        'listening': 'கேட்கிறது...',
        'processing': 'செயலாக்குகிறது...',
        'send': 'அனுப்பு',
        'cancel': 'ரத்து செய்',
        'continue': 'தொடர்',
        'back': 'பின்',
    },
    te: {
        'greeting': 'నమస్కారం! నేను విటావాయిస్, మీ ఆరోగ్య సహాయకుడిని.',
        'how_can_help': 'ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
        'welcome_back': 'తిరిగి స్వాగతం!',
        'main_problem': 'ముఖ్య సమస్య ఏమిటి?',
        'when_started': 'ఇది ఎప్పుడు ప్రారంభమైంది?',
        'severity_question': '1-10 స్కేల్‌లో ఎంత తీవ్రంగా ఉంది?',
        'any_fever': 'జ్వరం ఉందా?',
        'any_pain': 'నొప్పి అనుభవిస్తున్నారా?',
        'breathing_ok': 'శ్వాస సాధారణంగా ఉందా?',
        'fever': 'జ్వరం',
        'headache': 'తలనొప్పి',
        'cough': 'దగ్గు',
        'cold': 'జలుబు',
        'body_ache': 'శరీర నొప్పి',
        'stomach_pain': 'కడుపు నొప్పి',
        'diarrhea': 'విరేచనాలు',
        'vomiting': 'వాంతులు',
        'weakness': 'బలహీనత',
        'dizziness': 'తల తిరగడం',
        'rest_advice': 'దయచేసి తగినంత విశ్రాంతి తీసుకోండి',
        'hydration': 'చాలా నీరు త్రాగండి',
        'see_doctor': 'దయచేసి వైద్యుడిని సంప్రదించండి',
        'emergency_call': 'ఇది అత్యవసరం. వెంటనే 108కి కాల్ చేయండి',
        'speak_now': 'ఇప్పుడు మాట్లాడండి...',
        'listening': 'వింటోంది...',
        'processing': 'ప్రాసెస్ చేస్తోంది...',
        'send': 'పంపు',
        'cancel': 'రద్దు',
        'continue': 'కొనసాగించు',
        'back': 'వెనుకకు',
    },
    hi: {
        'greeting': 'नमस्ते! मैं विटावॉइस हूं, आपका स्वास्थ्य सहायक।',
        'how_can_help': 'आज मैं आपकी कैसे मदद कर सकता हूं?',
        'welcome_back': 'वापसी पर स्वागत है!',
        'main_problem': 'मुख्य समस्या क्या है?',
        'when_started': 'यह कब शुरू हुआ?',
        'severity_question': '1-10 के पैमाने पर यह कितना गंभीर है?',
        'any_fever': 'क्या बुखार है?',
        'any_pain': 'क्या दर्द हो रहा है?',
        'breathing_ok': 'क्या सांस लेना सामान्य है?',
        'fever': 'बुखार',
        'headache': 'सिरदर्द',
        'cough': 'खांसी',
        'cold': 'सर्दी',
        'body_ache': 'शरीर दर्द',
        'stomach_pain': 'पेट दर्द',
        'diarrhea': 'दस्त',
        'vomiting': 'उल्टी',
        'weakness': 'कमजोरी',
        'dizziness': 'चक्कर आना',
        'rest_advice': 'कृपया पर्याप्त आराम करें',
        'hydration': 'खूब पानी पिएं',
        'see_doctor': 'कृपया डॉक्टर से परामर्श करें',
        'emergency_call': 'यह आपातकाल है। तुरंत 108 पर कॉल करें',
        'speak_now': 'अब बोलें...',
        'listening': 'सुन रहा है...',
        'processing': 'प्रोसेस कर रहा है...',
        'send': 'भेजें',
        'cancel': 'रद्द करें',
        'continue': 'जारी रखें',
        'back': 'पीछे',
    },
    bn: {
        'greeting': 'নমস্কার! আমি ভিটাভয়েস, আপনার স্বাস্থ্য সহায়ক।',
        'how_can_help': 'আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
        'welcome_back': 'আবার স্বাগতম!',
        'main_problem': 'মূল সমস্যা কী?',
        'when_started': 'এটি কখন শুরু হয়েছিল?',
        'severity_question': '১-১০ স্কেলে এটি কতটা গুরুতর?',
        'any_fever': 'জ্বর আছে কি?',
        'any_pain': 'ব্যথা অনুভব করছেন?',
        'breathing_ok': 'শ্বাস-প্রশ্বাস কি স্বাভাবিক?',
        'fever': 'জ্বর',
        'headache': 'মাথাব্যথা',
        'cough': 'কাশি',
        'cold': 'সর্দি',
        'body_ache': 'শরীর ব্যথা',
        'stomach_pain': 'পেট ব্যথা',
        'diarrhea': 'ডায়রিয়া',
        'vomiting': 'বমি',
        'weakness': 'দুর্বলতা',
        'dizziness': 'মাথা ঘোরা',
        'rest_advice': 'দয়া করে পর্যাপ্ত বিশ্রাম নিন',
        'hydration': 'প্রচুর পানি পান করুন',
        'see_doctor': 'দয়া করে ডাক্তারের পরামর্শ নিন',
        'emergency_call': 'এটি জরুরি। অবিলম্বে ১০৮ এ কল করুন',
        'speak_now': 'এখন বলুন...',
        'listening': 'শুনছি...',
        'processing': 'প্রক্রিয়াকরণ...',
        'send': 'পাঠান',
        'cancel': 'বাতিল',
        'continue': 'চালিয়ে যান',
        'back': 'পিছনে',
    },
    kn: {
        'greeting': 'ನಮಸ್ಕಾರ! ನಾನು ವಿಟಾವಾಯ್ಸ್, ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಾಯಕ.',
        'how_can_help': 'ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
        'welcome_back': 'ಮತ್ತೆ ಸ್ವಾಗತ!',
        'main_problem': 'ಮುಖ್ಯ ಸಮಸ್ಯೆ ಏನು?',
        'when_started': 'ಇದು ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು?',
        'severity_question': '1-10 ಮಾಪಕದಲ್ಲಿ ಇದು ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ?',
        'any_fever': 'ಜ್ವರ ಇದೆಯೇ?',
        'any_pain': 'ನೋವು ಅನುಭವಿಸುತ್ತಿದ್ದೀರಾ?',
        'breathing_ok': 'ಉಸಿರಾಟ ಸಾಮಾನ್ಯವಾಗಿದೆಯೇ?',
        'fever': 'ಜ್ವರ',
        'headache': 'ತಲೆನೋವು',
        'cough': 'ಕೆಮ್ಮು',
        'cold': 'ಶೀತ',
        'body_ache': 'ದೇಹ ನೋವು',
        'stomach_pain': 'ಹೊಟ್ಟೆ ನೋವು',
        'diarrhea': 'ಅತಿಸಾರ',
        'vomiting': 'ವಾಂತಿ',
        'weakness': 'ದೌರ್ಬಲ್ಯ',
        'dizziness': 'ತಲೆತಿರುಗುವಿಕೆ',
        'rest_advice': 'ದಯವಿಟ್ಟು ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ',
        'hydration': 'ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ',
        'see_doctor': 'ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ',
        'emergency_call': 'ಇದು ತುರ್ತು. ತಕ್ಷಣ 108 ಗೆ ಕರೆ ಮಾಡಿ',
        'speak_now': 'ಈಗ ಮಾತನಾಡಿ...',
        'listening': 'ಕೇಳುತ್ತಿದೆ...',
        'processing': 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ...',
        'send': 'ಕಳುಹಿಸಿ',
        'cancel': 'ರದ್ದುಮಾಡಿ',
        'continue': 'ಮುಂದುವರಿಸಿ',
        'back': 'ಹಿಂದೆ',
    },
    ml: {
        'greeting': 'നമസ്കാരം! ഞാൻ വിറ്റാവോയ്സ്, നിങ്ങളുടെ ആരോഗ്യ സഹായി.',
        'how_can_help': 'ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?',
        'welcome_back': 'തിരികെ സ്വാഗതം!',
        'main_problem': 'പ്രധാന പ്രശ്നം എന്താണ്?',
        'when_started': 'ഇത് എപ്പോൾ ആരംഭിച്ചു?',
        'severity_question': '1-10 സ്കെയിലിൽ ഇത് എത്ര ഗുരുതരമാണ്?',
        'any_fever': 'പനി ഉണ്ടോ?',
        'any_pain': 'വേദന അനുഭവപ്പെടുന്നുണ്ടോ?',
        'breathing_ok': 'ശ്വാസോച്ഛ്വാസം സാധാരണമാണോ?',
        'fever': 'പനി',
        'headache': 'തലവേദന',
        'cough': 'ചുമ',
        'cold': 'ജലദോഷം',
        'body_ache': 'ശരീരവേദന',
        'stomach_pain': 'വയറുവേദന',
        'diarrhea': 'വയറിളക്കം',
        'vomiting': 'ഛർദ്ദി',
        'weakness': 'ബലഹീനത',
        'dizziness': 'തലകറക്കം',
        'rest_advice': 'ദയവായി മതിയായ വിശ്രമം എടുക്കുക',
        'hydration': 'ധാരാളം വെള്ളം കുടിക്കുക',
        'see_doctor': 'ദയവായി ഡോക്ടറെ സമീപിക്കുക',
        'emergency_call': 'ഇത് അടിയന്തരമാണ്. ഉടൻ 108 ലേക്ക് വിളിക്കുക',
        'speak_now': 'ഇപ്പോൾ സംസാരിക്കുക...',
        'listening': 'കേൾക്കുന്നു...',
        'processing': 'പ്രോസസ്സ് ചെയ്യുന്നു...',
        'send': 'അയയ്ക്കുക',
        'cancel': 'റദ്ദാക്കുക',
        'continue': 'തുടരുക',
        'back': 'പിന്നോട്ട്',
    },
};

class LanguageService {
    private currentLanguage: LanguageCode = 'en';

    /**
     * Detect language from text input
     */
    detectLanguage(text: string): LanguageCode {
        // Simple detection based on Unicode ranges
        const tamilRange = /[\u0B80-\u0BFF]/;
        const teluguRange = /[\u0C00-\u0C7F]/;
        const hindiRange = /[\u0900-\u097F]/;
        const bengaliRange = /[\u0980-\u09FF]/;
        const kannadaRange = /[\u0C80-\u0CFF]/;
        const malayalamRange = /[\u0D00-\u0D7F]/;

        if (tamilRange.test(text)) return 'ta';
        if (teluguRange.test(text)) return 'te';
        if (hindiRange.test(text)) return 'hi';
        if (bengaliRange.test(text)) return 'bn';
        if (kannadaRange.test(text)) return 'kn';
        if (malayalamRange.test(text)) return 'ml';

        return 'en';
    }

    /**
     * Set current language
     */
    setLanguage(lang: LanguageCode): void {
        this.currentLanguage = lang;
        localStorage.setItem('vitavoice_language', lang);
    }

    /**
     * Get current language
     */
    getLanguage(): LanguageCode {
        const saved = localStorage.getItem('vitavoice_language') as LanguageCode;
        if (saved && saved in SUPPORTED_LANGUAGES) {
            this.currentLanguage = saved;
        }
        return this.currentLanguage;
    }

    /**
     * Translate a key to current language
     */
    translate(key: string, lang?: LanguageCode): string {
        const targetLang = lang || this.currentLanguage;
        return translations[targetLang]?.[key] || translations.en[key] || key;
    }

    /**
     * Get all translations for current language
     */
    getAllTranslations(lang?: LanguageCode): Record<string, string> {
        const targetLang = lang || this.currentLanguage;
        return translations[targetLang] || translations.en;
    }

    /**
     * Get language info
     */
    getLanguageInfo(lang?: LanguageCode) {
        const targetLang = lang || this.currentLanguage;
        return SUPPORTED_LANGUAGES[targetLang];
    }

    /**
     * Get all supported languages
     */
    getSupportedLanguages() {
        return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
            code: code as LanguageCode,
            ...info,
        }));
    }

    /**
     * Check if text contains emergency keywords
     */
    containsEmergencyKeywords(text: string, lang?: LanguageCode): boolean {
        const targetLang = lang || this.detectLanguage(text);
        const keywords = EMERGENCY_KEYWORDS[targetLang] || [];
        const lowerText = text.toLowerCase();

        return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
    }
}

export const languageService = new LanguageService();
export type { LanguageCode };
