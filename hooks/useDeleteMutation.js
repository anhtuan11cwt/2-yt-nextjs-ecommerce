"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

// Hook mutation xóa dữ liệu với toast
export default function useDeleteMutation({
	queryKey,
	deleteEndpoint,
	onSuccess,
}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ ids, deleteType }) => {
			const response = await fetch(deleteEndpoint, {
				body: JSON.stringify({ deleteType, ids }),
				headers: { "Content-Type": "application/json" },
				method: deleteType === "PD" ? "DELETE" : "PUT",
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result?.message);
			}

			return result;
		},

		onError: (error) => {
			toast.error(error?.message);
		},

		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey });
			toast.success(data?.message);
			if (onSuccess) onSuccess(data);
		},
	});
}
