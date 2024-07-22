import { Badge, Button, Divider, Grid, Group, Paper, Stack, Text, rem } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/SupabaseAuthContext";
import { notifications } from "@mantine/notifications";
import notiicationClasses from "../css/Notifications.module.css";
import { PostChargebeeNewCheckoutUrl } from "../helpers/Api";
import { useState } from "react";
import ContactUsModal from "./ContactUsModal";
import { useDisclosure } from "@mantine/hooks";

interface IPlansPricing {
    handleHostedUrlChange: (url: string) => void;
}

export default function PlansPricing(props: IPlansPricing) {
    const navigate = useNavigate();
    const { user, session, isMobile } = useAuth();
    const [proPlanLoading, setProPlanLoading] = useState(false);
    const [basicPlanLoading, setBasicPlanLoading] = useState(false);
    const [contactUsModalOpenedPrefill, { open: openContactUsModalPrefill, close: closeContactUsModalPrefill }] = useDisclosure(false);
    const [contactUsModalOpened, { open: openContactUsModal, close: closeContactUsModal }] = useDisclosure(false);

    // props
    const handleHostedUrlChangeProp = props.handleHostedUrlChange;

    // handle when basic plan sign up button is clicked
    async function handleBasicPlanSignup() {
        if (user) {
            if (user?.role !== 'USER') {
                // not allowed to purchase a subscription
                notifications.show({
                    color: 'red',
                    title: 'Error',
                    message: "You are not allowed to do that.",
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 2500,
                    classNames: notiicationClasses,
                });
                return;
            }

            if (user?.subscription?.status === "active" && user?.subscription?.item_price_id === "Basic") {
                // we already have an active basic plan
                // show error notification
                notifications.show({
                    color: 'red',
                    title: 'Error',
                    message: "You already have this plan",
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 2500,
                    classNames: notiicationClasses,
                });
                return;
            }
            // if user is authenticated => call endpoint and create checkout url
            // show notification
            const id = notifications.show({
                loading: true,
                title: 'Connecting to the server',
                message: 'Please wait.',
                autoClose: false,
                withCloseButton: false,
                classNames: notiicationClasses,
            });

            setBasicPlanLoading(true);

            // create subscription customer data 
            var formData = {
                'item_id': 'Basic-CAD-Monthly',
                'first_name': user?.first_name,
                'last_name': user?.last_name,
                'email': user?.email,
                'phone': user?.cell_number,
            }

            var response = await PostChargebeeNewCheckoutUrl(formData, session?.access_token);
            if (response?.status === 200) {
                // get hosted page checkout url
                var hostedUrl = response?.data.url;
                console.log(response?.data.id);
                if (hostedUrl) {
                    handleHostedUrlChangeProp(hostedUrl);
                }
                setBasicPlanLoading(false);
                
                // show success
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'teal',
                        title: 'Success',
                        message: 'Connected to the server.',
                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1000,
                        classNames: notiicationClasses,
                    });
                }, 500);
                
            }
            else {
                // show error
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'red',
                        title: 'Error',
                        message: 'There was an error connecting to the server. Please try again.',
                        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1500,
                        classNames: notiicationClasses,
                    });
                }, 5000);
            }
        }
        else {
            // else redirect to create account with query param for basic plan
            navigate('/register?plan=basic&isUser=true');
            setTimeout(() => {
                notifications.show({
                    color: 'teal',
                    //title: '',
                    message: 'Please register for an account next.',
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 3000,
                    classNames: notiicationClasses,
                });
            }, 500);
        }
        setBasicPlanLoading(false);
    }

    // handle when pro plan sign up button is clicked
    async function handleProPlanSignup() {
        if (user) {
            if (user?.role !== 'USER') {
                // not allowed to purchase a subscription
                notifications.show({
                    color: 'red',
                    title: 'Error',
                    message: "You are not allowed to do that.",
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 2500,
                    classNames: notiicationClasses,
                });
                return;
            }

            if (user?.subscription?.status === "active" && user?.subscription?.item_price_id === "Pro") {
                // we already have an active pro plan
                // show error notification
                notifications.show({
                    color: 'red',
                    title: 'Error',
                    message: "You already have this plan",
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 2500,
                    classNames: notiicationClasses,
                });
                return;
            }
            // if user is authenticated => call endpoint and create checkout url
            // show notification
            const id = notifications.show({
                loading: true,
                title: 'Connecting to the server',
                message: 'Please wait.',
                autoClose: false,
                withCloseButton: false,
                classNames: notiicationClasses,
            });

            setProPlanLoading(true);

            // create subscription customer data 
            var formData = {
                'item_id': 'Pro-CAD-Monthly',
                'first_name': user?.first_name,
                'last_name': user?.last_name,
                'email': user?.email,
                'phone': user?.cell_number,
            }

            var response = await PostChargebeeNewCheckoutUrl(formData, session?.access_token);
            if (response?.status === 200) {
                // get hosted page checkout url
                var hostedUrl = response?.data.url;
                console.log(response?.data.id);
                if (hostedUrl) {
                    handleHostedUrlChangeProp(hostedUrl);
                }
                setProPlanLoading(false);
                
                // show success
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'teal',
                        title: 'Success',
                        message: 'Connected to the server.',
                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1000,
                        classNames: notiicationClasses,
                    });
                }, 500);
                
            }
            else {
                // show error
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'red',
                        title: 'Error',
                        message: 'There was an error connecting to the server. Please try again.',
                        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1500,
                        classNames: notiicationClasses,
                    });
                }, 5000);
            }
        }
        else {
            // else redirect to create account with query param for pro plan
            navigate('/register?plan=pro&isUser=true');
            setTimeout(() => {
                notifications.show({
                    color: 'teal',
                    //title: '',
                    message: 'Please register for an account next.',
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 3000,
                    classNames: notiicationClasses,
                });
            }, 500);
        }
        setProPlanLoading(false);
    }

    function handleEnterpriseClick() {
        if (user?.role !== 'USER') {
            openContactUsModal();
            return;
        }

        openContactUsModalPrefill();
    }

    return (
        <>
            {contactUsModalOpenedPrefill && (
                <ContactUsModal
                    modalOpened={contactUsModalOpenedPrefill}
                    isMobile={isMobile !== undefined ? isMobile : false} 
                    subject="Enterprise Subscription Inquiry"
                    //message="Hi, I am interested in signing up for an enterprise subscription. I would like to learn more."
                    closeModal={closeContactUsModalPrefill}
                />
            )}

            {contactUsModalOpened && (
                <ContactUsModal
                    modalOpened={contactUsModalOpened}
                    isMobile={isMobile !== undefined ? isMobile : false}
                    closeModal={closeContactUsModal}
                />
            )}

            <Grid>
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Paper shadow="md" p="lg" radius="lg" style={{ background: "#0f1714", color: "white" }}>
                        <Stack>
                            <Text fw={700} size="30px">Free</Text>
                            <Badge size="xl" color="#639383" variant="light"><Text fw={700} size="20px">$0 /month</Text></Badge>
                            <Button 
                                radius="md" 
                                size="md" 
                                color="#324d3e"
                                onClick={() => navigate("/register")}
                            >
                                Sign up
                            </Button>
                            <Divider my="md"/>
                            <Group>
                                <IconCheck/>
                                <Text>Feature</Text>
                            </Group>
                        </Stack>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Paper shadow="md" p="lg" radius="lg" style={{ background: "#0f1714", color: "white" }}>
                        <Stack>
                            <Text fw={700} size="30px">Basic</Text>
                            <Badge size="xl" color="blue" variant="light"><Text fw={700} size="20px">$39.95 /month</Text></Badge>
                            <Button radius="md" size="md" onClick={handleBasicPlanSignup} loading={basicPlanLoading}>Sign up</Button>
                            <Divider my="md"/>
                            <Group>
                                <IconCheck/>
                                <Text>Feature</Text>
                            </Group>
                        </Stack>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Paper shadow="md" p="lg" radius="lg" style={{ background: "#0f1714", color: "white" }}>
                        <Stack>
                            <Text fw={700} size="30px">Pro</Text>
                            <Badge size="xl" color="#ca4628" variant="light"><Text fw={700} size="20px">$79.95 /month</Text></Badge>
                            <Button radius="md" size="md" color="#ca4628" onClick={handleProPlanSignup} loading={proPlanLoading}>Sign up</Button>
                            <Divider my="md"/>
                            <Group>
                                <IconCheck/>
                                <Text>Feature</Text>
                            </Group>
                        </Stack>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Paper shadow="md" p="lg" radius="lg" style={{ background: "#0f1714", color: "white" }}>
                        <Stack>
                            <Text fw={700} size="30px">Enterprise</Text>
                            <Badge size="xl" color="#d1a71d" variant="light"><Text fw={700} size="20px">Contact</Text></Badge>
                            <Button radius="md" size="md" color="#d1a71d" onClick={handleEnterpriseClick}>Contact us</Button>
                            <Divider my="md"/>
                            <Group>
                                <IconCheck/>
                                <Text>Unlimited business centres</Text>
                            </Group>
                            <Group>
                                <IconCheck/>
                                <Text>Feature</Text>
                            </Group>
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>
        </>
    );
}