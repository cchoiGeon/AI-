let firstUserResponse = ''; // 첫 번째 사용자의 응답을 저장할 변수
let secondUserResponse = ''; // 두 번째 사용자의 응답을 저장할 변수
let recognition; // 음성 인식 변수
let recognizing = false; // 음성 인식 상태
let finalTranscript = ''; // 최종 인식된 텍스트를 저장할 변수
let currentQuestion = ''; // 현재 질문을 저장할 변수
let currentSecondaryQuestion = ''; // 현재 2차 질문을 저장할 변수
let currentQuestionIndex = 1; // 현재 질문의 인덱스
let totalQuestions = 0; // 전체 질문 수
let questions = {}; // 모든 질문 저장
let isResult = false; // 결과를 나타내는 상태 변수
let speechSynthesisUtterance; // Current speech synthesis object

let mainQuestionId = 5;
let subQuestionId;

// 하드코딩된 대질문과 소질문
const mainQuestion = "20대 시절-직장생활";
questions = {
    "1": "첫 직장을 어떻게 구하게 되었나요? 그 과정에 대해 이야기해주세요.",
    "2": "직장 생활에서 가장 기억에 남는 프로젝트는 무엇이었나요? 그 프로젝트의 성공 요인은 무엇이었나요?",
    "3": "직장에서의 인간관계는 어땠나요? 특별히 친했던 동료나 멘토가 있나요?",
    "4": "직장 생활 중 가장 힘들었던 순간은 언제였나요? 그 어려움을 어떻게 극복했나요?",
    "5": "직장 생활을 통해 얻은 가장 큰 교훈은 무엇인가요?"
};
totalQuestions = Object.keys(questions).length;

document.addEventListener('checkJsComplete', () => {
    try {
        // 초기 대질문과 소질문을 하드코딩된 값으로 설정
        currentQuestion = questions[currentQuestionIndex.toString()];
        document.getElementById('title').textContent = mainQuestion;

        // 첫 번째 질문 표시
        addQuestionMessage(currentQuestion);

        // 질문 읽기
        speakText(currentQuestion);

    } catch (error) {
        console.error('Error initializing questions:', error);
    }
});

document.getElementById('plusBtn').addEventListener('click', () => {
    const actionButtons = document.getElementById('action-buttons');
    // Toggle the visibility of the action buttons
    if (actionButtons.style.display === 'none' || actionButtons.style.display === '') {
        actionButtons.style.display = 'flex';
        initializeVoiceRecognition(); // Initialize the voice recognition when shown
    } else {
        actionButtons.style.display = 'none';
    }
});

