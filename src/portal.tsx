import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { NewArrangementPage } from "./pages/NewArrangementPage";
import theme from "./themes/mainTheme";
import { PageFrame } from "./components/PageFrame/PageFrame";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { EmployeesPage } from "./pages/EmployeesPage";
import { EvolutionPage } from "./pages/EvolutionPage";
import { PreferencesPage } from "./pages/PreferencesPage";
import { StatusPage } from "./pages/StatusPage";
import { PublishPage } from "./pages/PublishPage";
import { arrangementPageSubTabs, PagesUrl } from "./interfaces/pages.meta";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";
import { useEffect, useState } from "react";
import { ComponentStatus } from "./interfaces/common";
import { loginService } from "./services/loginService";
import { LoadingPaper } from "./components/Loading/LoadingPaper";

export default function Portal() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<ComponentStatus>(
        ComponentStatus.LOADING
    );

    useEffect(() => {
        const tryLogin = async () => {
            try {
                await loginService.doSlientLogin();
                navigate(PagesUrl.Arrangement);
            } catch (err) {
                navigate(PagesUrl.Login);
            } finally {
                setStatus(ComponentStatus.READY);
            }

        };
        tryLogin();
    }, []);

    if (status !== ComponentStatus.READY) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <LoadingPaper />;
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <CssBaseline />
                {/* ********************** NAV BAR **********************  */}

                {/* ******************* PAGES ROUTING *******************  */}
                <Routes>
                    <Route
                        path="/*"
                        element={<Navigate to={PagesUrl.Login} />}
                    />

                    {/* ********* WELCOME PAGES ********* */}
                    <Route
                        path={PagesUrl.Login}
                        element={<LoginPage />}
                    />
                    <Route
                        path={PagesUrl.Signup}
                        element={<SignupPage />}
                    />

                    {/* ***** ARRANGEMENT SUB TABS ****** */}
                    <Route
                        path={PagesUrl.Arrangement}
                        element={
                            <PageFrame
                                pageComponent={NewArrangementPage}
                                subtabs={arrangementPageSubTabs}
                            />
                        }
                    />
                    <Route
                        path={PagesUrl.Arrangement_New}
                        element={
                            <PageFrame
                                pageComponent={NewArrangementPage}
                                subtabs={arrangementPageSubTabs}
                            />
                        }
                    />
                    <Route
                        path={PagesUrl.Arrangement_Evolution}
                        element={
                            <PageFrame
                                pageComponent={EvolutionPage}
                                subtabs={arrangementPageSubTabs}
                            />
                        }
                    />
                    <Route
                        path={PagesUrl.Arrangement_Status}
                        element={
                            <PageFrame
                                pageComponent={StatusPage}
                                subtabs={arrangementPageSubTabs}
                            />
                        }
                    />
                    <Route
                        path={PagesUrl.Arrangement_Publish}
                        element={
                            <PageFrame
                                pageComponent={PublishPage}
                                subtabs={arrangementPageSubTabs}
                            />
                        }
                    />
                    <Route
                        path={PagesUrl.Arrangement_Preference}
                        element={<PageFrame pageComponent={PreferencesPage} subtabs={[]} />}
                    />
                    {/* ***** Employees SUB TABS ****** */}
                    <Route
                        path={PagesUrl.Employees}
                        element={<PageFrame pageComponent={EmployeesPage} subtabs={[]} />}
                    />
                    <Route
                        path={PagesUrl.Requests}
                        element={<PageFrame pageComponent={ComingSoonPage} subtabs={[]} />}
                    />
                    <Route
                        path={PagesUrl.History}
                        element={<PageFrame pageComponent={ComingSoonPage} subtabs={[]} />}
                    />
                    <Route
                        path={PagesUrl.Settings}
                        element={<PageFrame pageComponent={SettingsPage} subtabs={[]} />}
                    />
                    <Route
                        path={PagesUrl.Premium}
                        element={<PageFrame pageComponent={ComingSoonPage} subtabs={[]} />}
                    />
                    <Route
                        path={PagesUrl.ContactUs}
                        element={<PageFrame pageComponent={ComingSoonPage} subtabs={[]} />}
                    />


                    {/* EMPLOYEE PAGES */}
                    <Route
                        path={PagesUrl.Emp_Preferences}
                        element={<PageFrame pageComponent={PreferencesPage} subtabs={[]} />}
                    />
                    <Route
                        path={PagesUrl.Emp_Arrangement}
                        element={<PageFrame pageComponent={PublishPage} subtabs={[]} />}
                    />
                </Routes>
            </Box>
        </ThemeProvider>
    );
}
