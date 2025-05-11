// 기존 기능들
function showTab(tab) {
    document
        .querySelectorAll("section")
        .forEach((el) => el.classList.add("hidden"));
    document
        .getElementById("tab-" + tab)
        .classList.remove("hidden");
}

function normalize(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, "") // 공백 제거
        .replace(/[^a-z0-9가-힣]/g, ""); // 특수문자 제거
}

function filterContent() {
    const rawQuery = document.getElementById("search-input").value;
    const query = normalize(rawQuery);

    document.querySelectorAll("section").forEach((section) => {
        section.classList.remove("hidden");

        const detailsList = section.querySelectorAll("details");
        let hasMatch = false;

        detailsList.forEach((detail) => {
            const text = normalize(detail.textContent);
            const isMatch = text.includes(query);
            detail.classList.toggle("hidden", !isMatch);
            if (isMatch) hasMatch = true;
        });

        if (!hasMatch) section.classList.add("hidden");
    });
}

function toggleTheme() {
    document.documentElement.classList.toggle("dark");
}

function showNoticePopup() {
    document
        .getElementById("notice-popup")
        .classList.remove("hidden");
}

function closeNoticePopup() {
    document.getElementById("notice-popup").classList.add("hidden");
}

// 추론 반응값 숫자 동적 변화
let baseValue = 5700;

function updateInferenceValue() {
    const fluctuation = Math.floor(Math.random() * 100) - 50; // -50~+50
    const newValue = baseValue + fluctuation;

    const target = document.getElementById("inferenceValue");
    if (target) {
        target.textContent = newValue.toLocaleString(); // 쉼표 찍어서 보기 좋게
        target.style.transform = "scale(1.1)";
        target.style.transition = "transform 0.2s ease";

        setTimeout(() => {
            target.style.transform = "scale(1)";
        }, 200);
    }
}

setInterval(updateInferenceValue, 1200); // 조금 더 부드럽게

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById("clock").textContent = timeString;
}

// 시계를 1초마다 갱신
setInterval(updateClock, 1000);

// 로컬 스토리지에서 할 일 리스트를 불러오는 함수 todo list 
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const list = document.getElementById("todo-list");
    list.innerHTML = ''; // 기존 리스트를 지우고 새로 추가

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded shadow";
        li.innerHTML = `
            <span class="flex-1 break-all">${todo.text}</span>
            <button onclick="deleteTodo(${todo.id})" class="ml-4 text-red-500 hover:text-red-700 font-bold">삭제</button>
        `;
        list.appendChild(li);
    });
}

// 할 일을 추가하는 함수 (이제 엔터키로만 추가됨)
function addTodo(event) {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (text === "") return;

    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const newTodo = {
        id: Date.now(), // 고유한 id로 사용할 타임스탬프
        text: text
    };

    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos)); // 로컬 스토리지에 저장

    loadTodos(); // 새로고침된 리스트 로드
    input.value = ""; // 입력창 초기화
}

// 할 일을 삭제하는 함수
function deleteTodo(id) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos)); // 로컬 스토리지에 저장

    loadTodos(); // 리스트 새로 고침
}

// 엔터키로 할 일을 추가하는 기능 추가
document.getElementById("todo-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTodo(event); // 엔터키를 눌렀을 때만 addTodo 호출
    }
});

// 페이지가 로드될 때 실행되는 함수
window.onload = function () {
    showTab("ai");
    showNoticePopup();
    loadTodos(); // 페이지 로드 시 To-do 리스트를 불러옵니다.
};

document.addEventListener("DOMContentLoaded", function () {
    showTab("ai");
    loadTodos();
});

// 드래그 기능
const todoBox = document.getElementById("global-todo");
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

todoBox.style.position = 'fixed';

todoBox.addEventListener("mousedown", function (e) {
    isDragging = true;
    offsetX = e.clientX - todoBox.offsetLeft;
    offsetY = e.clientY - todoBox.offsetTop;
    todoBox.style.transition = "none";
});

document.addEventListener("mousemove", function (e) {
    if (isDragging) {
        todoBox.style.left = `${e.clientX - offsetX}px`;
        todoBox.style.top = `${e.clientY - offsetY}px`;
        todoBox.style.right = "auto";
    }
});

document.addEventListener("mouseup", function () {
    isDragging = false;
});

// api키 받는 2안 
async function callOpenAI() {
    const userInput = document.getElementById("userInput").value;

    if (!userInput.trim()) {
        alert("질문을 입력해주세요.");
        return;
    }
const apiKey = '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';  // 여기서 YOUR_API_KEY는 발급받은 API 키로 교체하세요.
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
           
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userInput }]
            })
        });

        if (!response.ok) {
            // 응답이 실패한 경우 처리
            const errorData = await response.json();
            console.error("API 호출 실패:", errorData);
            document.getElementById("responseOutput").textContent = `⚠️ 오류: ${errorData.error.message || '응답 실패'}`;
            return;
        }

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content || "❌ 응답이 없습니다.";

        // 마크다운 파싱 및 HTML 렌더링
        document.getElementById("responseOutput").innerHTML = marked.parse(result);

        // 코드블록 하이라이트 적용
        document.querySelectorAll('#responseOutput pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } catch (error) {
        console.error("OpenAI 호출 오류:", error);
        document.getElementById("responseOutput").textContent = "⚠️ 오류: 응답 실패.";
    }
}

// 엔터키로 질문 전송 (Shift + Enter는 줄바꿈)
document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        callOpenAI();
    }
});
