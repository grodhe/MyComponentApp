import ConfirmDialog from "../common/ConfirmDialog";

function DeleteComponentDialog({

    open,
    component,

    onConfirm,
    onCancel

}) {

    return (

        <ConfirmDialog

            open={open}

            title="Delete Component"

            message={
                component
                    ? `Are you sure you want to delete "${component.part_number}"? This cannot be undone.`
                    : "Are you sure you want to delete this component? This cannot be undone."
            }

            confirmLabel="Delete"
            confirmColor="error"

            onConfirm={onConfirm}
            onCancel={onCancel}

        />

    );

}

export default DeleteComponentDialog;
