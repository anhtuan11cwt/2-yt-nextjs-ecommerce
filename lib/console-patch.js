(() => {
	if (typeof console === "undefined") return;
	const origError = console.error;
	console.error = (...args) => {
		if (
			args.length > 0 &&
			args.some(
				(arg) =>
					(typeof arg === "string" && arg.includes("inputProps")) ||
					(arg instanceof Error && arg.message.includes("inputProps")),
			)
		) {
			return;
		}
		origError.call(console, ...args);
	};
})();
