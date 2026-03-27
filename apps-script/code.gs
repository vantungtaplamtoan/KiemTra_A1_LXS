const REPORT_RECEIVER_EMAIL = 'loctung126@gmail.com';

function doGet() {
  return ContentService
    .createTextOutput('Report service is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = e && e.parameter ? e.parameter : {};

    const subject = `[Báo cáo câu hỏi] ${data.questionId || '?'} - Lý thuyết xác suất`;

    const body = [
      'Hệ thống nhận được một báo cáo câu hỏi từ sinh viên .',
      '',
      `Họ tên: ${data.studentName || ''}`,
      `Mã sinh viên: ${data.studentId || ''}`,
      `Phiên đăng nhập: ${data.sessionId || ''}`,
      `Đề số: ${data.examNumber || ''}`,
      `Mã câu hỏi: ${data.questionId || ''}`,
      
      `Thời điểm báo cáo: ${data.reportedAt || ''}`,
      `Trang gửi: ${data.pageUrl || ''}`,
      '',
      'Nội dung câu hỏi:',
      data.questionText || '',
      '',
      'Lời giải hiện tại:',
      data.solution || ''
    ].join('\n');

    Logger.log(body);

    MailApp.sendEmail({
      to: REPORT_RECEIVER_EMAIL,
      subject: subject,
      body: body
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log(err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}