document.getElementById('sendBtn').addEventListener('click', async () => {
    const responseInput = document.getElementById('response-input');
    const responseText = responseInput.value.trim();
    const responseMessages = document.querySelector('.response-messages');

    if (responseText !== '') {
        // 사용자 답장 추가
        const newMessage = document.createElement('div');
        newMessage.classList.add('message-bubble', 'right-bubble');
        newMessage.textContent = responseText;
        responseMessages.appendChild(newMessage);
        finalTranscript = ''; // 최종 인식된 텍스트 초기화
        responseInput.value = '';

        if (!isResult) {
            // 첫 번째 답장을 저장
            firstUserResponse = responseText;

            // 작성중... 메시지 추가
            const systemMessage = document.createElement('div');
            systemMessage.classList.add('message-bubble', 'left-bubble');
            systemMessage.textContent = '작성중...';
            responseMessages.appendChild(systemMessage);

            // 사용자 응답과 현재 질문을 서버로 전송하여 2차 질문 요청
            try {
                if (isNumericString(responseText)) {
                    throw new Error();
                }

                // Request the secondary question based on the first user response
                const apiResponse = await fetch('https://asia-northeast3-life-legacy-dev.cloudfunctions.net/api/chatGpt/makeReQuestion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ question: currentQuestion, data: responseText })
                });

                const result = await apiResponse.json();
                currentSecondaryQuestion = result.result.data; // Store the secondary question

                // Update the system message with the secondary question
                systemMessage.textContent = currentSecondaryQuestion;

                // 시스템 메시지 읽기
                await speakText(systemMessage.textContent); // TTS가 끝날 때까지 대기

                // 다시 들려줘 버튼 추가
                addReplayButton(systemMessage.textContent, responseMessages);

                // Now ready for the second user response
                isResult = true; // 상태를 결과 처리 상태로 변경

            } catch (error) {
                systemMessage.textContent = '다시 작성해주세요.';
            }
        } else {
            // 두 번째 답장을 저장
            secondUserResponse = responseText;

            // 작성중... 메시지 추가
            const resultMessage = document.createElement('div');
            resultMessage.classList.add('message-bubble', 'left-bubble', 'gray-bubble');
            resultMessage.innerHTML = `<span>작성중...</span>`;
            responseMessages.appendChild(resultMessage);

            // 두 답장을 합쳐서 서버로 전송
            try {
                if (isNumericString(responseText)) {
                    throw new Error();
                }
                // Combine both responses with their respective questions
                const apiResponse = await fetch('https://asia-northeast3-life-legacy-dev.cloudfunctions.net/api/chatGpt/combine', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        question1: currentQuestion,
                        question2: currentSecondaryQuestion, // Use the stored secondary question
                        data1: firstUserResponse,
                        data2: secondUserResponse
                    })
                });

                const result = await apiResponse.json();

                resultMessage.innerHTML = `<span>이렇게 저장했어요!</span>`;

                const resultMessage2 = document.createElement('div');
                resultMessage2.classList.add('message-bubble', 'left-bubble', 'gray-bubble');
                resultMessage2.innerHTML = `<span>${result.result.data}</span>`;
                responseMessages.appendChild(resultMessage2);

                // 시스템 메시지 읽기
                await speakText(resultMessage2.textContent); // TTS가 끝날 때까지 대기

                // 다시 들려줘 버튼 추가
                addReplayButton(resultMessage2.textContent, responseMessages);

                subQuestionId = currentQuestionIndex;

                await fetch('https://asia-northeast3-life-legacy-dev.cloudfunctions.net/api/posts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ data: result.result.data, mainQuestionId, subQuestionId, question: currentQuestion })
                });

                // Reset for the next question
                isResult = false; // 상태를 초기화
                firstUserResponse = '';
                secondUserResponse = '';
                currentSecondaryQuestion = ''; // Reset the secondary question for the next main question

                if (currentQuestionIndex < totalQuestions) {
                    currentQuestionIndex++;
                    currentQuestion = questions[currentQuestionIndex.toString()];
                    addQuestionMessage(currentQuestion);

                    // 질문 읽기
                    await speakText(currentQuestion); // TTS가 끝날 때까지 대기
                } else {
                    const finalSystemMessage = document.createElement('div');
                    finalSystemMessage.classList.add('message-bubble', 'left-bubble', 'gray-bubble');
                    finalSystemMessage.innerHTML = `<span>다음 목차로 넘어갈까요?</span>`;
                    responseMessages.appendChild(finalSystemMessage);

                    const yesButton = document.createElement('button');
                    yesButton.classList.add('replay-button');
                    yesButton.textContent = '네';
                    yesButton.addEventListener('click', () => {
                        window.location.href = `/posts/6`;
                    });

                    responseMessages.appendChild(yesButton);
                }
            } catch (error) {
                resultMessage.innerHTML = `<span>다시 작성해주세요.</span>`;
            }
        }

        responseMessages.scrollTop = responseMessages.scrollHeight;
    }
});

