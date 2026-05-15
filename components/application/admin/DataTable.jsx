"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { download, generateCsv, mkConfig } from "export-to-csv";
import {
	MaterialReactTable,
	MRT_ShowHideColumnsButton,
	MRT_ToggleDensePaddingButton,
	MRT_ToggleFiltersButton,
	MRT_ToggleFullScreenButton,
	useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";

export default function DataTable({
	columns = [],
	fetchUrl = "",
	deleteType = "SD",
	enableRowSelection = true,
}) {
	const [columnFilters, setColumnFilters] = useState([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const [rowSelection, setRowSelection] = useState({});

	const queryParams = useMemo(
		() => ({
			deleteType,
			filters: JSON.stringify(columnFilters),
			globalFilter,
			limit: pagination.pageSize,
			page: pagination.pageIndex + 1,
			sorting: JSON.stringify(sorting),
		}),
		[pagination, globalFilter, sorting, columnFilters, deleteType],
	);

	const fetchData = async () => {
		const response = await axios.get(fetchUrl, {
			params: queryParams,
		});
		return response.data;
	};

	const { data, isLoading, isRefetching, refetch } = useQuery({
		queryFn: fetchData,
		queryKey: ["datatable", queryParams],
	});

	const table = useMaterialReactTable({
		columns,
		data: data?.data || [],
		enableColumnFilters: true,
		enableColumnOrdering: true,
		enableColumnPinning: true,
		enableDensityToggle: true,
		enableFullScreenToggle: true,
		enableHiding: true,

		enableRowSelection,
		enableStickyFooter: true,

		enableStickyHeader: true,

		initialState: {
			density: "compact",
		},
		manualFiltering: true,

		manualPagination: true,
		manualSorting: true,
		muiTableBodyCellProps: {
			inputProps: undefined, // Loại bỏ inputProps nếu có
		},

		muiTableContainerProps: {
			sx: { maxHeight: "600px" },
		},
		muiTableHeadCellProps: {
			inputProps: undefined, // Loại bỏ inputProps nếu có
		},

		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,

		renderToolbarInternalActions: ({ table }) => (
			<Box className="flex items-center gap-1">
				<MRT_ToggleFiltersButton table={table} />
				<MRT_ShowHideColumnsButton table={table} />
				<MRT_ToggleDensePaddingButton table={table} />
				<MRT_ToggleFullScreenButton table={table} />
			</Box>
		),

		renderTopToolbarCustomActions: ({ table }) => {
			const handleExportRows = () => {
				const rows =
					table.getSelectedRowModel().rows.length > 0
						? table.getSelectedRowModel().rows.map((row) => row.original)
						: data?.data || [];

				const csvConfig = mkConfig({
					filename: "table-data",
					useKeysAsHeaders: true,
				});

				const csv = generateCsv(csvConfig)(rows);
				download(csvConfig)(csv);
			};

			return (
				<Box className="flex items-center gap-2">
					<Button onClick={handleExportRows} variant="contained">
						Xuất CSV
					</Button>

					<Tooltip title="Làm mới">
						<IconButton onClick={refetch}>
							<RefreshIcon />
						</IconButton>
					</Tooltip>

					{deleteType === "SD" ? (
						<Tooltip title="Chuyển vào thùng rác">
							<IconButton color="warning">
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					) : (
						<>
							<Tooltip title="Khôi phục">
								<IconButton color="success">
									<RestoreFromTrashIcon />
								</IconButton>
							</Tooltip>

							<Tooltip title="Xóa vĩnh viễn">
								<IconButton color="error">
									<DeleteSweepIcon />
								</IconButton>
							</Tooltip>
						</>
					)}
				</Box>
			);
		},
		rowCount: data?.total || 0,

		state: {
			columnFilters,
			globalFilter,
			isLoading,
			pagination,
			rowSelection,
			showProgressBars: isRefetching,
			sorting,
		},
	});

	return <MaterialReactTable table={table} />;
}
