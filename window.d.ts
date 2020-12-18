export {};

declare global {
    interface Window {
        webkitSpeechRecognition: {
            prototype: SpeechRecognition;
            new(): SpeechRecognition;
        };
    }
}