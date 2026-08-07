import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Box,
    Stack,
    Typography,
    Button,
    Tabs,
    Tab,
    Divider
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getProject } from "../services/projectService";

import ProjectPartsTab from "../components/project-detail/ProjectPartsTab";
import ProjectDocumentsTab from "../components/project-detail/ProjectDocumentsTab";
import ProjectRepositoriesTab from "../components/project-detail/ProjectRepositoriesTab";
import ProjectTasksTab from "../components/project-detail/ProjectTasksTab";

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

                <Stack sx={{ mb: 3 }}>

                    <Typography variant="h4" fontWeight="bold">
                        {project.project_name}
                    </Typography>

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
