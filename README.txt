Các thay đổi đã thêm trong bản demo này:
1. Xem lời giải ở màn hình review.
2. Báo cáo câu hỏi qua Apps Script/Gmail.
3. Làm đề mới trong cùng phiên đăng nhập và tránh lặp câu cũ theo từng level cho đến khi cạn kho.
4. Đồng hồ đếm ngược và tự nộp bài khi hết giờ.

Cần cấu hình thêm:
- Mở js/config.js và điền APP_CONFIG.REPORT_ENDPOINT bằng URL Web App Apps Script nếu muốn gửi báo cáo tự động.
- Nếu chưa điền REPORT_ENDPOINT, nút Báo cáo sẽ fallback sang mailto để mở email nháp.
- Cập nhật trường solution trong js/questions.js bằng lời giải thật của bạn.
