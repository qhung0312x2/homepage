(() => {
    // Thay đổi link nhạc piano tại đây
    const audio = new Audio('music/xoso.mp3'); 
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0.3;

    const player = document.createElement('aside');
    player.className = 'music-player';
    player.setAttribute('aria-label', '배경 음악 플레이어');

    const copy = document.createElement('div');
    copy.className = 'music-player-copy';

    const title = document.createElement('span');
    title.className = 'music-player-title';
    title.textContent = '피아노 배경 음악'; // Đổi tên hiển thị thành nhạc piano

    const status = document.createElement('span');
    status.className = 'music-player-status';
    status.textContent = '클릭하여 재생';

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '▶'; // Hình tam giác khi dừng
    button.setAttribute('aria-label', '배경 음악 재생');
    button.title = '배경 음악 재생';

    copy.append(title, status);
    player.append(copy, button);
    document.body.append(player);

    const updatePlayer = (playing) => {
        button.textContent = playing ? 'Ⅱ' : '▶'; // Ⅱ (2 gạch) khi đang phát, ▶ khi dừng
        button.setAttribute('aria-label', playing ? '배경 음악 일시 정지' : '배경 음악 재생');
        button.title = playing ? '배경 음악 일시 정지' : '배경 음악 재생';
        status.textContent = playing ? '재생 중' : '일시정지됨';
    };

    button.addEventListener('click', async () => {
        if (audio.paused) {
            try {
                await audio.play();
                updatePlayer(true);
            } catch {
                status.textContent = '재생 실패';
            }
        } else {
            audio.pause();
            updatePlayer(false);
        }
    });

    audio.addEventListener('play', () => updatePlayer(true));
    audio.addEventListener('pause', () => updatePlayer(false));
    audio.addEventListener('error', () => {
        status.textContent = '파일 오류';
    });

    // Tự động phát (nếu trình duyệt cho phép)
    audio.play().then(() => {
        updatePlayer(true);
    }).catch(() => {
        updatePlayer(false);
    });
})();