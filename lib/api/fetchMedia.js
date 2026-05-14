import axios from "axios";

export const fetchMedia = async ({ pageParam = 1, deleteType = "active" }) => {
	const response = await axios.get(
		`/api/media?page=${pageParam}&limit=10&deleteType=${deleteType}`,
		{ withCredentials: true },
	);
	return response.data;
};
