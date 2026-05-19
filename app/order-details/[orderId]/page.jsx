import OrderDetails from "@/components/website/order-details";

// Trang chi tiết đơn hàng theo orderId
const OrderDetailsPage = async ({ params }) => {
  const { orderId } = await params;

  return <OrderDetails orderId={orderId} />;
};

export default OrderDetailsPage;
