import { Avatar, Badge, Button, Group, Modal, Stack, Table, TextInput, Textarea, Title, Text, ScrollArea, Space, Paper, Grid } from "@mantine/core";
import { useState } from "react";
import { randomId } from "@mantine/hooks";
import { ContactUsForm } from "./ContactUsForm";
import classes from "../css/UserProfileModal.module.css";

interface IContactUsModal {
    modalOpened: boolean;
    isMobile: boolean;
    subject?: string;
    message?: string;
    closeModal: () => void;
}

export default function ContactUsModal(props: IContactUsModal) {

    // setup props
    const modalOpenedProp = props.modalOpened;
    const isMobileProp = props.isMobile;
    const subjectProp = props.subject;
    const messageProp = props.message;
    const closeModalProp = props.closeModal;

    return (
        <>
            <Modal
                opened={modalOpenedProp}
                onClose={closeModalProp}
                fullScreen={isMobileProp}
                size="xl"
                radius="md"
                transitionProps={{ transition: 'fade', duration: 200 }}
                withCloseButton={false}
                classNames={classes}
            >
                <ContactUsForm 
                    subject={subjectProp}
                    message={messageProp}
                />
                <Space h="lg"/>
                <Button 
                    fullWidth 
                    size="lg" 
                    radius="md" 
                    variant="light"
                    color="gray"
                    onClick={closeModalProp}
                >
                    Close
                </Button>
            </Modal>
        </>
    );
}