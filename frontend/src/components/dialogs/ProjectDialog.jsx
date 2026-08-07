import { useEffect, useState } from "react";

import { getProjectStatuses } from "../../services/projectService";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Grid,

    TextField,

    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,

    Button

} from "@mui/material";

const emptyProject = {

    project_number: "",
    project_name: "",
    description: "",

    status_id: "",
    version: "",

    start_date: "",
    target_date: "",
    completed_date: "",

    github_url: "",
    documentation_url: "",
    image_url: "",

    notes: ""

};

// DATE columns come back from the API as full ISO timestamps
// ("2026-01-01T00:00:00.000Z"); <input type="date"> needs just "yyyy-MM-dd".
function toDateInputValue(value) {

    if (!value)
        return "";

    return String(value).slice(0, 10);

}

function ProjectDialog({

    open,

    mode = "add",

    project,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyProject);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {

        if (!open)
            return;

        async function loadStatuses() {

            try {

                const result = await getProjectStatuses();
                setStatuses(result);

            } catch (err) {

                console.error("Failed to load project statuses:", err);

            }

        }

        if (mode === "edit" && project) {

            setData({
                ...project,
                start_date: toDateInputValue(project.start_date),
                target_date: toDateInputValue(project.target_date),
                completed_date: toDateInputValue(project.completed_date)
            });

        } else {

            setData(emptyProject);

        }

        loadStatuses();

    }, [open, mode, project]);

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
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>

                {mode === "edit"
                    ? "Edit Project"
                    : "Add Project"}

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Project Number"
                            name="project_number"
                            value={data.project_number}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Project Name"
                            name="project_name"
                            value={data.project_name}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label="Description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>
                        <Divider sx={{ mt: 2, mb: 1 }}>
                            Status
                        </Divider>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <FormControl fullWidth required>

                            <InputLabel>Status</InputLabel>

                            <Select
                                label="Status"
                                name="status_id"
                                value={data.status_id}
                                onChange={handleChange}
                            >

                                {statuses.map((status) => (

                                    <MenuItem
                                        key={status.id}
                                        value={status.id}
                                    >
                                        {status.name}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Version"
                            name="version"
                            value={data.version}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>
                        <Divider sx={{ mt: 2, mb: 1 }}>
                            Dates
                        </Divider>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <TextField
                            fullWidth
                            type="date"
                            label="Start Date"
                            name="start_date"
                            value={data.start_date}
                            onChange={handleChange}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <TextField
                            fullWidth
                            type="date"
                            label="Target Date"
                            name="target_date"
                            value={data.target_date}
                            onChange={handleChange}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <TextField
                            fullWidth
                            type="date"
                            label="Completed Date"
                            name="completed_date"
                            value={data.completed_date}
                            onChange={handleChange}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />

                    </Grid>

                    <Grid size={12}>
                        <Divider sx={{ mt: 2, mb: 1 }}>
                            Links
                        </Divider>
                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="GitHub URL"
                            name="github_url"
                            value={data.github_url}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="Documentation URL"
                            name="documentation_url"
                            value={data.documentation_url}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="Image URL"
                            name="image_url"
                            value={data.image_url}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>
                        <Divider sx={{ mt: 2, mb: 1 }}>
                            Notes
                        </Divider>
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

export default ProjectDialog;
