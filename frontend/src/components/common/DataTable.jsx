import { DataGrid } from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";

function DataTable({

    rows,
    columns,

    loading = false,

    // Set to render the table as a roomier product-style list: taller
    // rows, thin dividers between rows, no column separators.
    listStyle = false,

    onRowDoubleClick,

    onRowClick,

    onSelectionChange

}) {

    return (

        <Paper
            elevation={2}
            sx={{
                width: "100%"
            }}
        >

            <DataGrid

                rows={rows}

                columns={columns}

                loading={loading}

                // The grid grows to fit however many rows the current page
                // size shows, so the whole page scrolls instead of the table
                // scrolling inside a fixed-height box.
                autoHeight

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

                density={listStyle ? "standard" : "compact"}

                rowHeight={listStyle ? 72 : undefined}

                disableColumnMenu={listStyle}

                sx={{

                    border: 0,

                    ...(listStyle && {
                        "& .MuiDataGrid-columnSeparator": { display: "none" },
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: "1px solid",
                            borderColor: "text.disabled"
                        },
                        "& .MuiDataGrid-row": {
                            borderBottom: "1px solid",
                            borderColor: "divider"
                        },
                        "& .MuiDataGrid-cell": {
                            borderTop: 0,
                            outline: "none !important"
                        }
                    }),

                    "& .MuiDataGrid-row:hover": {
                        cursor: "pointer"
                    }

                }}

            />

        </Paper>

    );

}

export default DataTable;