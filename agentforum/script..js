// 탭 전환 함수
function showTab(tab) {
    // 모든 섹션을 숨김 처리
    document
        .querySelectorAll("section")
        .forEach((el) => el.classList.add("hidden"));

    // 해당 탭만 보이도록 처리
    document
        .getElementById("tab-" + tab)
        .classList.remove("hidden");
}

// 입력된 텍스트 정규화 함수 (소문자화, 공백 제거, 특수 문자 제거)
function normalize(text) {
    return text
        .toLowerCase() // 소문자로 변환
        .replace(/\s+/g, "") // 모든 공백 제거
        .replace(/[^a-z0-9가-힣]/g, ""); // 특수문자 제거
}

// 검색어를 이용하여 콘텐츠 필터링
function filterContent() {
    const rawQuery = document.getElementById("search-input").value; // 입력된 검색어 가져오기
    const query = normalize(rawQuery); // 정규화 처리

    // 모든 섹션을 순회하면서 필터링
    document.querySelectorAll("section").forEach((section) => {
        section.classList.remove("hidden"); // 우선 모든 섹션을 보이게 설정

        const detailsList = section.querySelectorAll("details"); // 섹션 내 details 요소들 가져오기
        let hasMatch = false; // 해당 섹션 내에서 일치하는 항목이 있는지 체크

        detailsList.forEach((detail) => {
            const text = normalize(detail.textContent); // detail의 텍스트 정규화
            const isMatch = text.includes(query); // 검색어와 일치하는지 확인
            detail.classList.toggle("hidden", !isMatch); // 일치하지 않으면 숨김 처리
            if (isMatch) hasMatch = true; // 일치하는 항목이 있으면 hasMatch를 true로 설정
        });

        // 일치하는 항목이 없다면 해당 섹션 숨기기
        if (!hasMatch) section.classList.add("hidden");
    });
}

// 다크모드와 라이트모드 전환
function toggleTheme() {
    document.documentElement.classList.toggle("dark");
}

// 알림 팝업 표시
function showNoticePopup() {
    document
        .getElementById("notice-popup")
        .classList.remove("hidden");
}

// 알림 팝업 닫기
function closeNoticePopup() {
    document.getElementById("notice-popup").classList.add("hidden");
}

// 추론 값 동적 변화 (랜덤 변화)
let baseValue = 5700;

function updateInferenceValue() {
    const fluctuation = Math.floor(Math.random() * 100) - 50; // -50 ~ +50 사이의 변동
    const newValue = baseValue + fluctuation;

    const target = document.getElementById("inferenceValue");
    if (target) {
        // 값 표시 및 애니메이션 효과
        target.textContent = newValue.toLocaleString(); // 쉼표 추가해서 보기 좋게
        target.style.transform = "scale(1.1)";
        target.style.transition = "transform 0.2s ease";

        setTimeout(() => {
            target.style.transform = "scale(1)";
        }, 200);
    }
}

// 1.2초마다 추론 값 업데이트
setInterval(updateInferenceValue, 1200);

// 시계 업데이트 (현재 시간 표시)
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById("clock").textContent = timeString; // 시계 업데이트
}

// 1초마다 시계 업데이트
setInterval(updateClock, 1000);

// 할 일 목록 관련 함수들
function hideTodo() {
    document.getElementById('global-todo').style.display = 'none'; // 할 일 목록 숨기기
}

// 로컬스토리지에서 할 일 목록 불러오기
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || []; // 로컬스토리지에서 할 일 목록 불러오기
    const list = document.getElementById("todo-list");
    list.innerHTML = ''; // 목록 초기화

    todos.forEach(todo => {
        // 각 할 일 항목을 HTML로 추가
        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded shadow";
        li.innerHTML = `
            <span class="flex-1 break-all">${todo.text}</span>
            <button onclick="deleteTodo(${todo.id})" class="ml-4 text-red-500 hover:text-red-700 font-bold">삭제</button>
        `;
        list.appendChild(li);
    });
}

