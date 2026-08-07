import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button
} from "@mui/material";

const emptyRepository = {
    repository_name: "",
    repository_type: "",
    repository_url: "",
    notes: ""
};

function ProjectRepositoryDialog({

    open,

    mode = "add",

    repository,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyRepository);

    useEffect(() => {

        if (!open)
            return;

        if (mode === "edit" && repository) {
            setData(repository);
        } else {
            setData(emptyRepository);
        }

    }, [open, mode, repository]);

    function handleChange(event) {

        const { name, value } = event.target;

        setData({
            ...data,
            [name]: value
        });

    }

    function handleSave() {

        onSave(data);

    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>

                {mode === "edit"
                    ? "Edit Repository"
                    : "Add Repository"}

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="Repository Name"
                            name="repository_name"
                            value={data.repository_name}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="Repository URL"
                            name="repository_url"
                            placeholder="https://github.com/example/project"
                            value={data.repository_url}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="Repository Type"
                            name="repository_type"
                            placeholder="e.g. Firmware, Hardware, Docs"
                            value={data.repository_type}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label="Notes"
                            name="notes"
                            value={data.notes}
                            onChange={handleChange}
                        />

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                >
                    {mode === "edit"
                        ? "Save"
                        : "Add"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ProjectRepositoryDialog;
