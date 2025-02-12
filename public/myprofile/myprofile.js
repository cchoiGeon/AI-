let userResponse = ''; // Variable to store the user's response
let lastUserResponse = ''; // Variable to store the last user response
let recognition; // Speech recognition variable
let recognizing = false; // Speech recognition state
let finalTranscript = ''; // Variable to store the final transcribed text
let speechSynthesisUtterance; // Current speech synthesis object

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZTgwODY0ZDUtN2M3ZS00MjZlLWE2OGYtMjBhMjVkYzlhMTFlIiwiaWF0IjoxNzM3MjE5NTI1LCJleHAiOjE3MzcyMjMxMjV9.PAX33Ywc760Hb33n_w6K2znuAPPgH6Gg29QAm6PISFk';
// Listen for the check.js completion event
document.addEventListener('checkJsComplete', () => {
    const questionText = document.getElementById('question-title').textContent;
    speakText(questionText); // Use speech synthesis to speak the question

    const replayBtn = document.getElementById('replayBtn');
    replayBtn.style.display = 'block'; // Show the replay button
    replayBtn.addEventListener('click', () => {
        speakText(questionText); // Replay the question text when the button is clicked
    });
});

// Function to speak text using the Web Speech API
function speakText(text) {
    return new Promise((resolve) => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel(); // Cancel any ongoing speech synthesis
        }
        speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
        speechSynthesisUtterance.lang = 'ko-KR'; // Set the language to Korean
        speechSynthesisUtterance.onend = resolve; // Resolve the promise when speaking ends
        window.speechSynthesis.speak(speechSynthesisUtterance); // Start speaking
    });
}

