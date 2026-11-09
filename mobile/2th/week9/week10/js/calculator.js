const display = document.getElementById("display"); // Lấy màn hình hiển thị.
    const keypad = document.getElementById("keypad"); // Lấy khu vực chứa các nút.
    let currentInput = "0"; // Lưu số đang được nhập.
    let previousNumber = null; // Lưu số thứ nhất của phép tính.
    let selectedOperator = null; // Lưu phép tính đã chọn.
    let waitingForNextNumber = false; // Kiểm tra có đang chờ số tiếp theo không.
    let lastCalculation = null; // Lưu phép tính gần nhất để hiển thị sau khi tính xong.
    const koreanDigits = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"]; // Lưu cách đọc số bằng tiếng Hàn.
    // Đọc chữ số được nhấn bằng giọng tiếng Hàn của trình duyệt.
    function playDigitSound(digit) { // Bắt đầu hàm đọc số bằng tiếng Hàn.
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return; // Bỏ qua nếu trình duyệt không hỗ trợ đọc văn bản.
      window.speechSynthesis.cancel(); // Dừng âm đọc trước để các lần nhấn không bị chồng lên nhau.
      const utterance = new SpeechSynthesisUtterance(koreanDigits[Number(digit)]); // Tạo câu đọc cho chữ số được nhấn.
      utterance.lang = "ko-KR"; // Chọn ngôn ngữ tiếng Hàn.
      window.speechSynthesis.speak(utterance); // Phát giọng đọc qua loa thiết bị.
    } // Kết thúc hàm phát âm thanh cho chữ số.
    // Chuyển ký hiệu phép tính thành ký hiệu dễ đọc trên màn hình.
    function getOperatorSymbol(operator) { // Bắt đầu hàm lấy ký hiệu phép tính.
      return { "+": "+", "-": "−", "*": "×", "/": "÷" }[operator]; // Trả về ký hiệu phù hợp.
    } // Kết thúc hàm lấy ký hiệu phép tính.
    // Hiển thị số, phép tính đang nhập hoặc kết quả gần nhất.
    function renderDisplay() { // Bắt đầu hàm cập nhật màn hình.
      if (lastCalculation !== null) { // Kiểm tra đã có phép tính hoàn tất cần hiển thị không.
        display.value = lastCalculation; // Hiển thị phép tính cùng kết quả.
      } else if (selectedOperator !== null) { // Kiểm tra người dùng đã chọn phép tính chưa.
        const expression = `${previousNumber} ${getOperatorSymbol(selectedOperator)}`; // Tạo phần đầu của phép tính.
        display.value = waitingForNextNumber ? expression : `${expression} ${currentInput}`; // Hiển thị số và phép tính cùng nhau.
      } else { // Xử lý khi chưa chọn phép tính.
        display.value = currentInput; // Hiển thị số hiện tại.
      } // Kết thúc các trường hợp hiển thị.
    } // Kết thúc hàm cập nhật màn hình.
    // Đặt máy tính về trạng thái ban đầu.
    function clearCalculator() { // Bắt đầu hàm xóa.
      currentInput = "0"; // Đặt số hiện tại về 0.
      previousNumber = null; // Xóa số thứ nhất.
      selectedOperator = null; // Xóa phép tính đã chọn.
      waitingForNextNumber = false; // Ngừng chờ số tiếp theo.
      lastCalculation = null; // Xóa phép tính gần nhất.
      renderDisplay(); // Cập nhật màn hình sau khi xóa.
    } // Kết thúc hàm xóa.
    // Thêm một chữ số vào số đang nhập.
    function enterDigit(digit) { // Bắt đầu hàm nhập số.
      if (currentInput === "Lỗi" || waitingForNextNumber) { // Kiểm tra cần bắt đầu nhập số mới không.
        currentInput = digit; // Bắt đầu số mới.
        waitingForNextNumber = false; // Đã bắt đầu nhập số tiếp theo.
        lastCalculation = null; // Ẩn phép tính cũ khi bắt đầu nhập số mới.
      } else if (currentInput === "0") { // Kiểm tra màn hình chỉ có số 0.
        currentInput = digit; // Thay số 0 bằng chữ số mới.
      } else { // Xử lý số đã có nhiều chữ số.
        currentInput += digit; // Nối thêm chữ số mới.
      } // Kết thúc kiểm tra cách nhập số.
      renderDisplay(); // Cập nhật màn hình sau khi nhập.
    } // Kết thúc hàm nhập số.
    // Tính kết quả của hai số đã nhập.
    function calculateResult() { // Bắt đầu hàm tính kết quả.
      if (selectedOperator === null || previousNumber === null || waitingForNextNumber) return; // Dừng nếu chưa đủ dữ liệu.
      const nextNumber = Number(currentInput); // Chuyển số hiện tại thành số để tính.
      let result; // Khai báo biến lưu kết quả.
      switch (selectedOperator) { // Chọn cách tính theo phép tính đã chọn.
        case "+": result = previousNumber + nextNumber; break; // Cộng hai số.
        case "-": result = previousNumber - nextNumber; break; // Trừ hai số.
        case "*": result = previousNumber * nextNumber; break; // Nhân hai số.
        case "/": result = previousNumber / nextNumber; break; // Chia hai số.
      } // Kết thúc phần chọn phép tính.
      const calculation = `${previousNumber} ${getOperatorSymbol(selectedOperator)} ${nextNumber}`; // Lưu phép tính để hiển thị cùng kết quả.
      currentInput = selectedOperator === "/" && nextNumber === 0 ? "Lỗi" : String(result); // Hiển thị lỗi khi chia cho 0, nếu không thì hiển thị kết quả.
      lastCalculation = `${calculation} = ${currentInput}`; // Ghép phép tính với kết quả.
      previousNumber = null; // Xóa số thứ nhất sau khi tính.
      selectedOperator = null; // Xóa phép tính sau khi tính.
      waitingForNextNumber = true; // Chuẩn bị cho phép tính hoặc số mới.
      renderDisplay(); // Hiển thị kết quả.
    } // Kết thúc hàm tính kết quả.
    // Chọn phép tính và lưu số thứ nhất.
    function chooseOperator(operator) { // Bắt đầu hàm chọn phép tính.
      if (currentInput === "Lỗi") clearCalculator(); // Đặt lại máy tính nếu màn hình đang báo lỗi.
      if (selectedOperator !== null && !waitingForNextNumber) calculateResult(); // Tính trước nếu phép tính đang nối tiếp.
      previousNumber = Number(currentInput); // Lưu số đang hiển thị làm số thứ nhất.
      selectedOperator = operator; // Lưu phép tính được chọn.
      waitingForNextNumber = true; // Chờ nhập số thứ hai.
      lastCalculation = null; // Xóa phép tính cũ khi bắt đầu phép tính mới.
      renderDisplay(); // Hiển thị số thứ nhất cùng phép tính đã chọn.
    } // Kết thúc hàm chọn phép tính.
    // Xử lý mọi lần nhấn nút trong khu vực bàn phím.
    keypad.addEventListener("click", (event) => { // Bắt đầu xử lý sự kiện nhấn nút.
      const button = event.target.closest("button"); // Tìm nút được nhấn.
      if (!button) return; // Dừng nếu không nhấn vào nút.
      if (button.dataset.digit !== undefined) { // Kiểm tra có nhấn nút chữ số không.
        playDigitSound(button.dataset.digit); // Phát âm riêng cho chữ số được nhấn.
        enterDigit(button.dataset.digit); // Nhập chữ số vào máy tính.
      } // Kết thúc xử lý nút chữ số.
      else if (button.dataset.operator) chooseOperator(button.dataset.operator); // Chọn phép tính nếu nhấn nút phép tính.
      else if (button.dataset.action === "calculate") calculateResult(); // Tính kết quả nếu nhấn nút bằng.
      else if (button.dataset.action === "clear") clearCalculator(); // Xóa nếu nhấn CLEAR.
    }); // Kết thúc xử lý sự kiện nhấn nút.