"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Hook fetch dữ liệu với abort controller và refresh
const useFetch = ({ url, method = "GET", body = null, autoFetch = true }) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const abortRef = useRef(null);

	// Hàm fetch có hỗ trợ cancel request trước đó
	const fetchData = useCallback(
		async (customBody = null) => {
			if (abortRef.current) {
				abortRef.current.abort();
			}

			const controller = new AbortController();
			abortRef.current = controller;

			try {
				setLoading(true);
				setError(null);

				const response = await fetch(url, {
					body:
						method !== "GET"
							? JSON.stringify(customBody || body || {})
							: undefined,
					headers: { "Content-Type": "application/json" },
					method,
					signal: controller.signal,
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result?.message || "Something went wrong");
				}

				setData(result);
				return result;
			} catch (err) {
				if (err.name === "AbortError") return;
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[url, method, body],
	);

	const refresh = useCallback(
		async (customBody = null) => fetchData(customBody),
		[fetchData],
	);

	useEffect(() => {
		if (autoFetch && method === "GET") {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			fetchData();
		}

		return () => {
			if (abortRef.current) {
				abortRef.current.abort();
			}
		};
	}, [autoFetch, fetchData, method]);

	return { data, error, loading, refresh };
};

export default useFetch;
