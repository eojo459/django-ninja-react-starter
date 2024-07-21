import { Avatar, Badge, Button, Grid, Group, Loader, Modal, Stack, Table, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAuth } from '../authentication/SupabaseAuthContext';
import "../css/ChargebeeCheckoutModal.scss";
import classes from "../css/UserProfileModal.module.css";
//import { getStatusColor } from '../../../helpers/Helpers';

interface IChargebeeCheckoutModal {
    modalOpened: boolean;
    isMobile: boolean;
    hostedUrl: string;
    closeModal: () => void;
    // handleUnassignedClick: () => void;
    // handleDeleteClick: () => void;
}

export default function ChargebeeCheckoutModal(props: IChargebeeCheckoutModal) {
    const { user, session } = useAuth(); 

    useEffect(() => {
        // TODO: if we are not redirected, constantly ping the hosted url endpoint to check its state & manually redirect
    },[]);
    
    // setup props
    const modalOpenedProp = props.modalOpened;
    const isMobileProp = props.isMobile;
    const closeModalProp = props.closeModal;
    const hostedUrlProp = props.hostedUrl;

    return (
        <>
            <Modal
                title={<Text c="#dcdcdc" size="30px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Subscription purchase</Text>}
                opened={modalOpenedProp}
                onClose={closeModalProp}
                fullScreen={isMobileProp}
                size="lg"
                radius="md"
                //withCloseButton={false}
                classNames={classes}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <Grid c="#dcdcdc">
                    <Grid.Col span={{ base: 12 }}>
                        <Text size="xl" fw={500}>Please follow the instructions</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <iframe
                            className='iframe-chargebee'
                            src={hostedUrlProp}
                            title="Chargebee Checkout"
                            width="100%"
                            height={600}
                        ></iframe>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <Text ta="center" size="md" fw={500}>Questions or concerns contact our support</Text>
                        <Text ta="center" size="md" fw={500}>support@website.com</Text>
                    </Grid.Col>
                </Grid>
            </Modal>
        </>
    );
}