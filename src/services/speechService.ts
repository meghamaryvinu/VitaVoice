// Speech-to-Text and Text-to-Speech service using Web Speech API

import { languageService, type LanguageCode } from './languageService';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

type SpeechCallback = (transcript: string, isFinal: boolean) => void;
type SpeechErrorCallback = (error: string) => void;

class SpeechService {
    private recognition: SpeechRecognition | null = null;
    private synthesis: SpeechSynthesis;
    private isListening = false;
    private currentUtterance: SpeechSynthesisUtterance | null = null;

    constructor() {
        // Initialize Speech Recognition
        const SpeechRecognitionAPI =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognitionAPI) {
            this.recognition = new SpeechRecognitionAPI();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
        }

        // Initialize Speech Synthesis
        this.synthesis = window.speechSynthesis;
    }

    /**
     * Check if speech recognition is supported
     */
    isSpeechRecognitionSupported(): boolean {
        return this.recognition !== null;
    }

    /**
     * Check if speech synthesis is supported
     */
    isSpeechSynthesisSupported(): boolean {
        return 'speechSynthesis' in window;
    }

    /**
     * Start listening for speech input
     */
    startListening(
        onResult: SpeechCallback,
        onError?: SpeechErrorCallback,
        language?: LanguageCode
    ): void {
        if (!this.recognition) {
            onError?.('Speech recognition not supported in this browser');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        }

        const lang = language || languageService.getLanguage();
        const langCode = SUPPORTED_LANGUAGES[lang].code;

        this.recognition.lang = langCode;
        this.isListening = true;

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            const last = event.results.length - 1;
            const result = event.results[last];
            const transcript = result[0].transcript;
            const isFinal = result.isFinal;

            onResult(transcript, isFinal);
        };

        this.recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            onError?.(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.isListening = false;
            onError?.('Failed to start speech recognition');
        }
    }

    /**
     * Stop listening
     */
    stopListening(): void {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    /**
     * Check if currently listening
     */
    getIsListening(): boolean {
        return this.isListening;
    }

    /**
     * Speak text using text-to-speech
     */
    speak(
        text: string,
        options?: {
            language?: LanguageCode;
            rate?: number; // 0.1 to 10, default 1
            pitch?: number; // 0 to 2, default 1
            volume?: number; // 0 to 1, default 1
            onEnd?: () => void;
            onError?: (error: string) => void;
        }
    ): void {
        if (!this.isSpeechSynthesisSupported()) {
            options?.onError?.('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        this.stopSpeaking();

        const lang = options?.language || languageService.getLanguage();
        const langCode = SUPPORTED_LANGUAGES[lang].code;

        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.lang = langCode;
        this.currentUtterance.rate = options?.rate || 0.9; // Slightly slower for clarity
        this.currentUtterance.pitch = options?.pitch || 1;
        this.currentUtterance.volume = options?.volume || 1;

        // Try to find a voice for the language
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(lang)) ||
            voices.find(v => v.lang.startsWith('en'));

        if (voice) {
            this.currentUtterance.voice = voice;
        }

        this.currentUtterance.onend = () => {
            options?.onEnd?.();
            this.currentUtterance = null;
        };

        this.currentUtterance.onerror = (event: any) => {
            console.error('Speech synthesis error:', event);
            options?.onError?.(event.error);
            this.currentUtterance = null;
        };

        this.synthesis.speak(this.currentUtterance);
    }

    /**
     * Stop speaking
     */
    stopSpeaking(): void {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
            this.currentUtterance = null;
        }
    }

    /**
     * Check if currently speaking
     */
    isSpeaking(): boolean {
        return this.synthesis.speaking;
    }

    /**
     * Get available voices for a language
     */
    getVoicesForLanguage(language: LanguageCode): SpeechSynthesisVoice[] {
        const voices = this.synthesis.getVoices();
        return voices.filter(v => v.lang.startsWith(language));
    }

    /**
     * Pause speaking
     */
    pauseSpeaking(): void {
        if (this.synthesis.speaking && !this.synthesis.paused) {
            this.synthesis.pause();
        }
    }

    /**
     * Resume speaking
     */
    resumeSpeaking(): void {
        if (this.synthesis.paused) {
            this.synthesis.resume();
        }
    }
}

export const speechService = new SpeechService();
