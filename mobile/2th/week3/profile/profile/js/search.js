// search.js - Xử lý tìm kiếm và gợi ý từ khóa thông minh
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsBox = document.getElementById('searchSuggestions');

    // Dữ liệu ánh xạ từ khóa với các trang trong website
    const searchMap = [
        { keywords: ['소개', '인사말', '비전', 'about', 'intro'], url: 'index.html' },
        { keywords: ['인적', '기본 정보', '학력 사항', 'personal'], url: 'personal.html' },
        { keywords: ['학술', '논문', '연구 프로젝트', 'academic'], url: 'academic.html' },
        { keywords: ['경력', '회사 경력', '자격증', 'career'], url: 'career.html' },
        { keywords: ['아이디어', '프로젝트 제안', '연구 노트', 'idea'], url: 'idea.html' },
        { keywords: ['연락처', '이메일', 'sns 링크', 'contact', 'sns'], url: 'SNS.html' },
        { keywords: ['위치', '오시는 길', '캠퍼스 맵', 'map'], url: 'map.html' }
    ];

    const nameMap = {
        'index.html': '소개 (인사말 / 비전)',
        'personal.html': '인적 (기본 정보 / 학력 사항)',
        'academic.html': '학술 (논문 / 연구 프로젝트)',
        'career.html': '경력 (회사 경력 / 자격증)',
        'idea.html': '아이디어 (프로젝트 제안 / 연구 노트)',
        'SNS.html': '연락처 (이메일 / SNS 링크)',
        'map.html': '위치 (오시는 길 / 캠퍼스 맵)'
    };

    function performSearch(query) {
        query = query.trim().toLowerCase();
        if (!query) return;
        
        for (let item of searchMap) {
            for (let kw of item.keywords) {
                if (kw.toLowerCase().includes(query) || query.includes(kw.toLowerCase())) {
                    window.location.href = item.url;
                    return;
                }
            }
        }
        alert('검색 결과가 없습니다: ' + query);
    }

    if (searchInput && searchBtn) {
        // Hiển thị gợi ý khi nhập từ khóa
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            suggestionsBox.innerHTML = '';
            
            if (!query) {
                suggestionsBox.style.display = 'none';
                return;
            }

            let matches = [];
            searchMap.forEach(item => {
                item.keywords.forEach(kw => {
                    if (kw.toLowerCase().includes(query)) {
                        if (!matches.includes(item.url)) {
                            matches.push(item.url);
                        }
                    }
                });
            });

            if (matches.length > 0) {
                matches.forEach(url => {
                    const aEl = document.createElement('a');
                    aEl.href = url;
                    aEl.textContent = nameMap[url] || url;
                    suggestionsBox.appendChild(aEl);
                });
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        });

        // Bấm nút kính lúp để tìm kiếm
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });

        // Nhấn phím Enter để tìm kiếm
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });

        // Ẩn bảng gợi ý khi nhấp chuột ra ngoài
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });
    }
});