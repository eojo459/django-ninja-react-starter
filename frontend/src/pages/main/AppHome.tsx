import { Avatar, Box, Container, Grid, Group, Stack, Tabs, Title, Text, Button, Space, Paper, Badge, SimpleGrid, ActionIcon, Tooltip, TextInput, Select, Alert, rem } from "@mantine/core";
import { IconActivity, IconBriefcase2, IconBuilding, IconBuildingStore, IconCalendar, IconCheck, IconClock, IconDeviceLandlinePhone, IconDeviceMobile, IconDots, IconDotsCircleHorizontal, IconDotsVertical, IconHome, IconInfoCircle, IconMail, IconMapPin, IconPhone, IconReportAnalytics, IconSettings, IconUser, IconUserPlus, IconUsersGroup, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import ProfileEditModal from "../../components/ProfileEditModal";
//import classes from '../css/TextInput.module.css';
import { supabase, useSupabase } from "../../authentication/SupabaseContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/SupabaseAuthContext";
import { ProfilePanel } from "../../components/ProfilePanel";
import { useNavigationContext } from "../../context/NavigationContext";
import { AppMenu } from "../../components/AppMenu";
import ProfileSettings from "../../components/ProfileSettings";
import ChargebeeCheckoutModal from "../../components/ChargebeeCheckoutModal";
import { GetChargebeeUpdateSubscriptionCheckoutUrl, PostChargebeeNewCheckoutUrl } from "../../helpers/Api";
import { notifications } from "@mantine/notifications";
import notiicationClasses from "../../css/Notifications.module.css";
import ChangePlanModal from "../../components/ChangePlanModal";

interface IAppMenu {
    home?: boolean;
}

export interface Payment {
    payment_type: string;
    card_last4: string;
    card_brand: string;
    card_funding_type: string;
    card_expiry_month: string;
    card_expiry_year: string;
    paypal_email: string;
    txn_date: string;
    txn_amount: number;
}

export interface Subscription {
    item_price_id: string;
    activated_at: string;
    expires_at: string;
    currency_code: string;
    current_term_start: string;
    current_term_end: string;
    next_billing_at: string;
    status: string;
}

export interface UserProfileModel {
    uid: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    street: string;
    street_2: string;
    city: string;
    province: string;
    country: string;
    postal_code: string;
    gender: string;
    cell_number: string;
    date_joined: string;
    role: string;
    active: boolean;
    local_storage_data?: string;
    plan?: number;
    subscription?: Subscription;
    payment?: Payment;
    confirm_email: boolean;
    pending_approval: boolean;
}

const pointerCursor = {
    cursor: 'pointer', // Change the cursor to a pointer
};

export default function AppHome(props: IAppMenu) {
    const { user, session, fetchAuthData } = useAuth();
    const { signOutUser, isNewUser, onboarding } = useSupabase();
    const { 
        active, profilePanelActive, settingsPanelActive, appMenuPanelActive, setActive
    } = useNavigationContext();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    //const [timesheetListPanelActive, setTimesheetListPanelActive] = useState(false);
    const [selectedEntityType, setSelectedEntityType] = useState<string | null>(null);
    const [profileModalOpened, { open: openProfileModal, close: closeProfileModal }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 50em)');
    const navigate = useNavigate();
    const location = useLocation();
    const [onboardingLockdown, setOnboardingLockdown] = useState(onboarding && user?.role === "STAFF");
    const [chargebeeCheckoutModalOpened, { open: openChargbeeCheckoutModal, close: closeChargebeeCheckoutModal }] = useDisclosure(false);
    const [changePlanModalOpened, { open: openChangePlanModal, close: closeChangePlanModal }] = useDisclosure(false);
    const [hostedUrl, setHostedUrl] = useState('');

    function handleHostedUrlChange(hostedUrl: string) {
        setHostedUrl(hostedUrl);
        openChargbeeCheckoutModal();
    }

    // setup props
    const homeProp = props.home;

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

    // useEffect(() => {
    //     const queryParams = new URLSearchParams(location.search);
    //     if (queryParams.get('register') === 'business') {
    //         setIsRegistered(true);
    //     }
    // }, [location.search]);


    useEffect(() => {
        if (!user) return;

        // Get the URL parameters
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);

    },[]);


    useEffect(() => {
        if (!user) return;
    },[user]);

    function handleFormSubmitted(flag: boolean) {
        if (flag) {
            console.log("Form submitted");
        }
    }

    function updateData(flag: boolean) {
        if (flag) {
            console.log("update data");
        }
    }

    // switch to registration panel and select business entity
    function handleQuickRegisterBusiness() {
        setActive('registration');
        setSelectedEntityType("0");
    }

    // switch to clock in panel 
    function handleQuickClockIn() {
        setActive('clockin');
    }

    // open modal to reactive subscription
    function handleReactivateSubscription() {
        updateSubscription();
    }

    function handleOkClick() {
        fetchAuthData();
    }

    async function updateSubscription() {
        if (!user) return;

        // show notification
        const id = notifications.show({
            loading: true,
            title: 'Connecting to the server',
            message: 'Please wait.',
            autoClose: false,
            withCloseButton: false,
            classNames: notiicationClasses,
        });

        // create subscription data 
        var formData = {
            'item_id': 'VerifiedHours_Basic-CAD-Monthly',
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
                handleHostedUrlChange(hostedUrl);
            }
            
            // show success
            setTimeout(() => {
                notifications.update({
                    id,
                    color: 'teal',
                    title: 'Success',
                    message: 'Connected to server.',
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
                    message: 'There was an error saving. Please try again.',
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 1500,
                    classNames: notiicationClasses,
                });
            }, 500);
        }
    }

    // show get started create new business alert
    const ownerOnboardingNotificationAlert = (
        <Alert
            variant="light"
            color="yellow"
            radius="md"
            title="Note"
            icon={<IconInfoCircle />}
            mb="lg"
        >
            <Text
                c="#dcdcdc"
                size="lg"
                style={{ fontFamily: "AK-Medium" }}
            >
                <Button color="#4a8a2a" size="xs" mr="sm" onClick={handleQuickRegisterBusiness}>click here</Button> to get started and setup your first business profile. 
            </Text>
        </Alert>
    );

    // show account is being reviewed alert
    const staffAccountUnderReviewNotificationAlert = (
        <Alert
            variant="light"
            color="yellow"
            radius="md"
            title="Note"
            icon={<IconInfoCircle />}
            mb="lg"
        >
            <Text
                c="#dcdcdc"
                size="lg"
                style={{ fontFamily: "AK-Medium" }}
            >
                Your account is currently being reviewed by your manager. You will have limited access while being under review. 
            </Text>
        </Alert>
    );

    // show subscription cancelled alert
    const subscriptionCancelledNotificationAlert = (
        <Alert
            variant="light"
            color="yellow"
            radius="md"
            title="Note"
            icon={<IconInfoCircle />}
            mb="lg"
        >
            <Text
                c="#dcdcdc"
                size="lg"
                style={{ fontFamily: "AK-Medium" }}
            >
                Your subscription has ended and you have lost access to your upgraded account features.
            </Text>
            <Text
                c="#dcdcdc"
                size="lg"
                style={{ fontFamily: "AK-Medium" }}
            >
                <Button color="#4a8a2a" size="xs" mr="sm" onClick={openChangePlanModal}>click here</Button> to reactivate your subscription. 
            </Text>
        </Alert>
    );

    // show subscription non renewing alert
    const subscriptionNonRenewingNotificationAlert = (
        <Alert
            variant="light"
            color="yellow"
            radius="md"
            title="Note"
            icon={<IconInfoCircle />}
            mb="lg"
        >
            <Text
                c="#dcdcdc"
                size="lg"
                style={{ fontFamily: "AK-Medium" }}
            >
                Your subscription will not be renewed at the end of your term. <Button color="#4a8a2a" size="xs" ml="sm" mr="sm" onClick={openChangePlanModal}>click here</Button> to reactivate your subscription.
            </Text>
            <Text
                c="#dcdcdc"
                size="lg"
                style={{ fontFamily: "AK-Medium" }}
            >
                You will lose access to your upgraded account features at the end of your term.
            </Text>
        </Alert>
    );

    return (
        <>
            {chargebeeCheckoutModalOpened && hostedUrl !== "" && (
                <ChargebeeCheckoutModal
                    modalOpened={chargebeeCheckoutModalOpened}
                    isMobile={isMobile !== undefined ? isMobile : false} 
                    closeModal={closeChargebeeCheckoutModal}
                    hostedUrl={hostedUrl}
                />
            )}
            {changePlanModalOpened && (
                <ChangePlanModal
                    modalOpened={changePlanModalOpened}
                    isMobile={isMobile !== undefined ? isMobile : false}
                    closeModal={closeChangePlanModal}
                    handleOkClick={handleOkClick}
                />
            )}
            <Container size={isMobile || active === "attendance" ? "100%" : "xl"} c="#dcdcdc">
                <Stack mt="lg">
                    {/* {user != null && user && (
                        <ProfileHeader user={user}/>
                    )} */}

                    {/* notification alerts */}
                    {isNewUser && user?.role === "OWNER" && ownerOnboardingNotificationAlert}
                    {isNewUser && !onboardingLockdown && user?.role === "STAFF" && staffAccountUnderReviewNotificationAlert}
                    {(user?.subscription?.status === "cancelled") && subscriptionCancelledNotificationAlert}
                    {(user?.subscription?.status === "non_renewing") && subscriptionNonRenewingNotificationAlert}

                    {/* homebase panel */}
                    {appMenuPanelActive && !onboardingLockdown && (
                        <AppMenu />
                    )}

                    {/* edit profile panel */}
                    {profileModalOpened && user && !onboardingLockdown && (
                        <ProfileEditModal
                            user={user}
                            modalOpened={profileModalOpened}
                            isMobile={isMobile !== undefined ? isMobile : false}
                            closeModal={closeProfileModal}
                            formSubmitted={handleFormSubmitted}
                            //userProfileData={userProfileData}
                        />
                    )}

                    {/* profile panel */}
                    {profilePanelActive && user != null && !onboardingLockdown && (
                        <ProfilePanel user={user} handleDataChange={updateData} />
                    )}

                    {/* settings panel */}
                    {settingsPanelActive && !onboardingLockdown && (
                        <ProfileSettings/>
                    )}
                </Stack>
            </Container>
        </>
    );
}