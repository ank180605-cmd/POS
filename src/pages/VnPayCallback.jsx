import { useEffect } from "react";

export default function VnPayCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "paid") {
      alert(" Thanh toán VNPay THÀNH CÔNG!");
      window.close(); // đóng tab callback
    }
  }, []);

  return <h1>Đang xử lý thanh toán...</h1>;
}
