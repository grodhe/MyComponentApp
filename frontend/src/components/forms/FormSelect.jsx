import {
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

function FormSelect({

    label,

    name,

    value,

    onChange,

    options,

    xs = 12,

    md = 6

}) {

    return (

        <Grid size={{ xs, md }}>

            <FormControl fullWidth>

                <InputLabel>

                    {label}

                </InputLabel>

                <Select

                    label={label}

                    name={name}

                    value={value}

                    onChange={onChange}

                >

                    <MenuItem value="">

                        <em>None</em>

                    </MenuItem>

                    {options.map((option) => (

                        <MenuItem
                            key={option.id}
                            value={option.id}
                        >

                            {option.name}

                        </MenuItem>

                    ))}

                </Select>

            </FormControl>

        </Grid>

    );

}

export default FormSelect;