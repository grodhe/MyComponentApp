import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    InputAdornment
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

function PageToolbar({

    title,
    search = "",
    onSearchChange,
    addLabel = "Add",
    onAdd

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

           <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
           >
           {addLabel}
           </Button>

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

export default PageToolbar;