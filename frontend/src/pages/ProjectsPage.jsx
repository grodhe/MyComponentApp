import { useEffect, useState } from "react";

import {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} from "../services/projectService";

import DataTable from "../components/common/DataTable";
import CrudToolbar from "../components/common/CrudToolbar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ProjectDialog from "../components/dialogs/ProjectDialog";

function ProjectsPage() {

    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function loadProjects() {

        try {

            const data = await getProjects();
            setProjects(data);

        } catch (err) {

            console.error("Failed to load projects:", err);

        }

    }

    useEffect(() => {

        loadProjects();

    }, []);

    function handleAdd() {

        setDialogMode("add");
        setSelectedProject(null);
        setDialogOpen(true);

    }

    function handleEdit(project) {

        if (!project)
            return;

        setSelectedProject(project);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    function handleClose() {

        setDialogOpen(false);

    }

    async function handleSave(project) {

        try {

            if (dialogMode === "edit" && selectedProject) {

                await updateProject(selectedProject.id, project);

            } else {

                await createProject(project);

            }

            setDialogOpen(false);
            setSelectedProject(null);

            await loadProjects();

        } catch (err) {

            console.error("Failed to save project:", err);
            alert(`Failed to save project: ${err.message}`);

        }

    }

    function handleDelete(project) {

        if (!project)
            return;

        setSelectedProject(project);
        setDeleteDialogOpen(true);

    }

    async function handleConfirmDelete() {

        if (!selectedProject)
            return;

        try {

            await deleteProject(selectedProject.id);

            setDeleteDialogOpen(false);
            setSelectedProject(null);

            await loadProjects();

        } catch (err) {

            console.error("Failed to delete project:", err);
            alert(`Failed to delete project: ${err.message}`);

        }

    }

    function handleCancelDelete() {

        setDeleteDialogOpen(false);

    }

    const columns = [

        {
            field: "project_number",
            headerName: "Project #",
            width: 130
        },

        {
            field: "project_name",
            headerName: "Name",
            flex: 2
        },

        {
            field: "status",
            headerName: "Status",
            width: 140
        },

        {
            field: "version",
            headerName: "Version",
            width: 110
        },

        {
            field: "start_date",
            headerName: "Start Date",
            width: 130,
            valueFormatter: (value) => value ? String(value).slice(0, 10) : ""
        },

        {
            field: "target_date",
            headerName: "Target Date",
            width: 130,
            valueFormatter: (value) => value ? String(value).slice(0, 10) : ""
        }

    ];

    const filteredProjects = projects.filter(project => {

        const text = filter.toLowerCase();

        return (

            (project.project_number ?? "").toLowerCase().includes(text) ||
            (project.project_name ?? "").toLowerCase().includes(text) ||
            (project.description ?? "").toLowerCase().includes(text) ||
            (project.status ?? "").toLowerCase().includes(text) ||
            (project.version ?? "").toLowerCase().includes(text) ||
            (project.notes ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <>

            <CrudToolbar

                title="Projects"

                search={filter}

                onSearchChange={setFilter}

                addLabel="Add Project"

                onAdd={handleAdd}

                onEdit={() => handleEdit(selectedProject)}

                editDisabled={!selectedProject}

                onDelete={() => handleDelete(selectedProject)}

                deleteDisabled={!selectedProject}

            />

            <DataTable

                rows={filteredProjects}

                columns={columns}

                onSelectionChange={setSelectedProject}

                onRowDoubleClick={(params) => handleEdit(params.row)}

            />

            <ProjectDialog

                open={dialogOpen}

                mode={dialogMode}

                project={dialogMode === "edit" ? selectedProject : null}

                onClose={handleClose}

                onSave={handleSave}

            />

            <ConfirmDialog

                open={deleteDialogOpen}

                title="Delete Project"

                message={
                    selectedProject
                        ? `Are you sure you want to delete "${selectedProject.project_name}"? This cannot be undone.`
                        : "Are you sure you want to delete this project? This cannot be undone."
                }

                confirmLabel="Delete"
                confirmColor="error"

                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}

            />

        </>

    );

}

export default ProjectsPage;
