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


// n: FAQ 개수

// log
// ⁡
// (
// 𝑛
// )
// log(n): FAQ 수가 많아질수록 조합 수 증가율이 완만해지는 걸 반영

// 𝑎
// a: 경험적 조정 계수 (데이터 기반 튜닝 필요)

// ✅ 실제 값으로 보정해보면:
// 기존 기준:
// 189개 → 5,700개 조합

// 5,700
// =
// 𝑎
// ⋅
// 189
// ⋅
// log
// ⁡
// (
// 189
// )
// ⇒
// 𝑎
// ≈
// 5700
// 189
// ⋅
// log
// ⁡
// (
// 189
// )
// ≈
// 5700
// 189
// ⋅
// 5.24
// ≈
// 5700
// 990
// ≈
// 5.75
// 5,700=a⋅189⋅log(189)⇒a≈ 
// 189⋅log(189)
// 5700
// ​
//  ≈ 
// 189⋅5.24
// 5700
// ​
//  ≈ 
// 990
// 5700
// ​
//  ≈5.75
// 🎯 최종 근사 수식
// 예상 조합 수
// ≈
// 5.75
// ⋅
// 𝑛
// ⋅
// log
// ⁡
// (
// 𝑛
// )
// 예상 조합 수≈5.75⋅n⋅log(n)
// 예시 비교
// FAQ 수 (n)	예측 조합 수
// 100	5.75 × 100 × log(100) = 5.75 × 100 × 4.61 ≈ 2,650
// 157	5.75 × 157 × log(157) ≈ 5.75 × 157 × 5.05 ≈ 4,555
// 189	≈ 5,700 (검증값과 거의 일치)
// 250	5.75 × 250 × log(250) ≈ 5.75 × 250 × 5.52 ≈ 7,900

// 추론 값 동적 변화 (랜덤 변화)

// pdf 파일하나당 평균 25개 추출

let baseValue = 14170;

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

// 첫화면 이동 
   function goToForum() {
        window.location.href = 'agentforum.html';
    }