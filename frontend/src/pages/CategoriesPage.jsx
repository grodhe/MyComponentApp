import { useEffect, useState } from "react";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../services/categoryService";

import DataTable from "../components/common/DataTable";
import CrudToolbar from "../components/common/CrudToolbar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import CategoryDialog from "../components/dialogs/CategoryDialog";

function CategoriesPage() {

    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function loadCategories() {

        try {

            const data = await getCategories();
            setCategories(data);

        } catch (err) {

            console.error("Failed to load categories:", err);

        }

    }

    useEffect(() => {

        loadCategories();

    }, []);

    function handleAdd() {

        setDialogMode("add");
        setSelectedCategory(null);
        setDialogOpen(true);

    }

    function handleEdit(category) {

        if (!category)
            return;

        setSelectedCategory(category);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    function handleClose() {

        setDialogOpen(false);

    }

    async function handleSave(category) {

        try {

            if (dialogMode === "edit" && selectedCategory) {

                await updateCategory(selectedCategory.id, category);

            } else {

                await createCategory(category);

            }

            setDialogOpen(false);
            setSelectedCategory(null);

            await loadCategories();

        } catch (err) {

            console.error("Failed to save category:", err);
            alert(`Failed to save category: ${err.message}`);

        }

    }

    function handleDelete(category) {

        if (!category)
            return;

        setSelectedCategory(category);
        setDeleteDialogOpen(true);

    }

    async function handleConfirmDelete() {

        if (!selectedCategory)
            return;

        try {

            await deleteCategory(selectedCategory.id);

            setDeleteDialogOpen(false);
            setSelectedCategory(null);

            await loadCategories();

        } catch (err) {

            console.error("Failed to delete category:", err);
            alert(`Failed to delete category: ${err.message}`);

        }

    }

    function handleCancelDelete() {

        setDeleteDialogOpen(false);

    }

    const columns = [

        {
            field: "name",
            headerName: "Name",
            flex: 1
        },

        {
            field: "description",
            headerName: "Description",
            flex: 2
        }

    ];

    const filteredCategories = categories.filter(category => {

        const text = filter.toLowerCase();

        return (

            (category.name ?? "").toLowerCase().includes(text) ||
            (category.description ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <>

            <CrudToolbar

                title="Categories"

                search={filter}

                onSearchChange={setFilter}

                addLabel="Add Category"

                onAdd={handleAdd}

                onEdit={() => handleEdit(selectedCategory)}

                editDisabled={!selectedCategory}

                onDelete={() => handleDelete(selectedCategory)}

                deleteDisabled={!selectedCategory}

            />

            <DataTable

                rows={filteredCategories}

                columns={columns}

                onSelectionChange={setSelectedCategory}

                onRowDoubleClick={(params) => handleEdit(params.row)}

            />

            <CategoryDialog

                open={dialogOpen}

                mode={dialogMode}

                category={dialogMode === "edit" ? selectedCategory : null}

                onClose={handleClose}

                onSave={handleSave}

            />

            <ConfirmDialog

                open={deleteDialogOpen}

                title="Delete Category"

                message={
                    selectedCategory
                        ? `Are you sure you want to delete "${selectedCategory.name}"? This cannot be undone.`
                        : "Are you sure you want to delete this category? This cannot be undone."
                }

                confirmLabel="Delete"
                confirmColor="error"

                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}

            />

        </>

    );

}

export default CategoriesPage;
