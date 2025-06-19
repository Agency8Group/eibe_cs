// 탭 전환 함수
function showTab(tabName) {
    // 모든 탭 콘텐츠 숨기기
    const tabContents = document.querySelectorAll('[id^="tab-"]');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    // 모든 탭 버튼 비활성화
    const tabButtons = document.querySelectorAll('[role="tab"]');
    tabButtons.forEach(button => {
        button.setAttribute('aria-selected', 'false');
        button.classList.remove('text-dreame-yellow', 'bg-black/30', 'border-b-2', 'border-indigo-500');
        button.classList.add('text-gray-300');
    });
    
    // 선택된 탭 콘텐츠 표시
    const selectedContent = document.getElementById(`tab-${tabName}`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
        selectedContent.classList.add('animate-fade-in');
    }
    
    // 선택된 탭 버튼 활성화
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.setAttribute('aria-selected', 'true');
        selectedButton.classList.remove('text-gray-300');
        selectedButton.classList.add('text-dreame-yellow', 'bg-black/30', 'border-b-2', 'border-indigo-500');
    }
    
    // URL 해시 업데이트 (선택사항)
    if (history.pushState) {
        history.pushState(null, null, `#${tabName}`);
    }
    
    // 모바일에서 탭 전환 시 스크롤 최적화
    if (isMobile) {
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    }
    
    // 헤더 타이틀 업데이트 (선택사항)
    updateHeaderTitle(tabName);
}

// 헤더 타이틀 업데이트
function updateHeaderTitle(tabName) {
    const titleMap = {
        'ai': '🤖 AI 비서',
        'promo': '📱 Dreame Manual',
        'notice': '📢 이벤트/참고자료',
        'edu': '📚 교육자료',
        'vacation': '🚧 Preparing...'
    };
    
    const headerTitle = document.querySelector('header h1');
    if (headerTitle && titleMap[tabName]) {
        // 부드러운 페이드 효과
        headerTitle.style.opacity = '0.5';
        setTimeout(() => {
            headerTitle.innerHTML = `<span class="bg-gradient-to-r from-dreame-yellow via-yellow-400 to-dreame-yellow bg-clip-text text-transparent">드리미 상담포털</span>`;
            headerTitle.style.opacity = '1';
        }, 150);
    }
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

// 알림 팝업 표시
function showNoticePopup() {
    const popup = document.getElementById("notice-popup");
    if (popup) {
        popup.classList.remove("hidden");
        popup.focus(); // 포커스 이동
    }
}

// 알림 팝업 닫기
function closeNoticePopup() {
    const popup = document.getElementById("notice-popup");
    if (popup) {
        popup.classList.add("hidden");
    }
}

// 메인으로 이동 함수
function goToForum() {
    // 현재 페이지가 이미 메인인 경우 아무것도 하지 않음
    if (window.location.pathname.includes('agentforum.html')) {
        return;
    }
    // 다른 페이지에서 메인으로 이동하는 경우
    window.location.href = './agentforum.html';
}

// 키보드 단축키 처리
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K: 검색창 포커스
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape: 팝업 닫기
    if (event.key === 'Escape') {
        const popup = document.getElementById('notice-popup');
        if (popup && !popup.classList.contains('hidden')) {
            closeNoticePopup();
        }
    }
}

// 모바일 환경 감지
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 모바일 최적화 설정
if (isMobile) {
    // 모바일에서 뷰포트 설정
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // 모바일에서 터치 이벤트 최적화
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
}

// PPT 뷰어 전환 함수
function switchPPTViewer(viewerType) {
    const pptViewer = document.getElementById('ppt-viewer');
    const baseUrl = '../education/상담교육자료.pdf';
    
    // 모든 버튼 스타일 초기화
    document.querySelectorAll('[id$="-viewer-btn"]').forEach(btn => {
        btn.className = 'px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors';
    });
    
    // 선택된 버튼 스타일 변경
    const selectedBtn = document.getElementById(`${viewerType}-viewer-btn`);
    if (selectedBtn) {
        selectedBtn.className = 'px-3 py-1 bg-dreame-yellow text-black rounded text-sm hover:bg-yellow-500 transition-colors';
    }
    
    // 뷰어 타입에 따라 URL 설정
    let viewerUrl = baseUrl;
    
    switch (viewerType) {
        case 'google':
            // Google Docs Viewer 사용
            viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + '/' + baseUrl)}&embedded=true`;
            break;
        case 'microsoft':
            // Microsoft Office Online Viewer 사용
            viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + '/' + baseUrl)}`;
            break;
        case 'native':
        default:
            // 기본 브라우저 뷰어 사용
            viewerUrl = baseUrl;
            break;
    }
    
    // iframe 소스 변경
    if (pptViewer) {
        pptViewer.src = viewerUrl;
        
        // 로딩 상태 표시
        pptViewer.style.opacity = '0.5';
        pptViewer.addEventListener('load', function() {
            pptViewer.style.opacity = '1';
        }, { once: true });
    }
    
    // 사용자 설정 저장 (선택사항)
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('preferredPPTViewer', viewerType);
    }
}

