// Lấy tất cả các phần tử có class là 'link-btn'
const linkButtons = document.querySelectorAll('.link-btn');

linkButtons.forEach(button => {
    // Lưu lại nội dung tiếng Anh ban đầu
    const originalText = button.innerHTML;
    // Lấy nội dung tiếng Hàn từ thuộc tính data-ko đã thêm trong HTML
    const koreanText = button.getAttribute('data-ko');

    // Khi đưa chuột vào (mouseenter)
    button.addEventListener('mouseenter', function() {
        // Đổi màu sắc
        this.style.backgroundColor = '#215b16'; // Màu nền xanh đậm
        this.style.color = '#ffffff';         // Màu chữ trắng
        this.style.borderColor = '#215b16';
        this.style.transition = 'all 0.3s ease';
        
        // Đổi chữ tiếng Anh sang tiếng Hàn
        if (koreanText) {
            this.innerHTML = koreanText;
        }
    });

    // Khi đưa chuột ra ngoài (mouseleave)
    button.addEventListener('mouseleave', function() {
        // Trả lại màu sắc ban đầu
        this.style.backgroundColor = '';
        this.style.color = '';
        this.style.borderColor = '';
        
        // Trả lại chữ tiếng Anh ban đầu
        this.innerHTML = originalText;
    });
});