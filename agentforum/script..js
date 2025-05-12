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

setInterval(updateInferenceValue, 1200);

// 시계 업데이트
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById("clock").textContent = timeString;
}
setInterval(updateClock, 1000);

// todo list 관련 함수들
function hideTodo() {
    document.getElementById('global-todo').style.display = 'none';
}


function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const list = document.getElementById("todo-list");
    list.innerHTML = '';

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

function addTodo(event) {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (text === "") return;

    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const newTodo = {
        id: Date.now(),
        text: text
    };

    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
    input.value = "";
}

function deleteTodo(id) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
}

document.getElementById("todo-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTodo(event);
    }
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

// OpenAI API 호출
async function callOpenAI() {
    const userInput = document.getElementById("userInput").value;

    if (!userInput.trim()) {
        alert("질문을 입력해주세요.");
        return;
    }

    const apiKey = 'sk-proj-...'; // 보안을 위해 실제 키는 노출 X

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userInput }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API 호출 실패:", errorData);
            document.getElementById("responseOutput").textContent = `⚠️ 오류: ${errorData.error.message || '응답 실패'}`;
            return;
        }

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content || "❌ 응답이 없습니다.";
        document.getElementById("responseOutput").innerHTML = marked.parse(result);

        document.querySelectorAll('#responseOutput pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } catch (error) {
        console.error("OpenAI 호출 오류:", error);
        document.getElementById("responseOutput").textContent = "⚠️ 오류: 응답 실패.";
    }
}

document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        callOpenAI();
    }
});

// ✅ 모든 초기화는 여기서
document.addEventListener("DOMContentLoaded", function () {
    try {
        const isLoggedIn = localStorage.getItem('loggedIn');
        console.log("loggedIn =", isLoggedIn);

        if (isLoggedIn !== 'true') {
            alert("로그인이 필요합니다.");
            window.location.href = "../index.html";
            return;
        }

        showTab("ai");
        showNoticePopup();
        loadTodos();
        updateClock();
        updateInferenceValue();
    } catch (e) {
        alert("로컬 스토리지 접근 오류 발생");
        console.error(e);
    }
});