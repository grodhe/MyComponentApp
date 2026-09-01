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

                pageSizeOptions={[15, 25, 50, 100]}

                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 15
                        }
                    }
                }}

                disableRowSelectionOnClick={false}

                onRowClick={onRowClick}

                onRowDoubleClick={onRowDoubleClick}

                onRowSelectionModelChange={(selection) => {

                    if (!onSelectionChange)
                        return;

                    // @mui/x-data-grid v8+ passes { type: "include" | "exclude", ids: Set }
                    // instead of a plain array. Support both shapes so this keeps working
                    // whichever version ends up installed.
                    let selectedId;

                    if (Array.isArray(selection)) {

                        selectedId = selection[0];

                    } else if (selection && selection.ids instanceof Set) {

                        if (selection.type === "include") {

                            selectedId = selection.ids.values().next().value;

                        }

                        // "exclude" selection (e.g. select-all-minus-a-few) isn't used by
                        // this single-selection table, so it's treated as "nothing selected".

                    }

                    if (selectedId === undefined) {

                        onSelectionChange(null);

                        return;

                    }

                    const row = rows.find(r => r.id === selectedId);

                    onSelectionChange(row ?? null);

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