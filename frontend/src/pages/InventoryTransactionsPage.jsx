import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Stack, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { getAllTransactions } from "../services/inventoryTransactionService";
import DataTable from "../components/common/DataTable";

function formatTimestamp(value) {

    if (!value)
        return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime()))
        return String(value);

    return date.toLocaleString();

}

// Read-only log of every stock movement across every component -- the
// per-component version of this lives on each Component Detail page;
// this is the "everything, everywhere" view. Double-click a row to jump
// to that component.
function InventoryTransactionsPage() {

    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState("");

    async function load() {

        try {

            const data = await getAllTransactions();
            setTransactions(data);

        } catch (err) {

            console.error("Failed to load inventory transactions:", err);

        }

    }

    useEffect(() => {

        load();

    }, []);

    const columns = [

        {
            field: "created_at",
            headerName: "Date",
            width: 200,
            valueFormatter: (value) => formatTimestamp(value)
        },

        {
            field: "part_number",
            headerName: "Component",
            flex: 1,
            renderCell: (params) => {

                const name = params.row.part_name
                    ? `${params.row.part_number} — ${params.row.part_name}`
                    : params.row.part_number;

                return name;

            }
        },

        {
            field: "quantity_delta",
            headerName: "Change",
            width: 110,
            align: "right",
            headerAlign: "right",
            renderCell: (params) => (

                <Box
                    sx={{
                        color: params.value < 0 ? "error.main" : "success.main",
                        fontWeight: "bold"
                    }}
                >
                    {params.value > 0 ? `+${params.value}` : params.value}
                </Box>

            )
        },

        {
            field: "reason",
            headerName: "Reason",
            flex: 2
        }

    ];

    const filteredTransactions = transactions.filter((t) => {

        const text = filter.toLowerCase();

        return (

            (t.part_number ?? "").toLowerCase().includes(text) ||
            (t.part_name ?? "").toLowerCase().includes(text) ||
            (t.reason ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <Box>

            <Stack
                direction="row"
                alignItems="center"
                sx={{ mb: 3 }}
            >

                <Typography variant="h4" fontWeight="bold">
                    Inventory Transactions
                </Typography>

            </Stack>

            <TextField

                sx={{
                    width: 500,
                    maxWidth: "100%",
                    mb: 2
                }}

                size="small"

                placeholder="Search..."

                value={filter}

                onChange={(e) => setFilter(e.target.value)}

                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}

            />

            <DataTable

                rows={filteredTransactions}

                columns={columns}

                onRowDoubleClick={(params) => navigate(`/components/${params.row.component_id}`)}

            />

        </Box>

    );

}

export default InventoryTransactionsPage;
