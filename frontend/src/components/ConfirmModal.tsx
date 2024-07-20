import { Button, Space, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import GeolocationModal from './GeolocationModal';
import { Collection, Feature, Map as OLMap, Overlay, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import classes from "../css/UserProfileModal.module.css";

interface DeleteModalProps {
    onDeleteConfirm: (confirm: boolean) => void;
}

interface UnsavedChangesModalProps {
    onDeleteConfirm: (confirm: boolean) => void;
}

interface IConfirmModalProps {
    onConfirm: (confirm: boolean) => void;
}

// modal to confirm deletion
export function ConfirmDeleteModal({ onDeleteConfirm }: DeleteModalProps) {
    useEffect(() => { 
        console.log("Open modal");
        modals.openConfirmModal({
            title: (<Text c="#dcdcdc" size="30px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Confirm your action</Text>),
            children: (
                <>
                    <Text 
                        mb="lg"
                        size="lg" 
                        c="#dcdcdc" 
                        fw={600} 
                        style={{ fontFamily: "AK-Regular", letterSpacing: "1px" }}
                    >
                        Are you sure you want to delete this?
                    </Text>
                </>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            closeOnCancel: true,
            closeOnConfirm: true,
            classNames: classes,
            groupProps: { justify: "space-between" },
            confirmProps: { color: '#F55A54', size: "lg", radius: "md" },
            cancelProps: { color: '#25352F', size: "lg", radius: "md" },
            onCancel: () => {
                modals.closeAll();
                onDeleteConfirm(false);
            },
            onConfirm: () => {
                modals.closeAll();
                onDeleteConfirm(true);
            },
        });
    },[]);
    return null;
}

// modal to confirm losing unsaved changes
export async function ConfirmUnsavedChangesModal({ onDeleteConfirm }: UnsavedChangesModalProps) {
    return new Promise((resolve) => {
        modals.openConfirmModal({
            title: (<Text c="#dcdcdc" size="30px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Confirm your action</Text>),
            children: (
                <>
                    <Text 
                        mb="lg"
                        size="lg" 
                        c="#dcdcdc" 
                        fw={600} 
                        style={{ fontFamily: "AK-Regular", letterSpacing: "1px" }}
                    >
                        You have unsaved changes. Do you want to discard them?
                    </Text>
                </>
            ),
            labels: { confirm: 'Discard', cancel: 'Cancel' },
            closeOnCancel: true,
            closeOnConfirm: true,
            classNames: classes,
            groupProps: { justify: "space-between" },
            confirmProps: { color: '#316F22', size: "lg", radius: "md" },
            cancelProps: { color: '#25352F', size: "lg", radius: "md" },
            onCancel: () => {
                modals.closeAll();
                onDeleteConfirm(false);
                resolve(false);
            },
            onConfirm: () => {
                modals.closeAll();
                onDeleteConfirm(true);
                resolve(true);
            },
        });
    });
}

// modal to confirm cancelling current subscription and upgrading to a new subscription
export async function ConfirmSubscriptionChangeUpgradeModal({ onConfirm }: IConfirmModalProps) {
    return new Promise((resolve) => {
        modals.openConfirmModal({
            title: (<Text c="#dcdcdc" size="30px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Confirm your action</Text>),
            children: (
                <>
                    <Text 
                        size="lg" 
                        c="#dcdcdc"
                        fw={600} 
                        style={{ fontFamily: "AK-Regular", letterSpacing: "1px" }}
                    >
                        Are you sure you want to cancel your current subscription and purchase this new subscription?
                    </Text>
                    <Text 
                        mb="lg"
                        size="lg" 
                        c="#dcdcdc" 
                        fw={600} 
                        style={{ fontFamily: "AK-Regular", letterSpacing: "1px" }}
                    >
                        ?
                    </Text>
                </>
            ),
            size: "md",
            labels: { confirm: 'Confirm', cancel: 'Back' },
            classNames: classes,
            closeOnCancel: true,
            closeOnConfirm: true,
            groupProps: { justify: "space-between" },
            confirmProps: { color: '#316F22', size: "lg", radius: "md" },
            cancelProps: { color: '#25352F', size: "lg", radius: "md" },
            onCancel: () => {
                modals.closeAll();
                onConfirm(false);
                resolve(false);
            },
            onConfirm: () => {
                modals.closeAll();
                onConfirm(true);
                resolve(true);
            },
        });
    });
}

// modal to confirm cancelling current subscription and down-grading to a new subscription
export async function ConfirmSubscriptionChangeDowngradeModal() {
    return new Promise((resolve) => {
        modals.openConfirmModal({
            title: (<Text c="#dcdcdc" size="30px" style={{ fontFamily: "AK-Medium", letterSpacing: "1px" }}>Confirm your action</Text>),
            children: (
                <>
                    <Text 
                        size="lg" 
                        c="#dcdcdc"
                        fw={600} 
                        style={{ fontFamily: "AK-Regular", letterSpacing: "1px" }}
                    >
                        Are you sure you want to cancel your current subscription and purchase this new subscription?
                    </Text>
                    <Space h="md"/>
                    <Text 
                        mb="lg"
                        size="lg" 
                        c="#dcdcdc" 
                        fw={600} 
                        style={{ fontFamily: "AK-Regular", letterSpacing: "1px" }}
                    >
                        You will lose access to the features only available to your current subscription plan.
                    </Text>
                </>
            ),
            size: "lg",
            labels: { confirm: 'Confirm', cancel: 'Back' },
            classNames: classes,
            closeOnCancel: true,
            closeOnConfirm: true,
            groupProps: { justify: "space-between" },
            confirmProps: { color: '#316F22', size: "lg", radius: "md" },
            cancelProps: { color: '#25352F', size: "lg", radius: "md" },
            onCancel: () => {
                modals.closeAll();
                //onConfirm(false);
                resolve(false);
            },
            onConfirm: () => {
                modals.closeAll();
                //onConfirm(true);
                resolve(true);
            },
        });
    });
}