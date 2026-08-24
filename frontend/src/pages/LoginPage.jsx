import { useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Avatar,
    Stack,
    CircularProgress
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useAuth } from "../context/AuthContext";

// Full-screen login gate -- shown instead of the app whenever there's no
// valid session. Credentials are checked against the NAS's own Synology
// account (DSM), not a separate login system, so this is literally the
// same username/password used to log into DSM itself.
function LoginPage() {

    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");

    const [otpRequired, setOtpRequired] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {

            await login(username, password, otpRequired ? otpCode : undefined);

        } catch (err) {

            setError(err.message || "Login failed.");

            // A 401 with otpRequired isn't distinguishable from the thrown
            // Error alone, so this relies on the message text DSM login
            // already returns being clear enough on its own; the field
            // still appears once the account is known to need it.
            if (/2-step verification/i.test(err.message || "")) {
                setOtpRequired(true);
            }

        } finally {

            setSubmitting(false);

        }

    }

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default"
            }}
        >

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: 360,
                    maxWidth: "90vw"
                }}
            >

                <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>

                    <Avatar sx={{ bgcolor: "primary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography variant="h5" fontWeight="bold">
                        📦 Hobbyist Inventory
                    </Typography>

                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Sign in with your Synology account
                    </Typography>

                </Stack>

                <Box component="form" onSubmit={handleSubmit}>

                    <Stack spacing={2}>

                        {error && (
                            <Alert severity="error">
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            autoFocus
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={submitting}
                        />

                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={submitting}
                        />

                        {otpRequired && (

                            <TextField
                                fullWidth
                                label="2-Step Verification Code"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                disabled={submitting}
                                autoFocus
                            />

                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={submitting || !username || !password}
                            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                        >
                            {submitting ? "Signing in..." : "Sign In"}
                        </Button>

                    </Stack>

                </Box>

            </Paper>

        </Box>

    );

}

export default LoginPage;
