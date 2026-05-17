import OrderDetails from "@/components/website/order-details";

const OrderDetailsPage = async ({ params }) => {
	const { orderId } = await params;

	return <OrderDetails orderId={orderId} />;
};

export default OrderDetailsPage;
