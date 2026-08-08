import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    InputAdornment
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

function CrudToolbar({

    title,

    search = "",
    onSearchChange,

    addLabel = "Add",
    onAdd,

    onEdit,
    editDisabled = true,

    onDelete,
    deleteDisabled = true,

    extraActions = null

}) {

    return (

        <Box sx={{ mb: 3 }}>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    {title}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                    >
                        {addLabel}
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={onEdit}
                        disabled={editDisabled}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={onDelete}
                        disabled={deleteDisabled}
                    >
                        Delete
                    </Button>

                    {extraActions}

                </Stack>

            </Stack>

            <TextField

                sx={{
                    width: 500,
                    maxWidth: "100%"
                }}

                size="small"

                placeholder="Search..."

                value={search}

                onChange={(e) => onSearchChange(e.target.value)}

                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}

            />

        </Box>

    );

}

export default CrudToolbar;