// Event listener for the "+" button
document.addEventListener("DOMContentLoaded", () => {
    const plusBtn = document.getElementById("plusBtn");
    const sendBtn =  document.getElementById("sendBtn");

    if (!plusBtn) return; // plusBtn이 존재하지 않으면 실행하지 않음
    if (!sendBtn) return;

    plusBtn.addEventListener("click", () => {
        const plusBtnImage = document.getElementById("plusBtn");
        const actionButtons = document.getElementById("action-buttons");

        if (!actionButtons.classList.contains("show")) {
            // 슬라이드업 애니메이션
            actionButtons.style.display = "flex"; // flex로 표시
            plusBtnImage.style.transform = "rotate(45deg)";

            setTimeout(() => {
                actionButtons.classList.add("show");
            }, 0); // 약간의 지연시간을 추가하여 transition 작동
        } else {
            // 슬라이드다운 애니메이션
            actionButtons.classList.remove("show");
            plusBtnImage.style.transform = "rotate(0deg)";

            setTimeout(() => {
                actionButtons.style.display = "none"; // 애니메이션이 끝난 후 숨김 처리
            }, 300); // transition 시간에 맞춰서 숨김 처리
        }
    });

    sendBtn.addEventListener('click', async () => {
        const responseInput = document.getElementById('response-input');
        const responseText = responseInput.value.trim(); // Get the trimmed value of the response
        const responseMessages = document.querySelector('.response-messages');
    
        if (responseText !== '') {
            // Add user reply to the message bubble
            const newMessage = document.createElement('div');
            newMessage.classList.add('message-bubble', 'right-bubble');
            newMessage.textContent = responseText;
            responseMessages.appendChild(newMessage);
    
            // Reset the speech recognition data
            finalTranscript = ''; // Reset the final transcribed text
            responseInput.value = ''; // Clear the textarea
    
            // Store the user's response
            userResponse = responseText;
            lastUserResponse = responseText; // Store the last response
    
            // Disable the response input and send button
            responseInput.disabled = true;
            document.getElementById('sendBtn').disabled = true;
    
            responseMessages.scrollTop = responseMessages.scrollHeight; // Scroll to the latest message
    
            const systemMessage = document.createElement('div');
            systemMessage.classList.add('message-bubble', 'left-bubble', 'gray-bubble');
            systemMessage.innerHTML = `작성 중...`;
            responseMessages.appendChild(systemMessage);
    
            const replayBtn = document.createElement('button');
            replayBtn.classList.add('replay-button');
            replayBtn.textContent = '다시 들려줘';
    
            try {
                if (isNumericString(responseText)) {
                    throw new Error(); // Throw an error if the response is numeric
                }
    
                // Make a POST request to the API to get the case number
                const apiResponse = await fetch('http://localhost:3000/chatGpt/case', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    },
                    body: JSON.stringify({ data: userResponse })
                });
                const result = await apiResponse.json();
                const caseNum = result.result;
    
                // const caseNum = 'case_1';
                const data = convertToNumberedObject(caseNum)
                const formattedData = Object.entries(data).map(([key, value]) => `${key}. ${value}`).join('\n');
    
                systemMessage.innerHTML = `<span>답변을 토대로, 자서전 목차를 구성해봤어요!. 자서전을 작성하기 전에 편안한 마음가짐과 여유있는 시간이 필요해요. 자신의 삶을 돌아보며 말씀해주세요. 글을 제가 멋있게 써드릴게요!</span>`;
                responseMessages.appendChild(systemMessage);
    
                // await speakText(systemMessage.innerText); // Speak the system message
    
                responseMessages.appendChild(replayBtn);
    
                // Add customized questions from the system
                const systemMessage2 = document.createElement('div');
                systemMessage2.classList.add('message-bubble', 'left-bubble', 'gray-bubble');
                systemMessage2.innerHTML = `<span>${formattedData.replace(/\n/g, '<br>')}</span>`;
                responseMessages.appendChild(systemMessage2);
                responseMessages.scrollTop = responseMessages.scrollHeight; // Scroll to the latest message
    
                // await speakText(formattedData); // Speak the formatted data
    
                const replayBtn2 = document.createElement('button');
                replayBtn2.classList.add('replay-button');
                replayBtn2.textContent = '다시 들려줘';
                responseMessages.appendChild(replayBtn2);
    
                replayBtn2.addEventListener('click', () => {
                    speakText(formattedData); // Replay the formatted data when clicked
                });
                
                // Make a POST request to save the profile data
                await fetch('http://localhost:3000/myprofile/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    },
                    body: JSON.stringify({ caseNum })
                });
    
                // Add a new system message
                const finalSystemMessage = document.createElement('div');
                finalSystemMessage.classList.add('message-bubble', 'left-bubble', 'gray-bubble');
                finalSystemMessage.innerHTML = `<span>이제 자서전을 써보러 갈까요?</span>`;
                responseMessages.appendChild(finalSystemMessage);
    
                const yesButton = document.createElement('button');
                yesButton.classList.add('replay-button');
                yesButton.textContent = '네';
                yesButton.addEventListener('click', () => {
                    if (window.speechSynthesis.speaking) {
                        window.speechSynthesis.cancel(); // Cancel speech synthesis before redirecting
                    }
                    window.location.href = '/posts/1'; // Redirect to write page
                });
    
                responseMessages.appendChild(yesButton);
            } catch (error) {
                systemMessage.innerHTML = `<span> 새로 고침한 뒤 다시 작성해 주시겠어요? </span>`; // Error handling message
            }
        }
    });
    document.getElementById('recordButton').addEventListener('click', initializeVoiceRecognition);
});

// Function to initialize and handle voice recognition
function initializeVoiceRecognition() {
    const responseInput = document.getElementById('response-input');

    // 음성 인식이 이미 초기화되어 있다면 새로 만들지 않음
    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'ko-KR'; // 한국어 설정
        recognition.continuous = true; // 지속적인 음성 인식
        recognition.interimResults = true; // 중간 결과 활성화

        recognition.onresult = (event) => {
            let interimTranscript = '';
            responseInput.value = finalTranscript; // 최종 텍스트 먼저 설정

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            responseInput.value = finalTranscript + interimTranscript; // 실시간으로 반영
        };

        recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
        };

        recognition.onend = () => {
            recognizing = false;
            document.getElementById('voice-status').style.display = 'none';
            document.getElementById('recordButton').classList.remove('recording');
            stopTimer();
        };
    }

    toggleRecording();
}

