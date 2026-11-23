import { DataGrid } from "@mui/x-data-grid";

import { useState } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import useMediaQuery from "@mui/material/useMediaQuery";

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

    // On phones, columns marked `hideOnMobile: true` are dropped so the
    // important ones (name, qty, location...) fit without sideways scrolling.
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    // Pinching out can't reveal more of the page (it always fits the screen),
    // so on phones there's a switch to show every column instead; the table
    // then scrolls sideways.
    const [showAllColumns, setShowAllColumns] = useState(false);

    const hasHiddenColumns = columns.some((col) => col.hideOnMobile);

    const columnVisibilityModel = isMobile && !showAllColumns
        ? Object.fromEntries(
            columns.filter((col) => col.hideOnMobile).map((col) => [col.field, false])
        )
        : undefined;

    return (

        <>

        {isMobile && hasHiddenColumns && (

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}>

                <FormControlLabel
                    control={
                        <Switch
                            size="small"
                            checked={showAllColumns}
                            onChange={(event) => setShowAllColumns(event.target.checked)}
                        />
                    }
                    label="All columns"
                    slotProps={{ typography: { variant: "body2" } }}
                />

            </Box>

        )}

        <Paper
            elevation={2}
            sx={{
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden"
            }}
        >

            <DataGrid

                rows={rows}

                columns={columns}

                loading={loading}

                columnVisibilityModel={columnVisibilityModel}

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

                    // Roomier paging controls on phones: bigger tap targets,
                    // and the "Rows per page" label is dropped to save space.
                    "& .MuiTablePagination-selectLabel": {
                        display: { xs: "none", md: "block" }
                    },
                    "& .MuiTablePagination-toolbar": {
                        pl: { xs: 0, md: 2 },
                        flexWrap: "wrap"
                    },
                    "& .MuiTablePagination-actions .MuiIconButton-root": {
                        p: { xs: 1.25, md: 1 }
                    },

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

        </>

    );

}

export default DataTable;