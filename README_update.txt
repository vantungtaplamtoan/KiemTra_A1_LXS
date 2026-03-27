Các thay đổi đã thêm trong bản demo này:

1. Phần xem lại bài làm có thêm:
- Xem lời giải
- Báo cáo câu hỏi

2. Mỗi phiên đăng nhập có thể làm đề mới.
- Hệ thống sẽ tránh lặp lại câu đã ra trước đó theo từng level.
- Khi hết câu ở level đó thì mới mở lại toàn bộ câu của level đó.

3. Có bộ đếm thời gian.
- Hết giờ sẽ tự nộp bài.
- Đang làm bài mà reload trang sẽ có cảnh báo.

4. Cấu hình báo cáo tự động qua Gmail bằng Apps Script:
- Mở file apps-script/code.gs
- Dán vào dự án Apps Script của bạn
- Deploy dưới dạng Web App
- Chọn Execute as: Me
- Chọn Who has access: Anyone
- Copy URL Web App
- Dán URL đó vào APP_CONFIG.REPORT_WEB_APP_URL trong js/config.js

5. Thêm lời giải vào ngân hàng câu hỏi theo mẫu:
{
  id: "L1_001",
  question: `...`,
  options: [`...`, `...`, `...`, `...`, `...`],
  correctAnswer: 4,
  solution: `
    Dùng công thức:
    $$P(A \cup B)=P(A)+P(B)-P(A\cap B).$$
    Vì vậy đáp án đúng là E.
  `
}

Lưu ý:
- Nếu chưa cấu hình REPORT_WEB_APP_URL, nút Báo cáo sẽ mở email soạn sẵn thay vì gửi tự động.
- questions.js hiện chưa được điền sẵn trường solution cho từng câu; bạn thêm dần theo nhu cầu.
