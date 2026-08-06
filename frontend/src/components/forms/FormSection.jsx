import { Divider, Box } from "@mui/material";

function FormSection({ title, children }) {

    return (

        <>

            <Box sx={{ mt: 2, mb: 1 }}>

                <Divider textAlign="left">

                    {title}

                </Divider>

            </Box>

            {children}

        </>

    );

}

export default FormSection;