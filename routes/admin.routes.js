// Routes admin (dùng chung để tránh hardcode)
const ADMIN_ROUTES = {
	ADD_CATEGORY: "/admin/category/add",
	ADMIN_COUPON_ADD: "/admin/coupons/add",
	ADMIN_COUPON_EDIT: (id) => `/admin/coupons/edit/${id}`,
	ADMIN_COUPON_SHOW: "/admin/coupons/show",
	ADMIN_CUSTOMER_SHOW: "/admin/customers",
	ADMIN_REVIEW_SHOW: "/admin/reviews",
	CATEGORIES: "/admin/category/show",
	CATEGORY_EDIT: "/admin/category/edit",
	DASHBOARD: "/admin/dashboard",
	MEDIA: "/admin/media",
	ORDER_DETAILS: (id) => `/admin/orders/details/${id}`,
	ORDERS: "/admin/orders",
	PRODUCT_ADD: "/admin/product/add",
	PRODUCT_EDIT: "/admin/product/edit",
	PRODUCT_SHOW: "/admin/product/show",
	PRODUCTS: "/admin/product/show",
	VARIANT_ADD: "/admin/variant/add",
	VARIANT_EDIT: "/admin/variant/edit",
	VARIANT_SHOW: "/admin/variant/show",
};

export default ADMIN_ROUTES;
