// Redux persist storage implementation cho SSR
const noopStorage = {
	getItem: () => Promise.resolve(null),
	removeItem: () => Promise.resolve(),
	setItem: () => Promise.resolve(),
};

export const createStorage = () => {
	if (typeof window !== "undefined") {
		return require("redux-persist/lib/storage").default;
	}
	return noopStorage;
};
