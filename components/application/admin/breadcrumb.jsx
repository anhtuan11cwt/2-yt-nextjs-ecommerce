import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Component breadcrumb dẫn đường
const AdminBreadcrumb = ({ breadcrumbData = [] }) => {
	return (
		<Breadcrumb className="mb-5">
			<BreadcrumbList>
				{breadcrumbData.length > 0 &&
					breadcrumbData.map((data, index) => {
						const isLastItem = index === breadcrumbData.length - 1;
						const itemKey = `${data.href}-${data.label}`;

						return (
							<div className="flex items-center" key={itemKey}>
								<BreadcrumbItem>
									<BreadcrumbLink href={data.href}>{data.label}</BreadcrumbLink>
								</BreadcrumbItem>

								{!isLastItem && <BreadcrumbSeparator className="ms-2 mt-1" />}
							</div>
						);
					})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default AdminBreadcrumb;
