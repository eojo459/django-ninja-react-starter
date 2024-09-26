import { AuthSession, createClient } from '@supabase/supabase-js'
import LogoutCard from '../components/LogoutCard';
import { Navigate, NavigateFunction, useNavigate } from 'react-router-dom';
import { CheckUsers, GetAuthUserEmailByUsername, GetOwnerPayment, GetOwnerSubscription, getUserByUid, LoginUser, PostNewUser } from '../helpers/Api';
import { useAuth } from './SupabaseAuthContext';
import { useNavigationContext } from '../context/NavigationContext';
import { UserProfileModel } from '../pages/main/AppHome';
import { createContext, useContext, useState } from 'react';
import { notifications } from "@mantine/notifications";
import notiicationClasses from "../css/Notifications.module.css";
import { IconX } from '@tabler/icons-react';
import { rem } from '@mantine/core';
import { isObjectEmpty } from '../helpers/Helpers';
//import bcrypt from "bcrypt";


// Create a single supabase client for interacting with your database
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY;
export const supabase = createClient('https://cmkoomcgbmueihzpvtck.supabase.co', supabaseKey!)
const supabase_admin = createClient('https://cmkoomcgbmueihzpvtck.supabase.co', supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
});
  

// create a context for authentication
const SupabaseContext = createContext<{  
    isNewUser: boolean,
    onboarding: boolean,
    isManager: boolean,
    isActive: boolean,
    setIsNewUser: (value: boolean) => void,
    setOnboarding: (value: boolean) => void,
    setIsManager: (value: boolean) => void,
    setIsActive: (value: boolean) => void,
    signInUser: (form: any, navigate: NavigateFunction) => Promise<any>,
    signUpNewUser: (form: any, userType: string, navigate: NavigateFunction) => Promise<boolean>,
    signOutUser: (navigate: NavigateFunction) => void,
    generateRecoveryEmail: (email: string) => void,
    updateUserEmail: (form: any) => Promise<any>,
    updateUserPassword: (form: any) => Promise<any>,
}>({ isNewUser: false, onboarding: false, isManager: false, isActive: false, 
    setIsNewUser: () => false, signInUser: async () => false, signUpNewUser: async () => false, 
    signOutUser: () => { }, setIsActive: () => { }, setIsManager: () => { }, setOnboarding: () => {},
    generateRecoveryEmail: () => {}, updateUserEmail: async () => false, updateUserPassword: async () => false});

