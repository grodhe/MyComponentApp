import { useEffect, useState } from "react";

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
    Button
} from "@mui/material";

const emptyTask = {
    title: "",
    status: "Open",
    priority: "",
    due_date: "",
    completed_date: "",
    notes: ""
};

const STATUS_OPTIONS = ["Open", "In Progress", "Blocked", "Done"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

// DATE columns come back from the API as full ISO timestamps;
// <input type="date"> needs just "yyyy-MM-dd".
function toDateInputValue(value) {

    if (!value)
        return "";

    return String(value).slice(0, 10);

}

function ProjectTaskDialog({

    open,

    mode = "add",

    task,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyTask);

    useEffect(() => {

        if (!open)
            return;

        if (mode === "edit" && task) {

            setData({
                ...task,
                due_date: toDateInputValue(task.due_date),
                completed_date: toDateInputValue(task.completed_date)
            });

        } else {

            setData(emptyTask);

        }

    }, [open, mode, task]);

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
                    ? "Edit Task"
                    : "Add Task"}

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
                            label="Title"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <FormControl fullWidth>

                            <InputLabel>Status</InputLabel>

                            <Select
                                label="Status"
                                name="status"
                                value={data.status}
                                onChange={handleChange}
                            >

                                {STATUS_OPTIONS.map((option) => (

                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <FormControl fullWidth>

                            <InputLabel>Priority</InputLabel>

                            <Select
                                label="Priority"
                                name="priority"
                                value={data.priority}
                                onChange={handleChange}
                            >

                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {PRIORITY_OPTIONS.map((option) => (

                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            type="date"
                            label="Due Date"
                            name="due_date"
                            value={data.due_date}
                            onChange={handleChange}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

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

export default ProjectTaskDialog;
