import { PoseLandmarker, FilesetResolver, NormalizedLandmark } from "@mediapipe/tasks-vision";

// DOM Елементи
const video = document.getElementById('webcam') as HTMLVideoElement;
const canvas = document.getElementById('output') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const ui = document.getElementById('ui')!;
const statusEl = document.getElementById('status')!;
const repsEl = document.getElementById('reps')!;
const angleEl = document.getElementById('angle')!;
const stageEl = document.getElementById('stage')!;

// Стейт вправи
let reps = 0;
let stage: 'STANDING' | 'DESCENDING' | 'SQUATTING' = 'STANDING';
let poseLandmarker: PoseLandmarker;

// === СИСТЕМА ПРИВ'ЯЗКИ ТА ПАМ'ЯТІ ===
let lockedSide: 'RIGHT' | 'LEFT' | null = null;

// Зберігаємо останні відомі координати (щоб лінії ніколи не зникали)
let lastHip = { x: 0, y: 0 };
let lastKnee = { x: 0, y: 0 };
let lastAnkle = { x: 0, y: 0 };
let isInitialized = false; 

// Запуск камери
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720, facingMode: "user" } 
        });
        video.srcObject = stream;
        video.onplaying = () => {
            statusEl.innerText = "Ініціалізація ШІ...";
            initMediaPipe();
        };
    } catch (err: any) {
        statusEl.innerText = "Помилка камери: " + err.message;
    }
}

// Ініціалізація MediaPipe
async function initMediaPipe() {
    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: { 
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
                delegate: "GPU" 
            },
            runningMode: "VIDEO"
        });
        
        statusEl.style.display = "none";
        ui.style.display = "block";
        render();
    } catch (err: any) {
        statusEl.innerText = "Помилка ШІ: " + err.message;
    }
}

// Математика кута
function getAngle(a: {x: number, y: number}, b: {x: number, y: number}, c: {x: number, y: number}): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    return angle > 180 ? 360 - angle : angle;
}

// Малювання однієї лінії
function drawLine(p1: {x: number, y: number}, p2: {x: number, y: number}, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
    ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
    ctx.stroke();
}

// Розумне згладжування (Sticky Tracker)
function updatePoint(lastPt: {x: number, y: number}, newPt: NormalizedLandmark) {
    // Якщо ШІ бачить точку добре (>60%), оновлюємо швидко (alpha = 0.6)
    // Якщо ШІ загубив точку (рука перекрила), оновлюємо ДУЖЕ повільно (alpha = 0.05), майже заморожуємо
    const alpha = newPt.visibility > 0.6 ? 0.6 : 0.05; 
    
    return {
        x: lastPt.x * (1 - alpha) + newPt.x * alpha,
        y: lastPt.y * (1 - alpha) + newPt.y * alpha
    };
}

// Головний цикл
async function render() {
    if (video.videoWidth === 0) {
        requestAnimationFrame(render);
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (poseLandmarker) {
        const results = poseLandmarker.detectForVideo(video, performance.now());
        
        if (results.landmarks && results.landmarks.length > 0) {
            const lms = results.landmarks[0];
            
            // 1. Блокування сторони (відбувається один раз)
            if (!lockedSide) {
                const rightVis = lms[24].visibility + lms[26].visibility + lms[28].visibility;
                const leftVis = lms[23].visibility + lms[25].visibility + lms[27].visibility;
                
                // Якщо хоч якась нога нормально в кадрі — лочимо назавжди
                if (rightVis > 1.5 || leftVis > 1.5) {
                    lockedSide = rightVis > leftVis ? 'RIGHT' : 'LEFT';
                }
            }

            // 2. Якщо сторона залочена, оновлюємо координати
            if (lockedSide) {
                const rawHip = lockedSide === 'RIGHT' ? lms[24] : lms[23];
                const rawKnee = lockedSide === 'RIGHT' ? lms[26] : lms[25];
                const rawAnkle = lockedSide === 'RIGHT' ? lms[28] : lms[27];

                // Первинна ініціалізація точок
                if (!isInitialized) {
                    lastHip = { x: rawHip.x, y: rawHip.y };
                    lastKnee = { x: rawKnee.x, y: rawKnee.y };
                    lastAnkle = { x: rawAnkle.x, y: rawAnkle.y };
                    isInitialized = true;
                } else {
                    // Оновлення з урахуванням інерції
                    lastHip = updatePoint(lastHip, rawHip);
                    lastKnee = updatePoint(lastKnee, rawKnee);
                    lastAnkle = updatePoint(lastAnkle, rawAnkle);
                }
            }
        }
    }
    
    // 3. Відмальовка та розрахунки відбуваються ЗАВЖДИ, якщо є ініціалізовані точки
    if (isInitialized) {
        const angle = getAngle(lastHip, lastKnee, lastAnkle);
        angleEl.innerText = `${Math.round(angle)}°`;

        // Автомат станів
        const isSquatting = angle < 95; // Поріг нижньої точки

        if (stage === 'STANDING' && angle < 140) stage = 'DESCENDING';
        else if (stage === 'DESCENDING' && isSquatting) stage = 'SQUATTING';
        else if (stage === 'SQUATTING' && angle > 150) {
            stage = 'STANDING';
            reps++;
            repsEl.innerText = reps.toString();
        }

        stageEl.innerText = stage;

        // Малюємо (ніколи не ховаємо)
        const activeColor = stage === 'SQUATTING' ? "#ff3333" : "#8AA500";
        drawLine(lastHip, lastKnee, activeColor);
        drawLine(lastKnee, lastAnkle, activeColor);

        // Точка шарніра
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(lastKnee.x * canvas.width, lastKnee.y * canvas.height, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    requestAnimationFrame(render);
}

startCamera();