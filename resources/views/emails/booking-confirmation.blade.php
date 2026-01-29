<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đặt vé máy bay</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #333;
        }
        .pnr-code {
            background-color: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .pnr-code .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }
        .pnr-code .code {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-top: 5px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin: 25px 0 15px 0;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .booking-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 500;
            color: #666;
        }
        .detail-value {
            color: #333;
            font-weight: 600;
        }
        .passenger-list {
            margin: 15px 0;
        }
        .passenger-item {
            background-color: #f9f9f9;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 4px;
            border-left: 3px solid #667eea;
        }
        .passenger-name {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .passenger-info {
            font-size: 13px;
            color: #666;
            margin: 3px 0;
        }
        .price-summary {
            background-color: #f0f4ff;
            padding: 20px;
            border-radius: 4px;
            margin: 25px 0;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }
        .price-row.total {
            border-top: 2px solid #667eea;
            padding-top: 12px;
            margin-top: 12px;
            font-size: 16px;
            font-weight: bold;
        }
        .payment-reminder {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            border-radius: 4px;
            margin: 25px 0;
        }
        .payment-reminder h3 {
            margin: 0 0 10px 0;
            color: #856404;
            font-size: 16px;
        }
        .payment-reminder p {
            margin: 8px 0;
            color: #856404;
            font-size: 14px;
        }
        .warning-text {
            color: #d32f2f;
            font-weight: 600;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 40px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
            font-weight: 600;
            text-align: center;
        }
        .cta-button:hover {
            opacity: 0.9;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 5px 0;
        }
        .contact-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            font-size: 13px;
        }
        .status-draft {
            color: #ff9800;
            font-weight: 600;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table th {
            background-color: #667eea;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: 600;
        }
        table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        table tr:last-child td {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✈️ XÁC NHẬN ĐẶT VÉ MÁY BAY</h1>
            <p>Cảm ơn bạn đã đặt vé với chúng tôi</p>
        </div>

        <div class="content">
            <div class="greeting">
                Xin chào <strong>{{ $customerName }}</strong>,
            </div>

            <p>Đặt chỗ của bạn đã được tiếp nhận thành công. Vui lòng xem chi tiết dưới đây:</p>

            <div class="pnr-code">
                <div class="label">Mã đặt chỗ (PNR)</div>
                <div class="code">{{ $booking->pnr_code }}</div>
            </div>

            <!-- Booking Status -->
            <div class="section-title">Trạng thái đơn hàng</div>
            <div class="booking-details">
                <div class="detail-row">
                    <span class="detail-label">Trạng thái:</span>
                    <span class="detail-value status-draft">⏳ CHƯA THANH TOÁN</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ngày đặt:</span>
                    <span class="detail-value">{{ $booking->created_at->format('d/m/Y H:i') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Hết hạn thanh toán:</span>
                    <span class="detail-value warning-text">{{ $booking->expired_at->format('d/m/Y H:i') }}</span>
                </div>
            </div>

            <!-- Passengers Section -->
            <div class="section-title">Danh sách hành khách</div>
            <div class="passenger-list">
                @foreach($passengers as $passenger)
                    <div class="passenger-item">
                        <div class="passenger-name">{{ $passenger->name }}</div>
                        <div class="passenger-info">
                            <strong>Loại:</strong> 
                            @if($passenger->type === 'ADT')
                                Người lớn
                            @elseif($passenger->type === 'CHD')
                                Trẻ em
                            @elseif($passenger->type === 'INF')
                                Trẻ nhỏ (< 2 tuổi)
                            @endif
                        </div>
                        <div class="passenger-info">
                            <strong>Giới tính:</strong> 
                            @if($passenger->gender === 'male')
                                Nam
                            @elseif($passenger->gender === 'female')
                                Nữ
                            @else
                                {{ $passenger->gender }}
                            @endif
                        </div>
                        @if($passenger->email)
                            <div class="passenger-info"><strong>Email:</strong> {{ $passenger->email }}</div>
                        @endif
                        @if($passenger->phone)
                            <div class="passenger-info"><strong>Điện thoại:</strong> {{ $passenger->phone }}</div>
                        @endif
                    </div>
                @endforeach
            </div>

            <!-- Flight Details -->
            <div class="section-title">Chi tiết chuyến bay</div>
            <table>
                <thead>
                    <tr>
                        <th>Chuyến bay</th>
                        <th>Loại vé</th>
                        <th>Hành khách</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($tickets as $ticket)
                        <tr>
                            <td>
                                <strong>{{ $ticket->flight_number ?? 'N/A' }}</strong><br>
                                <small>{{ $ticket->type === 'outbound' ? 'Chiều đi' : 'Chiều về' }}</small>
                            </td>
                            <td>{{ $ticket->class_name ?? 'Standard' }}</td>
                            <td>{{ $ticket->passenger_name ?? 'N/A' }}</td>
                            <td style="text-align: right;">
                                @if($ticket->total_price == 0)
                                    <strong style="color: #4caf50;">MIỄN PHÍ</strong>
                                @else
                                    {{ number_format($ticket->total_price, 0, ',', '.') }} ₫
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Price Summary -->
            <div class="price-summary">
                <div class="price-row">
                    <span>Giá vé:</span>
                    <span>{{ number_format($booking->total_amount, 0, ',', '.') }} ₫</span>
                </div>
                @if($booking->discount_value > 0)
                    <div class="price-row">
                        <span>Giảm giá:</span>
                        <span style="color: #4caf50;">-{{ number_format($booking->discount_value, 0, ',', '.') }} ₫</span>
                    </div>
                @endif
                <div class="price-row total">
                    <span>Tổng cộng:</span>
                    <span>{{ number_format($booking->total_final, 0, ',', '.') }} ₫</span>
                </div>
            </div>

            <!-- Payment Reminder -->
            <div class="payment-reminder">
                <h3>⚠️ NHẮC NHỠ THANH TOÁN</h3>
                <p>
                    Để hoàn tất đặt chỗ của bạn, vui lòng <strong>thanh toán trước hạn</strong>:
                </p>
                <p style="font-size: 16px; font-weight: bold;">
                    🕐 {{ $booking->expired_at->format('d/m/Y lúc H:i') }}
                </p>
                <p>
                    Nếu không thanh toán đúng hạn, đặt chỗ của bạn sẽ <strong>tự động hủy</strong> để giành chỗ cho khách hàng khác.
                </p>
            </div>

            <!-- CTA Button -->
            <center>
                <a href="#" class="cta-button">TIẾN HÀNH THANH TOÁN NGAY</a>
            </center>

            <!-- Contact Information -->
            <div class="contact-info">
                <strong>Cần trợ giúp?</strong><br>
                📞 Hotline: +84 (0) 123 456 789<br>
                📧 Email: support@flightbooking.com<br>
                💬 Live Chat: Khả dụng 24/7
            </div>
        </div>

        <div class="footer">
            <p><strong>Book Flight Tickets</strong> - Đặt vé máy bay dễ dàng, nhanh chóng, tin cậy</p>
            <p>Một sản phẩm của công ty XYZ</p>
            <p style="margin-top: 10px; color: #ccc;">
                © {{ date('Y') }} Book Flight Tickets. Tất cả quyền được bảo lưu.
            </p>
        </div>
    </div>
</body>
</html>
