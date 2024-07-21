import { Button, Paper, Stack, TextInput, Title, Text, Container } from "@mantine/core";
import { useEffect, useState } from "react";
import { supabase } from "../authentication/SupabaseContext";
import { useAuth } from "../authentication/SupabaseAuthContext";
import { useNavigationContext } from "../context/NavigationContext";

export default function LogoutCard() {
    const { setUser } = useAuth();
    const {
        profilePanelActive, settingsPanelActive, setProfilePanelActive,setSettingsPanelActive,
    } = useNavigationContext();

    useEffect(() => {
        supabase.auth.signOut();
        setUser(null);
        localStorage.clear();
        setProfilePanelActive(false);
        setSettingsPanelActive(false);
    },[]);

    return (
        <Container size="sm">
            <Paper shadow="md" mt="100px" p="lg" radius="lg" style={{ background: "#0f1714", color: "white" }}>
                <Stack>
                    <Title ta="center" order={2}>You have been signed out!</Title>
                    <Title ta="center" order={2}>See you later 👋</Title>
                </Stack>
            </Paper>
        </Container>
    );
}