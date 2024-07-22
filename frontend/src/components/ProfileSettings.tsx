import { Badge, Box, Button, Grid, Group, NumberInput, Paper, Select, Stack, Switch, Tabs, Text, TextInput, rem, useMantineTheme, Image, Space } from "@mantine/core";
import inputClasses from "../css/TextInput.module.css";
import { randomId, useDisclosure, useMediaQuery } from "@mantine/hooks";
import classes from "../css/UserProfile.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../authentication/SupabaseAuthContext";
import { EmailVerifyToken, GetChargebeeUpdatePaymentMethodCheckoutUrl, GetOwnerPayment, GetOwnerSubscription, PatchUserByUid, PostChargebeeNewCheckoutUrl, getUserByUid } from "../helpers/Api";
import { useForm } from "@mantine/form";
import { canadaProvinceData, countryData, usaStateData } from "../helpers/SelectData";
import { formatTimestamp12Hours, formatTimestampMonthDayYear, getCurrentTimestamp, getCurrentTimezoneOffset, getFormattedDate, getYearFromDate, isNullOrEmpty } from "../helpers/Helpers";
import { notifications } from "@mantine/notifications";
import notiicationClasses from "../css/Notifications.module.css";
import { IconCheck, IconX } from "@tabler/icons-react";
import InfoCard from "./InfoCard";
import ManagePaymentModal from "./ManagePaymentModal";
import ChangePlanModal from "./ChangePlanModal";
import { useSupabase } from "../authentication/SupabaseContext";

export interface UserData {
    uid: string,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    street: string,
    street_2: string,
    city: string,
    province: string,
    country: string,
    postal_code: string,
    gender: string,
    cell_number: string,
    home_number: string,
    work_number: string,
    date_joined: string,
    position: string,
    role: string,
    business_info: string[],
}

const initialUserData: UserData = {
    uid: '',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    street: '',
    street_2: '',
    city: '',
    province: '',
    country: '',
    postal_code: '',
    gender: '',
    cell_number: '',
    home_number: '',
    work_number: '',
    date_joined: '',
    position: '',
    role: '',
    business_info: [],
};

