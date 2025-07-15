-- Thêm cột email vào bảng orders
ALTER TABLE orders 
ADD COLUMN email VARCHAR(255);

-- Thêm comment cho cột email
COMMENT ON COLUMN orders.email IS 'Email của khách hàng để gửi thông báo đơn hàng';

-- Tạo index cho email để tìm kiếm nhanh
CREATE INDEX idx_orders_email ON orders(email); 