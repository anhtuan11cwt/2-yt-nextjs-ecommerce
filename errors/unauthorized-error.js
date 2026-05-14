class UnauthorizedError extends Error {
	constructor(message) {
		super(message);
		this.name = "UnauthorizedError";
		this.statusCode = 403;
	}
}

export default UnauthorizedError;