export default function ProfileSettings() {
    const { user, session, fetchAuthData } = useAuth();
    const { generateRecoveryEmail, updateUserEmail } = useSupabase();
    const theme = useMantineTheme();
    const isMobile = useMediaQuery('(max-width: 50em)');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [userData, setUserData] = useState<UserData>(initialUserData);
    const [selectedCountry, setSelectedCountry] = useState<string | null>('');
    const [provinceStateData, setProvinceStateData] = useState(canadaProvinceData);
    const [usaSelected, setUsaSelected] = useState(false);
    const [provinceTextbox, setProvinceTextbox] = useState(true);
    const [selectedProvince, setSelectedProvince] = useState<string | null>('');
    const [managePaymentModalOpened, { open: openManagePaymentModal, close: closeManagePaymentModal }] = useDisclosure(false);
    const [changePlanModalOpened, { open: openChangePlanModal, close: closeChangePlanModal }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [hostedUrl, setHostedUrl] = useState('');

    // form fields for mantine components
    const personalForm = useForm({
        initialValues: {
            personal_information: {
                uid: user?.uid,
                first_name: user?.first_name,
                last_name: user?.last_name,
                gender: user?.gender,
                street: user?.street,
                street_2: user?.street_2,
                city: user?.city,
                province: user?.province,
                country: user?.country,
                postal_code: user?.postal_code,
            },
        },
        validate: (value) => {
            return {
                first_name: value.personal_information.first_name && value.personal_information.first_name?.trim().length <= 0 ? 'First name is required' : null,
                last_name: value.personal_information.last_name && value.personal_information.last_name?.trim().length <= 0 ? 'Last name is required' : null,
                //gender: value.personal_information.gender && value.personal_information.gender?.trim().length <= 0 ? 'Gender is required' : null,
                //street: value.personal_information.street && value.personal_information.street?.trim().length <= 0 ? 'Street is required' : null,
                city: value.personal_information.city && value.personal_information.city?.trim().length <= 0 ? 'City is required' : null,
                province: value.personal_information.province && value.personal_information.province?.trim().length <= 0 ? 'Province is required' : null,
                country: value.personal_information.country && value.personal_information.country?.trim().length <= 0 ? 'Country is required' : null,
                //postal_code: value.personal_information.street && value.personal_information.street?.trim().length <= 0 ? 'Street is required' : null,
            }
        }
    });

    const contactForm = useForm({
        initialValues: {
            contact_information: {
                uid: user?.uid,
                email: user?.email,
                cell_number: user?.cell_number,
                dirty: false,
            },
        },
        validate: (value) => {
            return {
                email: value.contact_information.email && value.contact_information.email.trim().length <= 0 ? 'Email is required' : null,
                //cell_number: value.contact_information.cell_number && value.contact_information.cell_number.trim().length <= 0 ? 'Cell number is required' : null,
            }
        }
    });

    const passwordForm = useForm({
        initialValues: {
            password_information: {
                uid: user?.uid,
                email: user?.email,
                old_password: '',
                new_password: '',
                new_password_confirm: '',
            },
        },
        validate: (value) => {
            return {
                new_password_confirm: value.password_information.new_password.trim() != value.password_information.new_password_confirm.trim() ? 'Your passwords do not match' : null,
            }
        }
    });

    const subscriptionForm = useForm({
        initialValues: {
            subscription_info: {
                name: user?.subscription?.item_price_id,
                current_term_start: user?.subscription?.current_term_start,
                current_term_end: user?.subscription?.current_term_end,
                next_billing_at: user?.subscription?.next_billing_at,
            },
            payment_info: {
                payment_type: user?.payment?.payment_type,
                card_last4: user?.payment?.card_last4,
                card_brand: user?.payment?.card_brand,
                card_funding_type: user?.payment?.card_funding_type,
                card_expiry_year: user?.payment?.card_expiry_year,
                card_expiry_month: user?.payment?.card_expiry_month,
                paypal_email: user?.payment?.paypal_email,
                // bank_last4: '',
                // bank_person_name: '',
                // bank_name: '',
                // bank_account_type: '',
            }
        }
    });

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

    // fetch data on component load
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (userData) {
            handleUserDataChanges();
        }
    }, [userData]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    // run when selected country select changes
    useEffect(() => {
        if (!isNullOrEmpty(selectedCountry) && selectedCountry != null) {
            console.log(selectedCountry);
            personalForm.values.personal_information.country = selectedCountry;

            switch (selectedCountry) {
                case "Canada":
                    //form.values.personal_information.province = '';
                    //form.values.personal_information.postal_code = '';
                    setProvinceStateData(canadaProvinceData);
                    setUsaSelected(false);
                    setProvinceTextbox(false);
                    break;
                case "United States":
                    //form.values.personal_information.province = '';
                    //form.values.personal_information.postal_code = '';
                    setProvinceStateData(usaStateData);
                    setUsaSelected(true);
                    setProvinceTextbox(false);
                    break;
                default:
                    // show regular textbox
                    //form.values.personal_information.province = '';
                    //form.values.personal_information.postal_code = '';
                    setUsaSelected(false);
                    setProvinceTextbox(true);
                    break;
            }
        }
    }, [selectedCountry]);

    async function fetchData() {
        if (user) {
            // get user information
            var userData = await getUserByUid(user?.uid, session?.access_token);
            setUserData(userData);
            setSelectedCountry(userData?.country);
            setSelectedProvince(userData?.province);

            // get subscription info
            var subscription = await GetOwnerSubscription(user?.uid, session?.access_token);

            // get payment info
            var payment = await GetOwnerPayment(user?.uid, session?.access_token);
        }
    }

    // update form values when user data changes
    function handleUserDataChanges() {
        if (user?.uid === '') return;

        // update personal information
        personalForm.values.personal_information.uid = user?.uid;
        personalForm.values.personal_information.first_name = user?.first_name;
        personalForm.values.personal_information.last_name = user?.last_name;
        personalForm.values.personal_information.gender = user?.gender;
        personalForm.values.personal_information.street = user?.street;
        personalForm.values.personal_information.street_2 = user?.street_2;
        personalForm.values.personal_information.city = user?.city;
        personalForm.values.personal_information.province = user?.province;
        personalForm.values.personal_information.postal_code = user?.postal_code;
        personalForm.values.personal_information.country = user?.country;

        // contact information
        contactForm.values.contact_information.uid = user?.uid;
        contactForm.values.contact_information.email = user?.email;
        contactForm.values.contact_information.cell_number = user?.cell_number;

        // password information
        passwordForm.values.password_information.uid = user?.uid;
        passwordForm.values.password_information.email = user?.email;

        // subscription information
        subscriptionForm.values.subscription_info.name = user?.subscription?.item_price_id;
        subscriptionForm.values.subscription_info.current_term_start = user?.subscription?.current_term_start;
        subscriptionForm.values.subscription_info.current_term_end = user?.subscription?.current_term_end;
        subscriptionForm.values.subscription_info.next_billing_at = user?.subscription?.next_billing_at;

        // payment information
        subscriptionForm.values.payment_info.card_brand = user?.payment?.card_brand;
        subscriptionForm.values.payment_info.card_expiry_month = user?.payment?.card_expiry_month;
        subscriptionForm.values.payment_info.card_expiry_year = user?.payment?.card_expiry_year;
        subscriptionForm.values.payment_info.card_funding_type = user?.payment?.card_funding_type;
        subscriptionForm.values.payment_info.card_last4 = user?.payment?.card_last4;
        subscriptionForm.values.payment_info.paypal_email = user?.payment?.paypal_email;
    }

    // handle form invalid errors
    const handleError = (errors: any) => {
        var message = "";
        var color = "red";
        if (errors.first_name) {
            message = 'Please fill in first name field';
        }
        else if (errors.last_name) {
            message = 'Please fill in last name field';
        }
        else if (errors.gender) {
            message = 'Please fill in gender field';
        }
        else if (errors.street) {
            message = 'Please fill in street address field';
        }
        else if (errors.city) {
            message = 'Please fill in city field';
        }
        else if (errors.province) {
            message = usaSelected ? 'Please fill in state field' : 'Please fill in province field';
        }
        else if (errors.country) {
            message = 'Please fill in country field';
        }
        else if (errors.postal_code) {
            message = usaSelected ? 'Please fill in zip code field' : 'Please fill in postal code field';
        }
        else if (errors.email) {
            message = 'Please fill in email field';
        }
        else if (errors.cell_number) {
            message = 'Please fill in cell number field';
        }
        else if (errors.new_password_confirm) {
            message = 'Your passwords do not match';
        }
        showNotification(message, color);
    };

    // show the notifications with a message and color
    function showNotification(message: string, color: string) {
        notifications.show({
            message: message,
            color: color,
            classNames: notiicationClasses,
        });
    }

    // save personal information changes
    async function handleSavePersonalInformation() {
        if (user) {
            // show notification
            const id = notifications.show({
                loading: true,
                title: 'Connecting to the server',
                message: 'Please wait.',
                autoClose: false,
                withCloseButton: false,
                classNames: notiicationClasses,
            });

            var response = await PatchUserByUid(user?.uid, personalForm.values.personal_information, session?.access_token);
            if (response === 200) {
                // succes
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'teal',
                        title: 'Success',
                        message: 'Your changes were saved.',
                        icon: <IconCheck size="lg" style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1000,
                        classNames: notiicationClasses,
                    });
                }, 500);
            }
            else {
                // error
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'red',
                        title: 'Error',
                        message: 'There was an error saving your changes. Please try again.',
                        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1500,
                        classNames: notiicationClasses,
                    });
                }, 5000);
            }
        }
    }

    // save contact information changes
    async function handleSaveContactInformation() {
        if (user) {
            // show notification
            const id = notifications.show({
                loading: true,
                title: 'Connecting to the server',
                message: 'Please wait.',
                autoClose: false,
                withCloseButton: false,
                classNames: notiicationClasses,
            });

            // TODO: add phone? & email verification 

            // TODO: UPDATE EMAIL IF DIRTY
            // if (contactForm.isDirty('contact_information.email')) { 
            //     // email was updated, call supabase to update auth email
            //     contactForm.setFieldValue('dirty', true);
            //     var { data, error } = await updateUserEmail(contactForm.getInputProps('contact_information.email').value);
            //     if (error != null) {
            //         console.log(error);

            //         // error
            //         setTimeout(() => {
            //             notifications.update({
            //                 id,
            //                 color: 'red',
            //                 title: 'Error',
            //                 message: 'There was an error updating your email. Please try again.',
            //                 icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
            //                 loading: false,
            //                 autoClose: 1500,
            //                 classNames: notiicationClasses,
            //             });
            //         }, 5000);
            //         return;
            //     }
            // }

            var response = await PatchUserByUid(user?.uid, contactForm.values.contact_information, session?.access_token);
            if (response == 200) {
                // success
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'teal',
                        title: 'Success',
                        message: 'Your changes were saved.',
                        icon: <IconCheck size="lg" style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1000,
                        classNames: notiicationClasses,
                    });
                }, 500);
            }
            else {
                // error
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'red',
                        title: 'Error',
                        message: 'There was an error saving your changes. Please try again.',
                        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1500,
                        classNames: notiicationClasses,
                    });
                }, 5000);
            }
        }
    }

    // save password changes
    async function handleChangePassword() {
        if (user) {
            // show notification
            const id = notifications.show({
                loading: true,
                title: 'Connecting to the server',
                message: 'Please wait.',
                autoClose: false,
                withCloseButton: false,
                classNames: notiicationClasses,
            });

            // TODO: add email verification?
            var response = await PatchUserByUid(user?.uid, passwordForm.values.password_information, session?.access_token);
            if (response === 200) {
                // success
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'teal',
                        title: 'Success',
                        message: 'Your password has been changed.',
                        icon: <IconCheck size="lg" style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1000,
                        classNames: notiicationClasses,
                    });
                }, 500);
            }
            else {
                // error
                setTimeout(() => {
                    notifications.update({
                        id,
                        color: 'red',
                        title: 'Error',
                        message: 'There was an error saving your changes. Please try again.',
                        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                        loading: false,
                        autoClose: 1500,
                        classNames: notiicationClasses,
                    });
                }, 5000);
            }
        }
    }

    // create the hosted url checkout for chargebee
    function handleHostedUrlChange(hostedUrl: string) {
        setHostedUrl(hostedUrl);
        openManagePaymentModal();
    }

    // handle when manage payment button is clicked
    async function handleManagePayment() {
        if (user) {
            if (user?.subscription?.status !== "active" || user?.subscription?.item_price_id === "Free") {
                // we already have an active basic plan
                // show error notification
                notifications.show({
                    color: 'red',
                    title: 'Error',
                    message: "You do not have an active subscription",
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

            setLoading(true);

            var response = await GetChargebeeUpdatePaymentMethodCheckoutUrl(user?.uid, session?.access_token);
            if (response?.status === 200) {
                // get hosted page checkout url
                var hostedUrl = response?.data.url;
                console.log(response?.data.id);
                if (hostedUrl) {
                    handleHostedUrlChange(hostedUrl);
                }
                setLoading(false);
                
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
        setLoading(false);
    }

    function handleOkClick() {
        fetchAuthData();
    }

    // handle when user requests to send email confirmation verify link
    async function handleVerifyEmail() {
        if (!user) return;
        if (user?.confirm_email) return;

        // show notification
        const id = notifications.show({
            loading: true,
            title: 'Connecting to the server',
            message: 'Please wait.',
            autoClose: false,
            withCloseButton: false,
            classNames: notiicationClasses,
        });
        
        var supabase_token: any = await generateRecoveryEmail(user?.email);

        var data = {
            'hashed_token': supabase_token?.properties?.hashed_token,
            'user_uid': user?.uid,
            'redirect': '',
        }

        var response = await EmailVerifyToken(data, session?.access_token);
        if (response === 200) {
            // show success
            setTimeout(() => {
                notifications.update({
                    id,
                    color: 'teal',
                    title: 'Success',
                    message: 'Check your email inbox for a confirmation email.',
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
                    message: 'There was an error. Please try again.',
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 1500,
                    classNames: notiicationClasses,
                });
            }, 5000);
        }
    }

    // card for subscription payment information
    const paymentCard = (
        <>
            <Grid>
                <Grid.Col span={{ base: 12 }}>
                    <Text 
                        size="20px" 
                        style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}
                    >
                        {user?.payment?.card_brand + " ending in " + user?.payment?.card_last4}
                    </Text>
                </Grid.Col>
            </Grid>
        </>
    );

    // card for subscription paypal email
    const paypalEmailCard = (
        <>
            <Grid>
                <Grid.Col span={{ base: 12 }}>
                    <Text 
                        size="20px" 
                        style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}
                    >
                        Paypal email
                    </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                    <Text 
                        size="20px" 
                        style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}
                    >
                        {user?.payment?.paypal_email}
                    </Text>
                </Grid.Col>
            </Grid>
        </>
    );

    const upgradePlanCard = (
        <>
            <Grid>
                <Grid.Col span={{ base: 12 }}>
                    <Text 
                        size="25px" 
                        style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}
                    >
                        Please select a subscription plan to upgrade or contact our support
                    </Text>
                </Grid.Col>
                {/* <Grid.Col span={{ base: 12 }}>
                    <Space h="lg"/>
                    <Button
                        size="lg"
                        radius="md"
                        color="#316F22"
                        fullWidth
                        onClick={() => navigate("/pricing")}
                    >
                        Upgrade plan
                    </Button> 
                </Grid.Col> */}
            </Grid>
        </>
    )

    const subHeadingCard = (
        <>
            <Grid align="center">
                <Grid.Col span={{ base: 5 }}>
                    <Text 
                        //size="25px" 
                        style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}
                    >
                        Auto renewal
                    </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 6 }}>
                    <Badge radius="md" color={user?.subscription?.status === "active" ? "rgba(74,138,42,0.5)" : "rgba(24,28,38,0.3)"} p="lg" pb="lg">
                        <Text 
                            size="lg" 
                            //fw={600} 
                            style={{ fontFamily: "AK-Medium", letterSpacing: "1px", color: "#dcdcdc" }}
                        >
                            {user?.subscription?.status === "active" ? "ON" : "OFF"}
                        </Text>
                    </Badge>
                </Grid.Col>
            </Grid>
        </>
    )

    const planCancelledTitleCard = (
        <>
            <Grid align="center">
                <Grid.Col span={{ base: 5 }}>
                    <Text 
                        //size="25px" 
                        style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}
                    >
                        {subscriptionForm.values.subscription_info.name} 
                    </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 6 }}>
                    <Badge radius="md" color="rgba(24,28,38,0.3)" p="lg" pb="lg">
                        <Text 
                            size="lg" 
                            //fw={600} 
                            style={{ fontFamily: "AK-Medium", letterSpacing: "1px", color: "#dcdcdc" }}
                        >
                            Cancelled
                        </Text>
                    </Badge>
                </Grid.Col>
            </Grid>
        </>
    );

    function handleChangePinCode() {
        // TODO 
    }

    return (
        <>
            {managePaymentModalOpened && (
                <ManagePaymentModal 
                    modalOpened={managePaymentModalOpened}
                    isMobile={isMobile !== undefined? isMobile : false}
                    hostedUrl={hostedUrl}
                    closeModal={closeManagePaymentModal}
                    handleOkClick={handleOkClick}
                />
            )}
            {changePlanModalOpened && (
                <ChangePlanModal 
                    modalOpened={changePlanModalOpened}
                    isMobile={isMobile !== undefined? isMobile : false}
                    closeModal={closeChangePlanModal}
                    handleOkClick={handleOkClick}
                />
            )}
            
            <Tabs variant="pills" radius="md" color="rgba(24,28,38,0.5)" defaultValue="account" orientation={windowWidth < 800 ? "horizontal" : "vertical"}>
                <Tabs.List grow mr={isMobile ? "" : "md"}>
                    <Paper shadow="md" p="lg" mb="lg" radius="lg" style={{ background: "#25352F", width: "100%", color: "#dcdcdc" }}>
                        <Stack gap="xs">
                            <Tabs.Tab style={{ width: "100%" }} value="account" p="md" classNames={inputClasses}>
                                <Text size="20px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Account</Text>
                            </Tabs.Tab>
                            {user?.role === "STAFF" && (
                                <Tabs.Tab style={{ width: "100%" }} value="preferences" p="md" classNames={inputClasses}>
                                    <Text size="20px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Preferences</Text>
                                </Tabs.Tab>
                            )}
                            {user?.role === "STAFF" && (
                                <Tabs.Tab style={{ width: "100%" }} value="employment" p="md" classNames={inputClasses}>
                                    <Text size="20px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Employment</Text>
                                </Tabs.Tab>
                            )}
                            {user?.role === "OWNER" && (
                                <Tabs.Tab style={{ width: "100%" }} value="subscription" p="md" classNames={inputClasses}>
                                    <Text size="20px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Subscription</Text>
                                </Tabs.Tab>
                            )}
                            <Tabs.Tab style={{ width: "100%" }} value="security" p="md" classNames={inputClasses}>
                                <Text size="20px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Security</Text>
                            </Tabs.Tab>
                        </Stack>
                    </Paper>
                </Tabs.List>

                {/* account panel */}
                <Tabs.Panel value="account">
                    <Stack gap="sm">
                        <Paper shadow="md" p="lg" radius="lg" style={{ background: "#25352F", color: "#dcdcdc" }}>
                            <Stack>
                                <Text size="30px" fw={600} style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Personal information</Text>
                                <Grid>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            //value={userData?.first_name} 
                                            label="First name"
                                            placeholder="First name"
                                            size="lg"
                                            required
                                            classNames={classes}
                                            {...personalForm.getInputProps('personal_information.first_name')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="Last name"
                                            placeholder="Last name"
                                            size="lg"
                                            required
                                            classNames={classes}
                                            {...personalForm.getInputProps('personal_information.last_name')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12 }}>
                                        <TextInput
                                            label="Street"
                                            placeholder="Street address"
                                            size="lg"
                                            //required
                                            classNames={classes}
                                            {...personalForm.getInputProps('personal_information.street')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12 }}>
                                        <TextInput
                                            label="Street 2 (optional)"
                                            placeholder="Street address (optional)"
                                            size="lg"
                                            classNames={classes}
                                            {...personalForm.getInputProps('personal_information.street_2')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="City"
                                            placeholder="City"
                                            size="lg"
                                            required
                                            classNames={classes}
                                            {...personalForm.getInputProps('personal_information.city')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        {provinceTextbox && (
                                            <TextInput
                                                required
                                                id="province"
                                                label="Province"
                                                name="province"
                                                placeholder="Enter a province"
                                                size="lg"
                                                classNames={classes}
                                                {...personalForm.getInputProps('personal_information.province')}
                                            >
                                            </TextInput>
                                        )}
                                        {!provinceTextbox && (
                                            <Select
                                                required
                                                allowDeselect={false}
                                                id="province"
                                                label={usaSelected ? "State" : "Province"}
                                                name="province"
                                                placeholder={usaSelected ? "Select a State" : "Select a Province"}
                                                size="lg"
                                                classNames={classes}
                                                data={provinceStateData}
                                                {...personalForm.getInputProps('personal_information.province')}
                                            />
                                        )}
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 4 }}>
                                        <Select
                                            required
                                            id="country"
                                            value={selectedCountry}
                                            onChange={setSelectedCountry}
                                            allowDeselect={false}
                                            placeholder="Select a country"
                                            label="Country"
                                            size="lg"
                                            classNames={classes}
                                            data={countryData}
                                        //{...form.getInputProps('country')}
                                        >
                                        </Select>
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 4 }}>
                                        <TextInput
                                            //required
                                            id="postal-code"
                                            label={usaSelected ? "Zip code" : "Postal code"}
                                            name="postal_code"
                                            placeholder={usaSelected ? "Enter a zip code" : "Enter a postal code"}
                                            size="lg"
                                            classNames={classes}
                                            {...personalForm.getInputProps('personal_information.postal_code')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 4 }}>
                                        <Select
                                            size="lg"
                                            comboboxProps={{ withinPortal: true }}
                                            data={['Male', 'Female', 'Non-binary', 'Undisclosed']}
                                            placeholder="Select"
                                            label="Gender"
                                            classNames={classes}
                                            {...personalForm.getInputProps('personal_information.gender')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12 }}>
                                        <form onSubmit={personalForm.onSubmit(handleSavePersonalInformation, handleError)}>
                                            <Button
                                                size="lg"
                                                radius="md"
                                                color="#316F22"
                                                type="submit"
                                                //onClick={handleSavePersonalInformation}
                                                w={isMobile ? "100%" : "150px"}
                                            >
                                                Save
                                            </Button>
                                        </form>
                                    </Grid.Col>
                                </Grid>
                            </Stack>
                        </Paper>

                        {/* contact information */}
                        <Paper shadow="md" p="lg" radius="lg" style={{ background: "#25352F", color: "#dcdcdc" }}>
                            <Text size="30px" fw={600} style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Contact information</Text>
                            <Grid mt="lg" align="end">
                                <Grid.Col span={{ base: 12, md: 4 }}>
                                    <TextInput
                                        label="Cell number"
                                        placeholder="Cell number"
                                        size="lg"
                                        //required
                                        classNames={classes}
                                        {...contactForm.getInputProps('contact_information.cell_number')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 4 }}>
                                    <TextInput
                                        label="Home number"
                                        placeholder="Home number"
                                        size="lg"
                                        classNames={classes}
                                        {...contactForm.getInputProps('contact_information.home_number')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 4 }}>
                                    <TextInput
                                        label="Work number"
                                        placeholder="Work number"
                                        size="lg"
                                        classNames={classes}
                                        {...contactForm.getInputProps('contact_information.work_number')}
                                    />
                                </Grid.Col>
                                
                                {/* user has not confirmed email */}
                                {!user?.confirm_email && (
                                    <>
                                        <Grid.Col span={{ base: 7, md: 8 }}>
                                            <TextInput
                                                label="Email"
                                                placeholder="Email address"
                                                size="lg"
                                                required
                                                disabled
                                                classNames={classes}
                                                {...contactForm.getInputProps('contact_information.email')}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 5, md: 4 }}>
                                            <Button 
                                                size="lg"
                                                radius="md"
                                                variant="default"
                                                type="submit"
                                                fullWidth
                                                onClick={handleVerifyEmail}
                                            >
                                                Verify email
                                            </Button>
                                        </Grid.Col>
                                    </>
                                )}

                                {/* user has confirmed email */}
                                {user?.confirm_email && (
                                    <>
                                        <Grid.Col span={{ base: 12 }}>
                                            <TextInput
                                                label="Email"
                                                placeholder="Email address"
                                                size="lg"
                                                required
                                                disabled
                                                classNames={classes}
                                                {...contactForm.getInputProps('contact_information.email')}
                                            />
                                        </Grid.Col>
                                    </>
                                )}
                                
                                <Grid.Col span={{ base: 12 }}>
                                    <form onSubmit={personalForm.onSubmit(handleSaveContactInformation, handleError)}>
                                        <Button
                                            size="lg"
                                            radius="md"
                                            color="#316F22"
                                            type="submit"
                                            // onClick={handleSavePersonalInformation}
                                            w={isMobile ? "100%" : "150px"}
                                        >
                                            Save
                                        </Button>
                                    </form>

                                </Grid.Col>
                            </Grid>
                        </Paper>
                    </Stack>
                </Tabs.Panel>

                {/* employment panel */}
                <Tabs.Panel value="employment">
                    <></>
                </Tabs.Panel>

                {/* security panel */}
                <Tabs.Panel value="security">
                    <Stack gap="sm">
                        <Paper shadow="md" p="lg" radius="lg" style={{ background: "#25352F", color: "#dcdcdc" }}>
                            <Stack>
                                <Text size="30px" fw={600} style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Change password</Text>
                                <Grid>
                                    <Grid.Col span={{ base: 12 }}>
                                        <TextInput
                                            label="Current password"
                                            placeholder="********"
                                            type="password"
                                            size="lg"
                                            required
                                            classNames={classes}
                                            {...passwordForm.getInputProps('password_information.old_password')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="New password"
                                            placeholder=""
                                            type="password"
                                            size="lg"
                                            required
                                            classNames={classes}
                                            {...passwordForm.getInputProps('password_information.new_password')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="Confirm new password"
                                            placeholder=""
                                            type="password"
                                            size="lg"
                                            required
                                            classNames={classes}
                                            {...passwordForm.getInputProps('password_information.new_password_confirm')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12 }}>
                                        <form onSubmit={passwordForm.onSubmit(handleChangePassword, handleError)}>
                                            <Button
                                                size="lg"
                                                radius="md"
                                                color="#316F22"
                                                type="submit"
                                                w={isMobile ? "100%" : "150px"}
                                            >
                                                Save
                                            </Button>
                                        </form>
                                    </Grid.Col>
                                </Grid>
                            </Stack>
                        </Paper>
                    </Stack>
                </Tabs.Panel>

                {/* subscription panel */}
                <Tabs.Panel value="subscription">
                    <Stack gap="sm">
                        <Paper shadow="md" p="lg" radius="lg" style={{ background: "#25352F", color: "#dcdcdc"}}>
                            <Stack>
                                <Text 
                                    size="30px" 
                                    fw={600} 
                                    style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}
                                    mb="lg"
                                >
                                    Manage subscription
                                </Text>

                                {/* valid subscription active */}
                                {user?.subscription && (
                                    <Grid>
                                        <Grid.Col span={{ base: 12, md: 4 }}>
                                            {(user?.subscription?.status === "cancelled" || user?.subscription?.status === "non_renewing") && (
                                                <InfoCard 
                                                    button={true} 
                                                    title="Current plan" 
                                                    description={planCancelledTitleCard} 
                                                    subHeading={"$" + user?.payment?.txn_amount + " / month"}
                                                    backgroundColor="#374842"
                                                    buttonText="Change plan"
                                                    buttonColor="#1F282A"
                                                    buttonOnClick={openChangePlanModal}
                                                />
                                            )}
                                            {user?.subscription?.status === "active" && (
                                                <InfoCard 
                                                    button={true} 
                                                    title="Current plan" 
                                                    description={subscriptionForm.values.subscription_info.name} 
                                                    subHeading={"$" + user?.payment?.txn_amount + " / month"}
                                                    backgroundColor="#374842"
                                                    buttonText="Change plan"
                                                    buttonColor="#1F282A"
                                                    buttonOnClick={openChangePlanModal}
                                                />
                                            )}
                                            
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, md: 4 }}>
                                            <InfoCard 
                                                button={true} 
                                                title="Next billing date" 
                                                description={formatTimestampMonthDayYear(subscriptionForm.values.subscription_info.next_billing_at != undefined ? subscriptionForm.values.subscription_info.next_billing_at : getCurrentTimestamp())} 
                                                backgroundColor="#374842"
                                                //subHeading="Auto Renewal: ON"
                                                subHeading={subHeadingCard}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, md: 4 }}>
                                            {user?.payment && (user?.payment.payment_type === "card" || user?.payment.payment_type === "apple_pay") && (
                                                <InfoCard 
                                                    button={true} 
                                                    title="Payment method" 
                                                    description={paymentCard}
                                                    backgroundColor="#374842"
                                                    subHeading={"Expiry " + user?.payment.card_expiry_month + "/" + user?.payment.card_expiry_year}
                                                    buttonText="Manage payment"
                                                    buttonColor="#1F282A"
                                                    buttonOnClick={handleManagePayment}
                                                />
                                            )}

                                            {user?.payment && user?.payment.payment_type === "paypal_express_checkout" && (
                                                <InfoCard 
                                                    button={true} 
                                                    title="Payment information" 
                                                    description={paypalEmailCard}
                                                    backgroundColor="#374842"
                                                    buttonText="Manage payment"
                                                    buttonColor="#1F282A"
                                                />
                                            )}

                                            {!user?.payment && (
                                                <InfoCard 
                                                    button={true} 
                                                    title="Payment information" 
                                                    description="None"
                                                    subHeading="Please add a new payment method"
                                                    backgroundColor="#374842"
                                                    buttonText="Manage payment"
                                                    buttonColor="#1F282A"
                                                />
                                            )}
                                            
                                        </Grid.Col>
                                    </Grid>
                                )}

                                {/* no subscription -- free plan */}
                                {!user?.subscription && (
                                    <Grid>
                                        <Grid.Col span={{ base: 12, md: 6 }}>
                                            <InfoCard
                                                button={true}
                                                title="Current plan"
                                                description="Free"
                                                subHeading="$0 / month"
                                                backgroundColor="#374842"
                                                buttonText="Plan details"
                                                buttonColor="#1F282A"
                                                buttonOnClickNavigate="/pricing"
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, md: 6 }}>
                                            <InfoCard
                                                button={true}
                                                title="Upgrade plan"
                                                description="Select a plan to upgrade"
                                                backgroundColor="#374842"
                                                subHeading="Monthly or yearly subscription"
                                                buttonText="Upgrade plan"
                                                buttonColor="#336E1E"
                                                buttonOnClickNavigate="/pricing"
                                            />
                                        </Grid.Col>
                                    </Grid>
                                )}
                            </Stack>
                        </Paper>
                    </Stack>
                </Tabs.Panel>

                {/* preferences panel */}
                <Tabs.Panel value="preferences">
                    <></>
                </Tabs.Panel>
            </Tabs>
        </>
    );
}