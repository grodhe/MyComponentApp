import { DataGrid } from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";

function DataTable({

    rows,
    columns,

    loading = false,

    onRowDoubleClick,

    onRowClick,

    onSelectionChange

}) {

    return (

        <Paper
            elevation={2}
            sx={{
                height: 650,
                width: "100%"
            }}
        >

            <DataGrid

                rows={rows}

                columns={columns}

                loading={loading}

                pageSizeOptions={[10, 25, 50, 100]}

                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10
                        }
                    }
                }}

                disableRowSelectionOnClick={false}

                onRowClick={onRowClick}

                onRowDoubleClick={onRowDoubleClick}

                onRowSelectionModelChange={(selection) => {

                    if (!onSelectionChange)
                        return;

                    if (selection.length === 0) {

                        onSelectionChange(null);

                        return;

                    }

                    const row = rows.find(r => r.id === selection[0]);

                    onSelectionChange(row);

                }}

                density="compact"

                sx={{

                    border: 0,

                    "& .MuiDataGrid-row:hover": {
                        cursor: "pointer"
                    }

                }}

            />

        </Paper>

    );

}

export default DataTable;