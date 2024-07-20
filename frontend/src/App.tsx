import './App.css';

// fonts
import './fonts/AkcelerAalt-Bold.ttf';
import './fonts/AkcelerAalt-Medium.ttf';
import './fonts/AkcelerAalt.ttf';

import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';

import { Routes, Route, BrowserRouter, useNavigate, Router } from "react-router-dom";
import { useEffect, useState } from 'react';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, AppShell, Burger, Divider, Group, Skeleton, Text, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  IconHome,
  IconUser,
  IconEye,
  IconBuilding,
  IconList,
  IconCalendar,
  IconCalendarUser,
} from '@tabler/icons-react';
import classes from './css/Navbar.module.css';
import RegisterPage from './pages/main/RegisterPage';
import UserRoute from './authentication/UserRoute';
import { ChangesProvider } from './context/ChangesContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import AuthRoute from './authentication/AuthRoute';
import ProfilePage from './pages/main/ProfilePage';
import ForgotPassword from './components/ForgotPasswordCard';
import ResetPassword from './components/ResetPasswordCard';
import VerifyEmail from './components/VerifyEmailCard';
import { SupabaseAuthProvider } from './authentication/SupabaseAuthContext';
import LogoutCard from './components/LogoutCard';
import { Footer } from './components/Footer';
import { SimpleHeader } from './components/SimpleHeader';
import { NavigationProvider } from './context/NavigationContext';
import { PrivacyPolicy } from './pages/main/PrivacyPolicy';
import { PricingDetailed } from './pages/main/PricingDetailed';
import { ContactUs } from './pages/main/ContactUs';
import LoginPage from './pages/main/LoginPage';
import Dashboard from './pages/main/Dashboard';
import LandingPage from './pages/main/LandingPage';
import { SupabaseContextProvider } from './authentication/SupabaseContext';
import SubscriptionSuccessCard from './components/SubscriptionSuccessCard';
import { TermsConditions } from './pages/main/TermsConditions';

function App() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [active, setActive] = useState('Billing');
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // useEffect to apply the dynamic body background color
  useEffect(() => {
    const body = document.body;
    // body.style.backgroundColor = (computedColorScheme === 'light' ? '#fff' : '#0c0f17');
    body.style.backgroundColor = (computedColorScheme === 'light' ? '#182420' : '#182420');
  }, [computedColorScheme]);

  return (
    <>
      <SupabaseContextProvider>
        <SupabaseAuthProvider>
          <NavigationProvider>
            <SimpleHeader />
            <main style={{ paddingBottom: "100px", fontFamily: "AK-Regular", minHeight: "100vh" }}>
              <GlobalStateProvider>
                <ChangesProvider>

                  {/* <HeaderHomePage/> */}
                  <Routes>
                    {/* GENERAL MAIN PAGES */}
                    <Route index element={<LandingPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="invite" element={<RegisterPage initialState={1} />} />
                    <Route path="forgot" element={<ForgotPassword />} />
                    <Route path="reset" element={<ResetPassword />} />
                    <Route path="verify" element={<VerifyEmail />} />
                    <Route path="logout" element={<LogoutCard />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />
                    <Route path="terms-of-service" element={<TermsConditions />} />
                    <Route path="pricing" element={<PricingDetailed />} />
                    <Route path="contact" element={<ContactUs />} />
                    <Route path="success" element={<SubscriptionSuccessCard />} />

                    {/* AUTH ROUTES -- MUST BE SIGNED IN */}
                    <Route element={<AuthRoute />}>

                      {/* AUTH DASHBOARD */}
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="user/:uid" element={<ProfilePage />} />

                      {/* USER ROUTES -- ROLE == USER */}
                      <Route element={<UserRoute />}>

                      </Route>

                    </Route>
                  </Routes>
                </ChangesProvider>
              </GlobalStateProvider>
            </main>
            <Footer />
          </NavigationProvider>
        </SupabaseAuthProvider>
      </SupabaseContextProvider>
    </>
  );
}

export default App;
