const AdminLayout = ({ children }) => {
	return (
		<div className="flex min-h-screen">
			<div className="w-[250px] bg-black p-5 text-white">
				<h2 className="text-xl font-bold">Admin Panel</h2>
			</div>

			<div className="flex-1 p-5">{children}</div>
		</div>
	);
};

export default AdminLayout;
