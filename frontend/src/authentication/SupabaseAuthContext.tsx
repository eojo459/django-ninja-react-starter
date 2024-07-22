import { Session, User } from '@supabase/supabase-js';
import { useContext, useState, useEffect, createContext } from 'react';
import { supabase, useSupabase } from './SupabaseContext';
import { useNavigate } from 'react-router-dom';
import { GetAuthUserEmailByUid, GetOwnerPayment, GetOwnerSubscription, getUserByUid } from '../helpers/Api';
import { Subscription, UserProfileModel } from '../pages/main/AppHome';
import { Group, Loader } from '@mantine/core';
import React from 'react';
import { isObjectEmpty } from '../helpers/Helpers';
import { useMediaQuery } from '@mantine/hooks';

// create a context for authentication
const SupabaseAuthContext = createContext<{ 
    session: Session | null | undefined, 
    user: UserProfileModel | null | undefined, 
    localStorageData: string,
    isMobile: boolean | undefined,
    signOut: () => void,
    setUser: (user: UserProfileModel | null) => void,
    setLocalStorageData: (data: string) => void,
    fetchAuthData: () => void,
}>({ session: null, user: null, localStorageData: '', isMobile: false, signOut: () => { }, setUser: () => { }, setLocalStorageData: () => { }, fetchAuthData: () => { }});

export const SupabaseAuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserProfileModel | null>(null);
    const [localStorageData, setLocalStorageData] = useState("");
    const {signInUser, setIsNewUser, setIsManager, setOnboarding} = useSupabase();
    const [session, setSession] = useState<Session | null>(null);
    //const { loading, setLoading } = useNavigationContext();
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(true);
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 50em)');

    useEffect(() => {
        //let isMounted = true;

        // get session
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setSession(session);
            }
        });

        // fetch auth data
        fetchAuthData();

        return () => {
            //isMounted = false;
            setIsMounted(false);
            listener?.subscription.unsubscribe();
        };
    }, []);

    // useEffect(() => {
    //     // fetch auth data
    //     fetchAuthData();
    // },[session]);

    // fetch auth data whenever context changes / navigation changes
    async function fetchAuthData() {
        try {
            const { data: { session: authSession } } = await supabase.auth.getSession();
            if (authSession) {
                setSession(authSession);
                
                // check if we have an active business in local storage first
                var localStorageData: any = localStorage.getItem('data');
                if (localStorageData != null && localStorageData !== 'undefined') {
                    var localStorageDataJson = JSON.parse(localStorageData);
                }
                else {
                    localStorage.setItem("data", JSON.stringify(localStorageData));
                }
                
                setLocalStorageData(localStorageData);

                // get user info
                var userInfo = await getUserByUid(authSession.user?.id, authSession.access_token); 

                if (!userInfo?.active) {
                    // if account is not active auto logout
                    navigate('/logout');
                    return;
                }

                // check for subscription/payment info
                // if (userInfo?.role === 'USER') {
                //     // get subscription info
                //     var userSubscription = await GetOwnerSubscription(userInfo?.uid, authSession?.access_token);

                //     // get payment info
                //     var payment = await GetOwnerPayment(userInfo?.uid, authSession?.access_token);
                // }
                
                // setup user info to be saved/cached
                const newUser: UserProfileModel = {
                    local_storage_data: localStorageData,
                    //subscription: userSubscription,
                    //payment: payment,
                    uid: authSession.user?.id || "",
                    email: authSession.user?.email || "",
                    username: userInfo?.username || "",
                    cell_number: userInfo?.cell_number || "",
                    role: userInfo?.role || "",
                    first_name: userInfo?.first_name,
                    last_name: userInfo?.last_name,
                    street: userInfo?.street,
                    street_2: userInfo?.street_2,
                    city: userInfo?.city,
                    province: userInfo?.province,
                    country: userInfo?.country,
                    postal_code: userInfo?.postal_code,
                    gender: userInfo?.gender,
                    date_joined: userInfo?.date_joined,
                    active: userInfo?.active,
                    plan: userInfo?.plan_id,
                    confirm_email: userInfo?.confirm_email,
                    pending_approval: userInfo?.pending_approval,
                };

                setUser(newUser);
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    const value = {
        session: session,
        user: user,
        localStorageData: localStorageData,
        isMobile: isMobile,
        setUser,
        setLocalStorageData,
        signOut: () => supabase.auth.signOut(),
        fetchAuthData,
    };

    return (
        <SupabaseAuthContext.Provider value={value}>
            {loading ? <Group justify="center">
                            <Loader mt="25%" color="cyan" />
                        </Group> 
                    : children}
        </SupabaseAuthContext.Provider>
    );
};

// export the useAuth hook
export const useAuth = () => {
    return useContext(SupabaseAuthContext);
};