// 새 할 일 추가
function addTodo(event) {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (text === "") return; // 입력 값이 비었으면 추가하지 않음

    const todos = JSON.parse(localStorage.getItem('todos')) || []; // 로컬스토리지에서 할 일 목록 가져오기
    const newTodo = {
        id: Date.now(), // 고유한 ID 생성
        text: text
    };

    todos.push(newTodo); // 새로운 할 일 추가
    localStorage.setItem('todos', JSON.stringify(todos)); // 로컬스토리지에 저장
    loadTodos(); // 할 일 목록 갱신
    input.value = ""; // 입력 필드 초기화
}

// 할 일 삭제
function deleteTodo(id) {
    let todos = JSON.parse(localStorage.getItem('todos')) || []; // 로컬스토리지에서 할 일 목록 가져오기
    todos = todos.filter(todo => todo.id !== id); // 해당 ID의 할 일 삭제
    localStorage.setItem('todos', JSON.stringify(todos)); // 로컬스토리지에 수정된 목록 저장
    loadTodos(); // 할 일 목록 갱신
}

// 할 일 입력 필드에서 Enter 키 누르면 추가
document.getElementById("todo-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTodo(event); // Enter 키 누르면 할 일 추가
    }
});

// 할 일 목록 드래그 기능
const todoBox = document.getElementById("global-todo");
let isDragging = false; // 드래그 상태 확인
let offsetX = 0;
let offsetY = 0;

todoBox.style.position = 'fixed'; // 고정된 위치로 설정

todoBox.addEventListener("mousedown", function (e) {
    isDragging = true;
    offsetX = e.clientX - todoBox.offsetLeft;
    offsetY = e.clientY - todoBox.offsetTop;
    todoBox.style.transition = "none"; // 드래그 시 애니메이션 비활성화
});

document.addEventListener("mousemove", function (e) {
    if (isDragging) {
        todoBox.style.left = `${e.clientX - offsetX}px`; // 마우스 위치에 따라 좌측 이동
        todoBox.style.top = `${e.clientY - offsetY}px`; // 마우스 위치에 따라 상단 이동
        todoBox.style.right = "auto";
    }
});

document.addEventListener("mouseup", function () {
    isDragging = false; // 마우스를 놓으면 드래그 종료
});

// OpenAI API 호출 함수
async function callOpenAI() {
    const userInput = document.getElementById("userInput").value; // 사용자 입력 가져오기

    if (!userInput.trim()) {
        alert("질문을 입력해주세요.");
        return;
    }

    const apiKey = 'sk-proj-...'; // 실제 API 키는 보안을 위해 숨김 처리

    try {
        // OpenAI API에 POST 요청 보내기
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}` // API 키를 인증 헤더에 포함
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userInput }] // 사용자 입력 전송
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API 호출 실패:", errorData);
            document.getElementById("responseOutput").textContent = `⚠️ 오류: ${errorData.error.message || '응답 실패'}`;
            return;
        }

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content || "❌ 응답이 없습니다."; // 응답 데이터 처리
        document.getElementById("responseOutput").innerHTML = marked.parse(result);

        // 코드 블록 하이라이트 처리
        document.querySelectorAll('#responseOutput pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } catch (error) {
        console.error("OpenAI 호출 오류:", error);
        document.getElementById("responseOutput").textContent = "⚠️ 오류: 응답 실패.";
    }
}

// 사용자가 입력하고 Enter 키를 누르면 OpenAI 호출
document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        callOpenAI();
    }
});

// 초기화 및 로딩
document.addEventListener("DOMContentLoaded", function () {
    try {
        const isLoggedIn = localStorage.getItem('loggedIn');
        console.log("loggedIn =", isLoggedIn);

        // 로그인 체크
        if (isLoggedIn !== 'true') {
            alert("로그인이 필요합니다.");
            window.location.href = "../index.html"; // 로그인 페이지로 리다이렉트
            return;
        }

        // 초기 설정
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
