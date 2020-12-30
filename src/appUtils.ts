
export const random = (from: number, to: number) =>
    Math.floor(Math.random() * (to - from) + from);

export const percentageToArc = (correctPercentage: number, radius: number) => {
    let d = "";
    const startX = 50;
    const startY = 50;
    const step = (1 / 180) * Math.PI;

    let radians = -90 * step;
    let x = startX + Math.cos(radians) * radius;
    let y = startY + Math.sin(radians) * radius;

    const steps = Math.floor(correctPercentage * 360);

    d += ` M ${x} ${y}`;

    for (const _ of Array(steps)) {
        radians += step;

        x = startX + Math.cos(radians) * radius;
        y = startY + Math.sin(radians) * radius;

        d += ` L ${x} ${y}`;
    }

    return d;
};

export const hasBuiltInSpeechSynthesis = !!window.speechSynthesis;


export const recordAudio = (timeout: number) =>
    navigator.mediaDevices.getUserMedia({ audio: true }).then(
        (mediaStream) =>
            new Promise((resolve) => {
                const mediaRecorder = new MediaRecorder(mediaStream);
                const audioChunks: Blob[] = [];

                mediaRecorder.addEventListener("dataavailable", (event) => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener("stop", () => {
                    const blob = new Blob(audioChunks);
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                });

                mediaRecorder.start();

                setTimeout(() => {
                    mediaRecorder.stop();
                }, timeout);
            })
    );

export const recognizeSpeech = (
    languageId: string,
    onstart: () => void,
    onresult: () => void,
    onend: () => void
) => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.lang = languageId;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = onstart;
    recognition.onresult = onresult;
    recognition.onend = onend;

    recognition.start();
};

export const playAudioWithSpeechSynthesis = (language: string, text: string) =>
    new Promise((resolve) => {
        const speechSynthesis = window.speechSynthesis;
        const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
        speechSynthesisUtterance.lang = language;
        speechSynthesisUtterance.addEventListener("end", resolve);

        speechSynthesis.speak(speechSynthesisUtterance);
    });