import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../authentication/SupabaseAuthContext';
import { userLinks } from '../components/SimpleHeader';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { GetStaffNotificationMessages } from '../helpers/Api';
import { useSupabase } from '../authentication/SupabaseContext';

// Define the type for the context
type NavigationContextType = {
    active: string;
    appMenuPanelActive: boolean;
    profilePanelActive: boolean;
    settingsPanelActive: boolean;
    notificationMessages: boolean;
    setActive: React.Dispatch<React.SetStateAction<string>>;
    setAppMenuPanelActive: React.Dispatch<React.SetStateAction<boolean>>;
    setProfilePanelActive: React.Dispatch<React.SetStateAction<boolean>>;
    setSettingsPanelActive: React.Dispatch<React.SetStateAction<boolean>>;
    setNotificationMessages: React.Dispatch<React.SetStateAction<boolean>>;
    getNotifications: () => void;
};

// Create the context
const NavigationContext = createContext<NavigationContextType>({
    active: "",
    appMenuPanelActive: false,
    profilePanelActive: false,
    settingsPanelActive: false,
    notificationMessages: false,
    setActive: () => { },
    setAppMenuPanelActive:() => { },
    setProfilePanelActive: () => { },
    setSettingsPanelActive: () => { },
    setNotificationMessages: () => {},
    getNotifications: () => {},
});

// Create a provider component
export const NavigationProvider = ({ children }: any) => {
    const { user, session, fetchAuthData } = useAuth();
    const { isManager } = useSupabase();
    const [active, setActive] = useState(user?.role == "USER" ? userLinks[0].link : '');
    const [profilePanelActive, setProfilePanelActive] = useState(false);
    const [settingsPanelActive, setSettingsPanelActive] = useState(false);
    const [appMenuPanelActive, setAppMenuPanelActive] = useState(false);
    const [url, setUrl] = useState(window.location.href);
    const navigate = useNavigate();
    const [notificationMessages, setNotificationMessages] = useState(false);
    //const [loading, setLoading] = useState(false);

    // run when active page changes
    useEffect(() => {
        // TODO: when the navigation panels are clicked, make sure you are on the dashboard page first
        setUrl(window.location.href);
        fetchAuthData();
        console.log(url);
        console.log(active);
        var page = checkUrl();
        // if (page !== "dashboard") {
        //     navigate("/dashboard");
        // }

        switch (active) {
            case "menu":
                setAppMenuPanelActive(true);
                setProfilePanelActive(false);
                setSettingsPanelActive(false);
                break;
            case "profile":
                setProfilePanelActive(true);
                setAppMenuPanelActive(false);
                setSettingsPanelActive(false);
                break;
            case "settings":
                setSettingsPanelActive(true);
                setProfilePanelActive(false);
                setAppMenuPanelActive(false);
                break;
            case "":
                setAppMenuPanelActive(true);
                setProfilePanelActive(false);
                setSettingsPanelActive(false);
                break;
            default:
                break;
        }

        // get notifications
        getNotifications();
    }, [active]);

    function checkUrl() {
        const myUrl = new URL(url);
        const path = myUrl.pathname;
        console.log(path);
        return path.split('/')[1];
    }

    async function getNotifications() {
        if (user) {
            var notifications = await GetStaffNotificationMessages(user?.uid, session?.access_token);
            if (notifications?.length > 0) {
                setNotificationMessages(true);
                return true;
            }
        }
        return false;
    }

    // Provide the context value
    const contextValue: NavigationContextType = {
        active,
        appMenuPanelActive,
        profilePanelActive,
        settingsPanelActive,
        notificationMessages: notificationMessages,
        setActive,
        setAppMenuPanelActive,
        setProfilePanelActive,
        setSettingsPanelActive,
        setNotificationMessages: setNotificationMessages,
        getNotifications,
    };

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    );
};

// Create a custom hook for accessing the context
export const useNavigationContext = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useChangesContext must be used within a ChangesProvider');
    }
    return context;
};