// Function to initialize and handle voice recognition
function initializeVoiceRecognition() {
    const responseInput = document.getElementById('response-input');

    // Check for Web Speech API support
    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'ko-KR'; // Set the recognition language to Korean
        recognition.continuous = true; // Enable continuous recognition
        recognition.interimResults = true; // Enable interim results

        // Event handler for recognition results
        recognition.onresult = (event) => {
            let interimTranscript = '';
            responseInput.value = finalTranscript; // Set the input field to the final transcript initially

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            responseInput.value = finalTranscript + interimTranscript; // Update textarea with real-time results
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error); // Log recognition errors
        };

        recognition.onend = () => {
            recognizing = false; // Update recognition state
            document.getElementById('voice-status').style.display = 'none'; // Hide voice status message
            document.getElementById('recordButton').classList.remove('recording'); // Remove recording animation
            stopTimer(); // Stop the timer when recognition ends
        };
    }

    const recordButton = document.getElementById('recordButton');
    recordButton.addEventListener('click', toggleRecording);

    // Variables to manage timer
    let timerInterval;
    let startTime;

    // Function to toggle recording state
    function toggleRecording() {
        recognizing = !recognizing;
        if (recognizing) {
            startRecording();
        } else {
            stopRecording();
        }
    }

    // Function to start recording
    function startRecording() {
        document.getElementById('voice-status').style.display = 'block'; // Show voice status message
        recordButton.classList.add('recording'); // Add recording animation
        recognition.start(); // Start speech recognition
        startTimer(); // Start the timer when recording starts
    }

    // Function to stop recording
    function stopRecording() {
        document.getElementById('voice-status').style.display = 'none'; // Hide voice status message
        recordButton.classList.remove('recording'); // Remove recording animation
        recognition.stop(); // Stop speech recognition
        stopTimer(); // Stop the timer when recording stops
    }

    // Function to start the timer
    function startTimer() {
        startTime = Date.now(); // Record the start time
        updateTimer(); // Update the timer immediately
        timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timerInterval); // Clear the timer interval
        document.querySelector('.timer').textContent = '00:00'; // Reset the timer display
    }

    // Function to update the timer display
    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0'); // Calculate minutes
        const seconds = (elapsedTime % 60).toString().padStart(2, '0'); // Calculate seconds
        document.querySelector('.timer').textContent = `${minutes}:${seconds}`; // Update the timer display
    }
}

function speakText(text) {
    return new Promise((resolve) => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel(); // 기존 음성 합성을 취소
        }
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'ko-KR';
        speech.onend = resolve;
        window.speechSynthesis.speak(speech);
    });
}

function displayErrorMessage(message) {
    const responseMessages = document.querySelector('.response-messages');
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('message-bubble', 'left-bubble', 'gray-bubble');
    errorMessage.innerHTML = `<span>${message}</span>`;
    responseMessages.appendChild(errorMessage);
}

function addQuestionMessage(question) {
    const responseMessages = document.querySelector('.response-messages');
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');
    const questionMessage = document.createElement('div');
    questionMessage.classList.add('message-bubble', 'left-bubble', 'gray-bubble');
    questionMessage.innerHTML = `<span>${question}</span>`;
    questionContainer.appendChild(questionMessage);

    // 다시 들려줘 버튼 추가
    const replayBtn = document.createElement('button');
    replayBtn.classList.add('replay-button');
    replayBtn.textContent = '다시 들려줘';
    replayBtn.addEventListener('click', () => {
        speakText(question);
    });
    questionContainer.appendChild(replayBtn);

    responseMessages.appendChild(questionContainer);
}

function addReplayButton(text, container) {
    const replayBtn = document.createElement('button');
    replayBtn.classList.add('replay-button');
    replayBtn.textContent = '다시 들려줘';
    replayBtn.addEventListener('click', () => {
        speakText(text);
    });
    container.appendChild(replayBtn);
}

function isNumericString(data) {
    // 정규식을 사용하여 숫자열인지 확인
    const numericRegex = /^\d+$/;

    // 데이터가 문자열인지 확인하고, 숫자열인지 검사
    if (typeof data === 'string' && numericRegex.test(data)) {
        return true;
    }
    return false;
}