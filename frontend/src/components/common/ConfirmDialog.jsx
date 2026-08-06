import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";

function ConfirmDialog({

    open,

    title = "Are you sure?",
    message,

    confirmLabel = "Confirm",
    cancelLabel = "Cancel",

    confirmColor = "primary",

    onConfirm,
    onCancel

}) {

    return (

        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>

                <DialogContentText>
                    {message}
                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button onClick={onCancel}>
                    {cancelLabel}
                </Button>

                <Button
                    variant="contained"
                    color={confirmColor}
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ConfirmDialog;
