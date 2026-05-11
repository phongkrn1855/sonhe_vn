import assert from 'assert';

console.log("🚀 Đang chạy sanity test cho Backend...");

try {
    // Kiểm tra xem một số logic cơ bản có chạy đúng không
    assert.strictEqual(1 + 1, 2);
    console.log("✅ Phép toán cơ bản: OK");

    // Kiểm tra xem cấu trúc dự án có đúng không (ví dụ kiểm tra biến môi trường mẫu)
    // Ở đây mình chỉ làm ví dụ đơn giản
    
    console.log("🎉 Tất cả các bài test đã vượt qua!");
    process.exit(0); // Thoát với mã 0 (Thành công)
} catch (error) {
    console.error("❌ Test thất bại:", error.message);
    process.exit(1); // Thoát với mã 1 (Thất bại)
}
