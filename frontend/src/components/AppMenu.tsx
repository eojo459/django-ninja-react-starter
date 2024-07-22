import { Card, Text, SimpleGrid, UnstyledButton, Anchor, Group, useMantineTheme, Container, Paper, Stack, Image, Button, Space, TextInput, Grid, Box, Loader } from '@mantine/core';
import {
    IconCreditCard,
    IconBuildingBank,
    IconRepeat,
    IconReceiptRefund,
    IconReceipt,
    IconReceiptTax,
    IconReport,
    IconCashBanknote,
    IconCoin,
    IconClock,
    IconSettings,
    IconHome,
    IconUserPlus,
    IconCalendarTime,
    IconTool,
    IconInbox,
    IconMail,
    IconFileDescription,
} from '@tabler/icons-react';
import classes from "../css/AppMenu.module.css";
import { useMediaQuery } from '@mantine/hooks';
import { useNavigationContext } from '../context/NavigationContext';
import { useAuth } from '../authentication/SupabaseAuthContext';
import { useEffect } from 'react';
import { GenerateUUID } from '../helpers/Helpers';

const mockdata = [
    { title: 'Credit cards', icon: IconCreditCard, color: 'violet' },
    { title: 'Banks nearby', icon: IconBuildingBank, color: 'indigo' },
    { title: 'Transfers', icon: IconRepeat, color: 'blue' },
    { title: 'Refunds', icon: IconReceiptRefund, color: 'green' },
    { title: 'Receipts', icon: IconReceipt, color: 'teal' },
    { title: 'Taxes', icon: IconReceiptTax, color: 'cyan' },
    { title: 'Reports', icon: IconReport, color: 'pink' },
    { title: 'Payments', icon: IconCoin, color: 'red' },
    { title: 'Cashback', icon: IconCashBanknote, color: 'orange' },
];

const userData = [
    { title: 'Home', icon: IconHome, link: 'menu' },
    { title: 'Profile', icon: IconUserPlus, link: 'profile' },
    { title: 'Settings', icon: IconSettings, link: 'settings' },
];

export function AppMenu() {
    const { user } = useAuth();
    const theme = useMantineTheme();
    const isMobile = useMediaQuery('(max-width: 50em)');
    const { active, setActive } = useNavigationContext();

    const userAppMenuItems = userData.map((item) => (
        item.title === "Settings" ? (
            <Grid.Col span={{ base: 12, md: 4 }} key={GenerateUUID()}>
                <Paper
                    p="lg"
                    style={{ background: "#356d1a", cursor: "pointer" }}
                    onClick={() => handleButtonClick(item.link)}
                >
                    <Stack align="center">
                        <Box style={{
                            padding: "10px",
                            backgroundColor: "rgba(33, 74, 13,0.3)",
                            borderRadius: "10px"
                        }}
                        >
                            <item.icon style={{ width: "50px", height: "50px" }}/>
                            {/* <IconHome style={{ width: "50px", height: "50px" }} /> */}
                        </Box>

                        <Text size={isMobile ? "20px" : "30px"} style={{ fontFamily: "AK-Medium" }}>{item.title}</Text>
                    </Stack>
                </Paper>
            </Grid.Col>
        ) : (
            <Grid.Col span={{ base: 6, md: 4 }} key={GenerateUUID()}>
                <Paper
                    p="lg"
                    style={{ background: "#356d1a", cursor: "pointer" }}
                    onClick={() => handleButtonClick(item.link)}
                >
                    <Stack align="center">
                        <Box style={{
                            padding: "10px",
                            backgroundColor: "rgba(33, 74, 13,0.3)",
                            borderRadius: "10px"
                        }}
                        >
                            <item.icon style={{ width: "50px", height: "50px" }}/>
                            {/* <IconReport style={{ width: "50px", height: "50px" }} /> */}
                        </Box>

                        <Text size={isMobile ? "20px" : "30px"} style={{ fontFamily: "AK-Medium" }}>{item.title}</Text>
                    </Stack>
                </Paper>
            </Grid.Col>
        )
    ));

    function handleButtonClick(link: string) {
        if (link != null && link != "") {
            setActive(link);
        }
    }

    return (
        // <Container>
            <Paper shadow="md" p="lg" radius="lg" style={{ background: "#0f1714", color: "white" }}>
                <Stack>
                    {/* <Text size="30px" fw={900} style={{letterSpacing:"1px"}}>Welcome to VerifiedShift! 👋</Text> */}
                    <Image
                        radius="md"
                        //src={vsLogo}
                    //h={30}
                    />
                    {/* <Text size="24px" fw={900} ta="center" mb="lg">Please sign-in to start the adventure 🚀</Text> */}
                    <Grid>
                        {user?.role === "USER" && userAppMenuItems}
                    </Grid>
                </Stack>
                {!user && (
                    <Group align="center" justify="center">
                        <Loader />
                    </Group>
                )}
            </Paper>
        // </Container>
    );
}