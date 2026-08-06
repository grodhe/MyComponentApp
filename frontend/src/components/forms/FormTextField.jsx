import { Grid, TextField } from "@mui/material";

function FormTextField({

    label,

    name,

    value,

    onChange,

    xs = 12,

    md = 6,

    multiline = false,

    rows = 1

}) {

    return (

        <Grid size={{ xs, md }}>

            <TextField

                fullWidth

                label={label}

                name={name}

                value={value}

                onChange={onChange}

                multiline={multiline}

                rows={rows}

            />

        </Grid>

    );

}

export default FormTextField;