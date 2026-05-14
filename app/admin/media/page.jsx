import AdminBreadcrumb from "@/components/application/admin/breadcrumb";

const MediaPage = () => {
	const breadcrumbData = [
		{
			href: "/admin/dashboard",
			label: "Bảng điều khiển",
		},
		{
			href: "/admin/media",
			label: "Hình ảnh",
		},
	];

	return (
		<div className="p-6">
			<AdminBreadcrumb breadcrumbData={breadcrumbData} />
			<h1 className="text-2xl font-bold">Hình ảnh</h1>
		</div>
	);
};

export default MediaPage;