// 저장된 PPT 뷰어 설정 복원
function restorePPTViewerPreference() {
    if (typeof(Storage) !== "undefined") {
        const savedViewer = localStorage.getItem('preferredPPTViewer');
        if (savedViewer) {
            switchPPTViewer(savedViewer);
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('드리미 상담원 포털 로드됨');
    
    // 초기 탭 설정
    showTab('ai');
    
    // 검색 입력창 포커스
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.focus();
    }
    
    // 모바일에서 스크롤 최적화
    if (isMobile) {
        optimizeMobileScroll();
    }
    
    // 키보드 단축키 설정
    setupKeyboardShortcuts();
    
    // PDF 로딩 최적화
    optimizePDFLoading();
    
    // 저장된 PPT 뷰어 설정 복원
    restorePPTViewerPreference();
    
    // 헤더 애니메이션 시작
    setTimeout(() => {
        const header = document.querySelector('header');
        if (header) {
            header.style.opacity = '1';
        }
    }, 100);
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
    // 필요한 정리 작업이 있다면 여기에 추가
    console.log("페이지 언로드");
});

// 성능 모니터링 (개발용)
if (typeof performance !== 'undefined') {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`페이지 로드 시간: ${loadTime}ms`);
        }, 0);
    });
}

// 모바일 스크롤 최적화
function optimizeMobileScroll() {
    // iframe 내부 스크롤 최적화
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            try {
                // iframe 내부에 스크롤 최적화 스타일 적용
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    const style = iframeDoc.createElement('style');
                    style.textContent = `
                        body {
                            -webkit-overflow-scrolling: touch;
                            overscroll-behavior: contain;
                        }
                        * {
                            -webkit-tap-highlight-color: transparent;
                        }
                    `;
                    iframeDoc.head.appendChild(style);
                }
            } catch (e) {
                // CORS 정책으로 인해 접근할 수 없는 경우 무시
                console.log('iframe 최적화 스킵:', e.message);
            }
        });
    });
    
    // details 요소 터치 최적화
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
        const summary = detail.querySelector('summary');
        if (summary) {
            // 터치 이벤트로 details 토글
            summary.addEventListener('touchstart', function(e) {
                e.preventDefault();
                detail.toggleAttribute('open');
                
                // 모바일에서 부드러운 애니메이션
                if (detail.hasAttribute('open')) {
                    detail.style.transition = 'all 0.3s ease';
                }
            }, {passive: false});
        }
    });
}

// PDF 로딩 최적화
function optimizePDFLoading() {
    const pdfIframes = document.querySelectorAll('iframe[src*=".pdf"]');
    
    pdfIframes.forEach(iframe => {
        // 로딩 상태 표시
        const container = iframe.closest('.pdf-container');
        if (container) {
            container.style.position = 'relative';
            
            // 로딩 스피너 추가
            const spinner = document.createElement('div');
            spinner.className = 'pdf-loading-spinner';
            spinner.innerHTML = `
                <div class="spinner-border text-dreame-yellow" role="status">
                    <span class="sr-only">로딩중...</span>
                </div>
                <p class="text-sm text-gray-400 mt-2">PDF 로딩중...</p>
            `;
            spinner.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10;
                text-align: center;
            `;
            container.appendChild(spinner);
            
            // iframe 로드 완료 시 스피너 제거
            iframe.addEventListener('load', function() {
                spinner.remove();
                iframe.style.opacity = '1';
            });
            
            // 초기 투명도 설정
            iframe.style.opacity = '0';
            iframe.style.transition = 'opacity 0.3s ease';
        }
    });
}

// 키보드 단축키 설정
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K: 검색창 포커스
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // ESC: 검색창 초기화
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('search-input');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.value = '';
                filterContent();
                searchInput.blur();
            }
        }
        
        // 숫자 키로 탭 전환 (1-5)
        if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey) {
            const tabs = ['ai', 'promo', 'notice', 'edu', 'vacation'];
            const tabIndex = parseInt(e.key) - 1;
            if (tabs[tabIndex]) {
                showTab(tabs[tabIndex]);
            }
        }
    });
}

// 텍스트 하이라이트 함수
function highlightText(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<mark class="bg-dreame-yellow text-black px-1 rounded">$1</mark>');
}

// 검색어 초기화
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        filterContent();
        
        // 하이라이트 제거
        const marks = document.querySelectorAll('mark');
        marks.forEach(mark => {
            const parent = mark.parentNode;
            parent.textContent = parent.textContent;
        });
    }
}

// 포럼으로 이동
function goToForum() {
    // 현재 페이지가 이미 포럼이므로 새로고침
    location.reload();
}

// 페이지 로드 시 공지사항 팝업 표시 (선택사항)
window.addEventListener('load', function() {
    // 개발 환경에서만 공지사항 표시
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const popup = document.getElementById('notice-popup');
        if (popup) {
            setTimeout(() => {
                popup.classList.remove('hidden');
            }, 1000);
        }
    }
});

// 네트워크 상태 감지
window.addEventListener('online', function() {
    console.log('네트워크 연결됨');
});

window.addEventListener('offline', function() {
    console.log('네트워크 연결 끊어짐');
});

// 성능 모니터링
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('페이지 로드 시간:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}