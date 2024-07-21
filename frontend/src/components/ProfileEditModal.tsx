import { Button, Grid, Group, Modal, Select, TextInput, Title, Text, rem, NumberInput, Switch, useMantineTheme } from "@mantine/core";
import { canadaProvinceData, countryData, genderSelectData, usaStateData } from "../helpers/SelectData";
import classes from "../css/TextInput.module.css";
import { UserProfileModel } from "../pages/main/AppHome";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { FormProvider } from "antd/es/form/context";
import { formatDate, isNullOrEmpty } from "../helpers/Helpers";
import { PatchUserByUid } from "../helpers/Api";
import { useAuth } from "../authentication/SupabaseAuthContext";
import classes2 from "../css/ProfileEditModal.module.css";
import { notifications } from "@mantine/notifications";
import notiicationClasses from "../css/Notifications.module.css";
import { IconCheck, IconX } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { theme } from "antd";

interface IProfileEditModal {
    user: UserProfileModel;
    modalOpened: boolean;
    isMobile: boolean;
    closeModal: () => void;
    formSubmitted: (submitFlag: boolean) => void;
    //userProfileData: (reason: string) => void; // get user profile data from parent
}

export default function ProfileEditModal(props: IProfileEditModal) {
    const { user, session } = useAuth();
    const theme = useMantineTheme();
    const [selectedCountry, setSelectedCountry] = useState<string | null>('');
    const [provinceStateData, setProvinceStateData] = useState(canadaProvinceData);
    const [usaSelected, setUsaSelected] = useState(false);
    const [provinceTextbox, setProvinceTextbox] = useState(true);
    const [holidayChecked, setHolidayChecked] = useState(true);
    const [overtimeChecked, setOvertimeChecked] = useState(false);
    const [vacationChecked, setVacationChecked] = useState(false);
    const [sickLeaveChecked, setSickLeaveChecked] = useState(false);
    const [isManagerChecked, setIsManagerChecked] = useState(false);
    const [isSalariedChecked, setIsSalariedChecked] = useState(false);
    const [isFulltimeChecked, setIsFulltimeChecked] = useState(false);
    const [isActiveChecked, setIsActiveChecked] = useState(false);
    const [payRate, setPayRate] = useState<string | number>(0);
    const [selectedEmploymentType, setSelectedEmploymentType] = useState<string | null>();
    const [selectedPositionLabel, setSelectedPositionLabel] = useState<string | null>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [positionSelectData, setPositionSelectData] = useState<any[]>([]);

    // setup props
    const modalOpenedProp = props.modalOpened;
    const isMobileProp = props.isMobile;
    const closeModalProp = props.closeModal;
    const userDataProp = props.user;
    const formSubmittedProp = props.formSubmitted;

    // form fields for mantine components
    const form = useForm({
        initialValues: {
            first_name: userDataProp ? userDataProp.first_name : '',
            last_name: userDataProp ? userDataProp.last_name : '',
            street: userDataProp ? userDataProp.street : '',
            street_2: userDataProp ? userDataProp.street_2 : '',
            city: userDataProp ? userDataProp.city : '',
            country: userDataProp ? userDataProp.country : '',
            province: userDataProp ? userDataProp.province : '',
            postal_code: userDataProp ? userDataProp.postal_code : '',
            cell_number: userDataProp ? userDataProp.cell_number : '',
            email: userDataProp ? userDataProp.email : '',
            //dirty: false,
            gender: userDataProp ? userDataProp.gender : '',
            username: userDataProp ? userDataProp.username : '',
            password: '',
            is_manager: isManagerChecked,
            active: userDataProp ? userDataProp.active : false,
        },
        // validate: (value) => {
        //     return {
        //         first_name: value.staff_info.first_name.trim().length <= 0 ? 'First name is required' : null,
        //         last_name: value.staff_info.last_name.trim().length <= 0 ? 'Last name is required' : null,
        //         position: value.staff_info.position.employment_type_id.trim().length <= 0 ? 'Position is required' : null,
        //         gender: value.staff_info.gender.trim().length <= 0 ? 'Gender is required' : null,
        //     }
        // }
    });


    useEffect(() => {
        console.log('form');
        console.log(form.values);
        handleStateLoad();
    }, []);

    useEffect(() => {
        if (!isNullOrEmpty(selectedCountry) && selectedCountry != null) {
            console.log(selectedCountry);
            form.values.country = selectedCountry;

            switch (selectedCountry) {
                case "Canada":
                    form.values.province = '';
                    form.values.postal_code = '';
                    setProvinceStateData(canadaProvinceData);
                    setUsaSelected(false);
                    setProvinceTextbox(false);
                    break;
                case "United States":
                    form.values.province = '';
                    form.values.postal_code = '';
                    setProvinceStateData(usaStateData);
                    setUsaSelected(true);
                    setProvinceTextbox(false);
                    break;
                default:
                    // show regular textbox
                    form.values.province = '';
                    form.values.postal_code = '';
                    setUsaSelected(false);
                    setProvinceTextbox(true);
                    break;
            }
        }
    }, [selectedCountry]);

    // handle when submit button is clicked
    async function handleSubmit() {
        // notification
        const id = notifications.show({
            loading: true,
            title: 'Connecting to the server',
            message: 'Please wait.',
            autoClose: false,
            withCloseButton: false,
            classNames: notiicationClasses,
        });

        // if (form.isDirty('email')) {
        //     form.setFieldValue('dirty', true);
        // }

        // patch user info (personal & contact info)
        var response = await PatchUserByUid(userDataProp.uid, form.values, session?.access_token);
        if (response !== 200) {
            // error
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
            }, 5000);
            return;
        }

        formSubmittedProp(true);
        closeModalProp();
    }

    function handleStateLoad() {
        if (userDataProp) {
            setIsActiveChecked(userDataProp?.active);
            setSelectedCountry(userDataProp?.country);
        }
    }

    // update form when active status changes
    function handleActiveStatusChange(checked: boolean) {
        setIsActiveChecked(checked);
        form.setFieldValue('active', checked);
    }

    return (
        <>
            <Modal
                opened={modalOpenedProp}
                onClose={closeModalProp}
                title={<Text c="#dcdcdc" size="30px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Edit profile</Text>}
                fullScreen={isMobileProp}
                size="60%"
                radius="md"
                classNames={classes2}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <Grid c="#dcdcdc" justify="end">
                    <Grid.Col span={{ base: 12 }} mt="lg">
                        <Text size="30px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Account status</Text>
                    </Grid.Col>

                    {/* account status */}
                    <Grid.Col span={{ base: 12 }}>
                        <Group justify="space-between" wrap="nowrap" gap="xl">
                            <div>
                                {/* <Text size="20px" style={{ fontFamily: "AK-Medium" }}>Account status</Text> */}
                                <Text size="md" c="dimmed" mt="sm">
                                    {userDataProp?.first_name ?? "User"}'s account is set to ACTIVE and will be able to login and perform staff activities. Disabling this option will disable this user's account and prevent them from logging in.
                                </Text>
                            </div>
                            <Switch
                                checked={isActiveChecked}
                                onChange={(event) => {
                                    handleActiveStatusChange(event.currentTarget.checked);
                                }}
                                offLabel="DISABLED"
                                onLabel="ACTIVE"
                                color="#4a8a2a"
                                size="xl"
                                //label={<Text size="xl" fw={700}>Holiday</Text>}
                                thumbIcon={
                                    isActiveChecked ? (
                                        <IconCheck
                                            style={{ width: rem(12), height: rem(12) }}
                                            color={theme.colors.teal[6]}
                                            stroke={3}
                                        />
                                    ) : (
                                        <IconX
                                            style={{ width: rem(12), height: rem(12) }}
                                            color={theme.colors.red[6]}
                                            stroke={3}
                                        />
                                    )
                                }
                            />
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12 }} mt="lg">
                        <Text size="30px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Personal information</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                            label="First name"
                            placeholder="First name"
                            size="lg"
                            required
                            classNames={classes}
                            {...form.getInputProps('first_name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                            label="Last name"
                            placeholder="Last name"
                            size="lg"
                            required
                            classNames={classes}
                            {...form.getInputProps('last_name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Select
                            id="gender"
                            allowDeselect={false}
                            placeholder="Gender"
                            label="Gender"
                            size="lg"
                            classNames={classes}
                            data={genderSelectData}
                            {...form.getInputProps('gender')}
                        >
                        </Select>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }} mt="lg">
                        <Text size="30px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Contact information</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <TextInput
                            label="Street"
                            placeholder="Street address"
                            size="lg"
                            required
                            classNames={classes}
                            {...form.getInputProps('street')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <TextInput
                            label="Street 2 (optional)"
                            placeholder="Street address"
                            size="lg"
                            classNames={classes}
                            {...form.getInputProps('street_2')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="City"
                            placeholder="City"
                            size="lg"
                            required
                            classNames={classes}
                            {...form.getInputProps('city')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        {provinceTextbox && (
                            <TextInput
                                required
                                id="province"
                                label="Province"
                                name="province"
                                placeholder="Province"
                                size="lg"
                                classNames={classes}
                                {...form.getInputProps('province')}
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
                                placeholder={usaSelected ? "State" : "Province"}
                                size="lg"
                                classNames={classes}
                                data={provinceStateData}
                                {...form.getInputProps('province')}
                            />
                        )}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                            required
                            id="country"
                            value={selectedCountry}
                            onChange={setSelectedCountry}
                            allowDeselect={false}
                            placeholder="Country"
                            label="Country"
                            size="lg"
                            classNames={classes}
                            data={countryData}
                        //{...form.getInputProps('country')}
                        >
                        </Select>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            required
                            id="postal-code"
                            label={usaSelected ? "Zip code" : "Postal code"}
                            name="postal_code"
                            placeholder={usaSelected ? "Zip code" : "Postal code"}
                            size="lg"
                            classNames={classes}
                            {...form.getInputProps('postal_code')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                            label="Cell number"
                            placeholder="Cell number"
                            size="lg"
                            required
                            classNames={classes}
                            {...form.getInputProps('cell_number')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                            label="Home number"
                            placeholder="Home number"
                            size="lg"
                            classNames={classes}
                            {...form.getInputProps('home_number')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                            label="Work number"
                            placeholder="Work number"
                            size="lg"
                            classNames={classes}
                            {...form.getInputProps('work_number')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <TextInput
                            label="Email"
                            placeholder="Email address"
                            size="lg"
                            required
                            classNames={classes}
                            {...form.getInputProps('email')}
                        />
                    </Grid.Col>
                    
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <DatePickerInput
                            label="Start date"
                            required
                            placeholder=""
                            size="lg"
                            value={startDate}
                            onChange={setStartDate}
                            classNames={classes}
                            //{...staffWorkingHoursForm.getInputProps('start_date')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Button.Group style={{ alignItems: "end"}}>
                            <DatePickerInput
                                label="End date (optional)"
                                placeholder=""
                                size="lg"
                                value={endDate}
                                onChange={setEndDate}
                                classNames={classes}
                                style={{ width: "100%"}}
                                //{...staffWorkingHoursForm.getInputProps('end_date')}
                            />
                            <Button
                                color="rgba(110, 30, 30,1)"
                                //fullWidth
                                size="lg"
                                radius="md"
                                style={{ borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px" }}
                                onClick={() => setEndDate(null)}
                            >
                                <Text size="20px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>X</Text>
                            </Button>
                        </Button.Group>
                        
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }} mt="lg">
                        <Group grow>
                            <Button
                                size="lg"
                                radius="md"
                                color="#316F22"
                                onClick={handleSubmit}
                            >
                                Save changes
                            </Button>
                            <Button
                                size="lg"
                                radius="md"
                                color="#3b5b4c"
                                onClick={closeModalProp}
                            >
                                Close
                            </Button>
                        </Group>

                    </Grid.Col>
                </Grid>
            </Modal>
        </>
    );
}