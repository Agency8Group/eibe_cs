document
.getElementById("loginForm")
.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");
    const container = document.getElementById("container");
    const footer = document.getElementById("footer");

    container.style.animation = "fadeOut 1s forwards";
    footer.classList.add("footer-fade-out");

    setTimeout(function () {
        const validUsername = "eibe05";
        const validPassword = "202505";

        if (
            username === validUsername &&
            password === validPassword
        ) {
            window.location.href =
                "./agentforum/agentforum.html";
        } else {
            errorMsg.style.display = "block";
            container.style.animation = ""; // 애니메이션 초기화
            footer.classList.remove("footer-fade-out");
        }
    }, 1000);
});

// 보안

   function login() {
            // 로그인 버튼 클릭 시 로컬 스토리지에 'loggedIn' 값을 true로 저장
            localStorage.setItem('loggedIn', 'true');
            // 로그인 후 바로 agentforum으로 이동
            window.location.href = "agentforum/agentforum.html";
        }