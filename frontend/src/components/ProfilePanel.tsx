import { ActionIcon, Avatar, Badge, Button, Grid, Group, Paper, Space, Stack, Title, Text, Box, Loader, ScrollArea } from "@mantine/core";
import { IconUser, IconBriefcase2, IconBuilding, IconCalendar, IconDeviceMobile, IconDeviceLandlinePhone, IconPhone, IconMail, IconDots, IconActivity, IconSortAscendingNumbers, IconBadge, IconChristmasBall, IconClockPlay, IconBeach, IconReportMedical, IconCoin, IconHourglass, IconCalendarMonth, IconCalendarExclamation, IconCalendarEvent } from "@tabler/icons-react";
import { UserProfileModel } from "../pages/main/AppHome";
import ProfileEditModal from "./ProfileEditModal";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getUserByUid } from "../helpers/Api";
import { useAuth } from "../authentication/SupabaseAuthContext";
import { dateToWords } from "../helpers/Helpers";

interface IProfilePanel {
    user: UserProfileModel;
    handleDataChange: (flag: boolean) => void;
}

export function ProfilePanel(props: IProfilePanel) {
    const { user, session } = useAuth();
    const [profileModalOpened, { open: openProfileModal, close: closeProfileModal }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 50em)');
    const [userData, setUserData] = useState<UserProfileModel | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [loading, setLoading] = useState(false);

    // props
    const userProp = props.user;
    const handleDataChange = props.handleDataChange;

    useEffect(() => {
        setUserData(userProp);
    }, [userProp]);

    // run on component load
    useEffect(() => {

        // Update windowWidth when the window is resized
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        fetchData();
    },[]);

    async function fetchData() {
        if (!userProp) return;

        setLoading(true);
            
        setLoading(false);
    }

    async function handleFormSubmitted(flag: boolean) {
        if (flag) {
            // get new updated data from database
            var userData = await getUserByUid(userProp.uid, session?.access_token);
            setUserData(userData);
            handleDataChange(true);
        }
    }

    return (
        <>
            {profileModalOpened && (
                <ProfileEditModal 
                    user={userProp}
                    modalOpened={profileModalOpened} 
                    isMobile={isMobile !== undefined ? isMobile : false} 
                    closeModal={closeProfileModal} 
                    formSubmitted={handleFormSubmitted}
                    //userProfileData={userProfileData}
                />
            )}
            <Grid>
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Stack>
                        <Paper shadow="md" p="lg" radius="lg" style={{ background: "#25352F", width: "100%", color: "#dcdcdc" }}>
                            <Stack>
                                <Text size={isMobile ? "25px" : "30px"} fw={600} style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>
                                    About
                                </Text>
                                <Group>
                                    <IconUser />
                                    <Box p="5px" pl="8px" pr="8px" style={{ backgroundColor:"#182420", borderRadius:"10px" }}> 
                                        <Text size="lg" fw={600}>{userData?.first_name + " " + userData?.last_name}</Text>
                                    </Box>
                                </Group>
                                <Group>
                                    <IconCalendar />
                                    <Box p="5px" pl="8px" pr="8px" style={{ backgroundColor:"#182420", borderRadius:"10px" }}>
                                        <Text size="lg" fw={600}>Joined {dateToWords(userData?.date_joined, undefined, false)}</Text>
                                    </Box>
                                </Group>

                                <Space h="xs" />

                                <Text size={isMobile ? "25px" : "30px"} fw={600} style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>
                                    Contact
                                </Text>
                                <Group>
                                    <IconDeviceMobile />
                                    <Box p="5px" pl="8px" pr="8px" style={{ backgroundColor:"#182420", borderRadius:"10px" }}>
                                        <Text size="lg" fw={600}>{userData?.cell_number}</Text>
                                    </Box>
                                </Group>
                                <Group>
                                    <IconMail />
                                    <Box p="5px" pl="8px" pr="8px" style={{ backgroundColor:"#182420", borderRadius:"10px" }}>
                                        <Text size="lg" fw={600}>{userData?.email}</Text>
                                    </Box>
                                </Group>
                            </Stack>
                        </Paper>
                    </Stack>

                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Paper shadow="md" p="lg" radius="lg" style={{ background: "#25352F", width: "100%", color: "#dcdcdc" }}>
                        <Grid>
                            <Grid.Col span={{ base: 12 }}>
                                <Text size={isMobile ? "25px" : "30px"} fw={600} style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>
                                    {userData?.first_name ? userData?.first_name : "User"}
                                </Text>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12 }}>
                                <Stack gap="lg">
                                    {loading && (
                                        <Group justify="center" mt="lg">
                                            <Loader color="cyan" />
                                        </Group>
                                    )}
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                </Grid.Col>
            </Grid>
        </>
    );
}