// 녹음 상태 변경
function toggleRecording() {
    console.log("toggleRecording 실행됨");

    if (recognizing) {
        stopRecording();
    } else {
        startRecording();
    }
}

// 녹음 시작
function startRecording() {
    if (recognizing) return; // 중복 실행 방지

    recognizing = true;
    document.getElementById('voice-status').style.display = 'block';
    document.getElementById('recordButton').classList.add('recording');

    try {
        recognition.start(); // 음성 인식 시작
    } catch (e) {
        console.error("음성 인식 시작 오류:", e);
    }

    startTimer();
}

// 녹음 종료
function stopRecording() {
    recognizing = false;
    document.getElementById('voice-status').style.display = 'none';
    document.getElementById('recordButton').classList.remove('recording');

    recognition.stop(); // 음성 인식 중지
    stopTimer();
}

// 타이머 관련 함수
let timerInterval;
let startTime;

function startTimer() {
    startTime = Date.now();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    document.querySelector('.timer').textContent = '00:00';
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    document.querySelector('.timer').textContent = `${minutes}:${seconds}`;
}

// Function to check if a string is numeric
function isNumericString(data) {
    // Use a regular expression to check if the string is numeric
    const numericRegex = /^\d+$/;

    // Check if the data is a string and matches the numeric pattern
    if (typeof data === 'string' && numericRegex.test(data)) {
        return true;
    }
    return false;
}
function getCaseSections(caseNum) {
    const sections = {
        case_1: [
            "탄생과 유아기 시절",
            "가족환경과 성장환경",
            "청소년기와 학창시절",
            "20대 시절 - 대학생활",
            "20대 시절 - 직장생활",
            "결혼 이야기",
            "자녀 이야기",
            "현재의 삶",
            "인생의 교훈과 회고",
            "미래의 계획과 희망"
        ],
        case_2: [
            "탄생과 유아기 시절",
            "가족환경과 성장환경",
            "청소년기와 학창시절",
            "20대 시절 - 대학생활",
            "20대 시절 - 직장생활",
            "결혼 이야기",
            "현재의 삶",
            "인생의 교훈과 회고",
            "미래의 계획과 희망"
        ],
        case_3: [
            "탄생과 유아기 시절",
            "가족환경과 성장환경",
            "청소년기와 학창시절",
            "20대 시절 - 대학생활",
            "20대 시절 - 직장생활",
            "현재의 삶",
            "인생의 교훈과 회고",
            "미래의 계획과 희망"
        ],
        case_4: [
            "탄생과 유아기 시절",
            "가족환경과 성장환경",
            "청소년기와 학창시절",
            "20대 시절 - 직장생활",
            "결혼 이야기",
            "자녀 이야기",
            "현재의 삶",
            "인생의 교훈과 회고",
            "미래의 계획과 희망"
        ],
        case_5: [
            "탄생과 유아기 시절",
            "가족환경과 성장환경",
            "청소년기와 학창시절",
            "20대 시절 - 직장생활",
            "결혼 이야기",
            "현재의 삶",
            "인생의 교훈과 회고",
            "미래의 계획과 희망"
        ],
        case_6: [
            "탄생과 유아기 시절",
            "가족환경과 성장환경",
            "청소년기와 학창시절",
            "20대 시절 - 직장생활",
            "현재의 삶",
            "인생의 교훈과 회고",
            "미래의 계획과 희망"
        ]
    };

    return sections[caseNum] || [];
}

function convertToNumberedObject(caseNum) {
    const sections = getCaseSections(caseNum);

    // Convert array to numbered object
    const numberedObject = sections.reduce((obj, section, index) => {
        obj[index + 1] = section; // Assign index + 1 as key
        return obj;
    }, {});

    return numberedObject;
}