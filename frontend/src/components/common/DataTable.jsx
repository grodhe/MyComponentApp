import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

function DataTable({

    rows = [],
    columns = [],

    loading = false,

    pageSize = 25,

    checkboxSelection = false,

    onRowClick,

    onRowDoubleClick

}) {

    return (

        <Paper
            sx={{
                height: 650,
                width: "100%"
            }}
        >

            <DataGrid

                rows={rows}

                columns={columns}

                loading={loading}

                checkboxSelection={checkboxSelection}

                disableRowSelectionOnClick

                pageSizeOptions={[10, 25, 50, 100]}

                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize
                        }
                    }
                }}

                density="compact"

                onRowClick={onRowClick}

                onRowDoubleClick={onRowDoubleClick}

                sx={{
                    border: 0,

                    "& .MuiDataGrid-columnHeaders": {
                        fontWeight: "bold"
                    }
                }}

            />

        </Paper>

    );

}

export default DataTable;