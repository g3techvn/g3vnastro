# Hướng dẫn Setup EmailJS để gửi thông báo đơn hàng

## 🚀 Cài đặt EmailJS

### Bước 1: Đăng ký tài khoản EmailJS
1. Truy cập [https://www.emailjs.com/](https://www.emailjs.com/)
2. Đăng ký tài khoản miễn phí
3. Xác thực email

### Bước 2: Tạo Email Service
1. Vào **Integration** → **Email Services**
2. Chọn **Gmail** (hoặc email service khác)
3. Kết nối với tài khoản `thanhtrang16490@gmail.com`
4. Lưu **Service ID** (ví dụ: `service_abc123`) Cụ thể service_4imguej

### Bước 3: Tạo Email Template
1. Vào **Email Templates** → **Create New Template**
2. Template ID: `template_order_notification`
3. Subject: `🛒 Đơn hàng mới #{{order_id}} - {{customer_name}}`

**Nội dung email template:**
```html
<h2>🛒 Đơn hàng mới từ website G3Tech</h2>

<h3>📋 Thông tin đơn hàng</h3>
<ul>
  <li><strong>Mã đơn hàng:</strong> #{{order_id}}</li>
  <li><strong>Thời gian đặt:</strong> {{order_date}}</li>
  <li><strong>Tổng tiền:</strong> {{total_amount}}₫</li>
  <li><strong>Phương thức thanh toán:</strong> {{payment_method}}</li>
</ul>

<h3>👤 Thông tin khách hàng</h3>
<ul>
  <li><strong>Họ tên:</strong> {{customer_name}}</li>
  <li><strong>Số điện thoại:</strong> {{customer_phone}}</li>
  <li><strong>Địa chỉ:</strong> {{customer_address}}</li>
</ul>

<h3>📦 Danh sách sản phẩm</h3>
<pre>{{products_list}}</pre>

<h3>📝 Ghi chú</h3>
<p>{{order_note}}</p>

<hr>
<p><small>Email được gửi tự động từ website G3Tech</small></p>
```

4. **Test** template với dữ liệu mẫu
5. **Save** template

### Bước 4: Lấy Public Key
1. Vào **Account** → **General**
2. Copy **Public Key** (ví dụ: `abcDEF123`)

### Bước 5: Cập nhật Environment Variables
Thêm vào file `.env` (hoặc hosting environment):

```bash
# EmailJS Configuration
PUBLIC_EMAILJS_SERVICE_ID=service_abc123
PUBLIC_EMAILJS_TEMPLATE_ID=template_order_notification  
PUBLIC_EMAILJS_PUBLIC_KEY=abcDEF123
```

## 🔧 Kiểm tra hoạt động

1. **Test đặt hàng** trên website
2. **Kiểm tra console** browser để xem log email
3. **Kiểm tra inbox** `thanhtrang16490@gmail.com`

## 📧 Email sẽ gửi tới
- **Địa chỉ:** thanhtrang16490@gmail.com
- **Khi nào:** Sau khi khách hàng đặt hàng thành công
- **Nội dung:** Thông tin chi tiết đơn hàng, khách hàng, sản phẩm

## 🆓 Giới hạn Free Plan
- **200 emails/tháng** (đủ cho việc thông báo đơn hàng)
- Nâng cấp lên paid plan nếu cần nhiều hơn

## 🐛 Debug
- Mở **Developer Tools** → **Console** để xem log
- Email sẽ được gửi async, không ảnh hưởng đến UX
- Nếu gửi email lỗi, đơn hàng vẫn được tạo thành công 