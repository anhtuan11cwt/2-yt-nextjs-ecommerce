export default function AuthLayout({ children }) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-muted px-5">
			<div className="w-full max-w-md">{children}</div>
		</div>
	);
}