export const SupabaseContextProvider = ({ children }: any) => {
    const { user, setUser, session } = useAuth();
    const [isNewUser, setIsNewUser] = useState(false);
    const [onboarding, setOnboarding] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // SIGN UP NEW USER
    // signs up a new user on django and supabase
    async function signUpNewUser(form: any, userType: string, navigate: NavigateFunction) {

        // check if username already exists
        var usernameData = { 'username': form.username }
        var usernameExists = await CheckUsers(usernameData);
        if (usernameExists !== 200) {
            // show error
            setTimeout(() => {
                notifications.show({
                    color: 'red',
                    title: 'Error',
                    message: 'The username already exists',
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 5000,
                    classNames: notiicationClasses,
                });
            }, 2000);
            return false;
        }

        // check if email already exists
        var emailData = { 'email': form.email }
        var emailExists = await CheckUsers(emailData);
        if (emailExists !== 200) {
            // show error
            setTimeout(() => {
                notifications.show({
                    color: 'red',
                    title: 'Error',
                    message: 'The email already exists',
                    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                    loading: false,
                    autoClose: 5000,
                    classNames: notiicationClasses,
                });
            }, 2000);
            return false;
        }

        // create new auth user in supabase
        // const {data: authData, error: authError } = await supabase.auth.signUp({
        //     email: form.email,
        //     password: form.password,
        //     options: {
        //         data: {
        //             username: form.username,
        //             cell_number: form.cell_number,
        //             role: userType,
        //             pin_code: form.pin_code,
        //             email: form.email,
        //         }
        //     }
        // });

        var staffUser = {
            'username': form.username,
            'first_name': form.first_name,
            'last_name': form.last_name,
            'email': form.email,
            'role': userType,
            'password': form.password,
        }
        var newUserResponse = await PostNewUser(staffUser); 

        if (newUserResponse === 200) {
            // sign into supabase auth first
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });

            if (signInData == null) {
                console.log(signInError);
                return false;
            }

            // sign in user to django server
            var loginData = {
                'username': '',
                'email': form.email,
                'password': form.password,
            }

            var loginResponse = await LoginUser(loginData);
            if (loginResponse !== 200) {
                return false;
            }

            navigate('/dashboard');
            window.location.reload();
            return true;
        }
        else {
            console.log("Error signing up new user");
            return false;
        }

        // if (authData.user != null) {
        //     // get data from supabase table
        //     const { data: userData, error: userError } = await supabase
        //         .from('users')
        //         .select()
        //         .eq('id', authData.user.id)
        //         .limit(1)
        //         .single();

        //     if (userData != null) {
        //         // send data to django database
        //         if (userType === 'USER') {
        //             // create user from registration form 
        //             var staffUser = {
        //                 'uid': userData.id,
        //                 'username': form.username,
        //                 'first_name': form.first_name,
        //                 'last_name': form.last_name,
        //                 'email': form.email,
        //                 'cell_number': form.cell_number,
        //                 'home_number': form.home_number,
        //                 'work_number': form.work_number,
        //                 'street': form.street,
        //                 'street_2': form.street_2,
        //                 'city': form.city,
        //                 'province': form.province,
        //                 'country': form.country,
        //                 'postal_code': form.postal_code,
        //                 'gender': form.gender,
        //                 'role': userType,
        //                 'pin_code': form.pin_code,
        //                 'password': userData.encrypted_password,
        //                 'created_at': userData.created_at,
        //                 'position': form.position,
        //             }
        //             await PostNewUser(staffUser, authData?.session?.access_token);
        //         }
                
        //         // sign in user after signing up
        //         if (userType === 'USER') {
        //             setTimeout(async () => {
        //                 const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        //                     email: form.email,
        //                     password: form.password,
        //                 });

        //                 if (signInData != null) {
        //                     navigate('/dashboard');
        //                     window.location.reload();
        //                     return true;
        //                 }
        //                 else {
        //                     console.log(signInError);
        //                     return false;
        //                 }

        //             }, 2000);
        //         }
        //         return true;
        //     }
        // }
        // else {
        //     console.log(authError);
        // }
        //return false;
    }

    // sign in a user
    // email, username, TODO: pin code, mobile number? OTP?
    async function signInUser(form: any, navigate: NavigateFunction) {
        let data, error;
        switch (form.type) {
            case "email":
                // sign in with email
                ({ data, error } = await supabase.auth.signInWithPassword({
                    email: form.username,
                    password: form.password,
                }));

                if (error != null) {
                    console.log(error);
                    return false;
                }

                // sign in user to django server
                var emailLoginData = {
                    'email': form.username,
                    'password': form.password,
                }

                var emailLoginResponse = await LoginUser(emailLoginData);
                if (emailLoginResponse !== 200) {
                    return false;
                }

                break;
            case "username":
                // sign in with username
                // search table for user who owns username
                var authUserEmail: any = await GetAuthUserEmailByUsername(form.username);
                
                if (authUserEmail != null && authUserEmail !== undefined) {
                    // sign in with email
                    ({ data, error } = await supabase.auth.signInWithPassword({
                        email: authUserEmail,
                        password: form.password,
                    }));

                    if (error != null) {
                        console.log(error);
                        return false;
                    }

                    // sign in user to django server
                    var usernameLoginData = {
                        'email': authUserEmail,
                        'password': form.password,
                    }

                    var usernameLoginResponse = await LoginUser(usernameLoginData);
                    if (usernameLoginResponse !== 200) {
                        return false;
                    }
                }
                else {
                    // else return error
                    console.log(error);
                    return false;
                }
                break;

            // TODO: mobile auth?
            // TODO: OTP?
        }

        if (data) {
            // user data found
            try {
                const { data: { session: authSession } } = await supabase.auth.getSession();
                if (authSession) {
                    
                    // get user info
                    var userInfo = await getUserByUid(authSession?.user?.id, authSession?.access_token); 

                    if (!userInfo?.active) {
                        // if account is not active do not let them login, show error
                        return {'error': 'Disabled'};
                    }

                    // if (userInfo?.role === 'OWNER') {
                    //     // get subscription info
                    //     var ownerSubscription = await GetOwnerSubscription(userInfo?.id, authSession?.access_token);

                    //     // get payment info
                    //     var payment = await GetOwnerPayment(userInfo?.id, authSession?.access_token);
                    // }
                    
                    const newUser: UserProfileModel = {
                        //subscription: ownerSubscription,
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
            }

            var role = data.user?.user_metadata.role;
            switch (role) {
                case "USER":
                    setTimeout(() => {
                        navigate('/dashboard');
                        window.location.reload();
                    }, 2000);
                    break;
                default:
                    navigate('/logout');
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                    break;
            }
            
            return true;
        }

        return false;
    }

    // sign out
    async function signOutUser(navigate: NavigateFunction) {
        console.log("Signed out");
        localStorage.removeItem("user");
        navigate("/logout");
    }

    // reset password
    async function resetPassword(form: any) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(form.values.email, {
            redirectTo: 'https://example.com/update-password',
        })
    }

    // generate recovery email
    async function generateRecoveryEmail(email: string) {
        const { data, error } = await supabase_admin.auth.admin.generateLink({
            type: 'magiclink',
            email: email,
        });
        return data;
    }

    // update user email
    async function updateUserEmail(email: any) {
        const { data, error } = await supabase.auth.updateUser({
            email: email,
        });
        return {data: data, error: error};
    }

    // update user password
    async function updateUserPassword(password: any) {
        const { data, error } = await supabase.auth.updateUser({
            password: password,
        });
        return {data: data, error: error};
    }

    const contextValue = {
        isNewUser: isNewUser,
        onboarding: onboarding,
        isManager: isManager,
        isActive: isActive,
        setIsNewUser,
        setIsActive,
        setIsManager,
        setOnboarding,
        signUpNewUser,
        signInUser,
        signOutUser,
        generateRecoveryEmail,
        updateUserEmail,
        updateUserPassword,
    };

    return (
        <SupabaseContext.Provider value={contextValue}>
            {children}
        </SupabaseContext.Provider>
    );

    //return { signUpNewUser, authenticateWithPinCode, signInUser, signOutUser, resetPassword };
}

// export the useSupabase hook
export const useSupabase = () => {
    return useContext(SupabaseContext);
};