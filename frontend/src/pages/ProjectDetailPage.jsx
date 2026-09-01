import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Box,
    Stack,
    Typography,
    Button,
    Tabs,
    Tab,
    Divider,
    Chip
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

import {
    getProject,
    getProjectPhotoUrl,
    uploadProjectPhoto,
    deleteProjectPhoto
} from "../services/projectService";

import ProjectPartsTab from "../components/project-detail/ProjectPartsTab";
import ProjectDocumentsTab from "../components/project-detail/ProjectDocumentsTab";
import ProjectRepositoriesTab from "../components/project-detail/ProjectRepositoriesTab";
import ProjectTasksTab from "../components/project-detail/ProjectTasksTab";

// Mirrors ComponentPhoto on ComponentDetailPage.jsx -- see that component
// for the reasoning (no "has a photo" flag in the DB, this just tries to
// load the image and falls back to a placeholder on 404).
function ProjectPhoto({ project, onChanged }) {

    const [photoOk, setPhotoOk] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {

        setPhotoOk(true);

    }, [project.id, project.updated_at]);

    async function handleFileChange(event) {

        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file)
            return;

        setUploading(true);

        try {

            await uploadProjectPhoto(project.id, file);
            setPhotoOk(true);
            onChanged();

        } catch (err) {

            console.error("Failed to upload photo:", err);
            alert(`Failed to upload photo: ${err.message}`);

        } finally {

            setUploading(false);

        }

    }

    async function handleRemove() {

        try {

            await deleteProjectPhoto(project.id);
            setPhotoOk(false);
            onChanged();

        } catch (err) {

            console.error("Failed to remove photo:", err);
            alert(`Failed to remove photo: ${err.message}`);

        }

    }

    const photoUrl = getProjectPhotoUrl(project.id, project.updated_at);

    return (

        <Stack alignItems="center" spacing={1}>

            <Box
                sx={{
                    width: 160,
                    height: 140,
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0
                }}
            >

                {photoOk ? (

                    <Box
                        component="img"
                        src={photoUrl}
                        alt={project.project_name}
                        onError={() => setPhotoOk(false)}
                        sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />

                ) : (

                    <ImageNotSupportedIcon color="disabled" fontSize="large" />

                )}

            </Box>

            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <Stack direction="row" spacing={1}>

                <Button
                    size="small"
                    startIcon={<AddAPhotoIcon fontSize="small" />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {photoOk ? "Change" : "Upload"}
                </Button>

                {photoOk && (

                    <Button
                        size="small"
                        color="error"
                        onClick={handleRemove}
                        disabled={uploading}
                    >
                        Remove
                    </Button>

                )}

            </Stack>

        </Stack>

    );

}

function ProjectDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tab, setTab] = useState(0);

    async function loadProject() {

        try {

            const data = await getProject(id);
            setProject(data);

        } catch (err) {

            console.error("Failed to load project:", err);

        }

    }

    useEffect(() => {

        loadProject();

    }, [id]);

    return (

        <Box>

            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/projects")}
                sx={{ mb: 2 }}
            >
                Back to Projects
            </Button>

            {project && (

                <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ mb: 3 }}>

                    <ProjectPhoto project={project} onChanged={loadProject} />

                    <Stack sx={{ flex: 1, minWidth: 0 }}>

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                        >

                            <Typography variant="h4" fontWeight="bold">
                                {project.project_name}
                            </Typography>

                            {project.completed_date && (
                                <Chip
                                    size="small"
                                    color="success"
                                    label="Completed"
                                />
                            )}

                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                            {project.project_number}
                            {project.version ? ` · v${project.version}` : ""}
                        </Typography>

                        {project.description && (
                            <Typography sx={{ mt: 1 }}>
                                {project.description}
                            </Typography>
                        )}

                    </Stack>

                </Stack>

            )}

            <Divider sx={{ mb: 2 }} />

            <Tabs
                value={tab}
                onChange={(e, newValue) => setTab(newValue)}
                sx={{ mb: 3 }}
            >
                <Tab label="Parts" />
                <Tab label="Documents" />
                <Tab label="Repositories" />
                <Tab label="Tasks" />
            </Tabs>

            {tab === 0 && <ProjectPartsTab projectId={id} />}
            {tab === 1 && <ProjectDocumentsTab projectId={id} />}
            {tab === 2 && <ProjectRepositoriesTab projectId={id} />}
            {tab === 3 && <ProjectTasksTab projectId={id} />}

        </Box>

    );

}

export default ProjectDetailPage;
