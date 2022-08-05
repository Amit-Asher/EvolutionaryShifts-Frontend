import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { NewArrangementPage } from "./pages/NewArrangementPage";
import theme from "./themes/mainTheme";
import { PageFrame } from "./components/PageFrame/PageFrame";
import { Route, Routes, Navigate } from "react-router-dom";
import { EmployeesPage } from "./pages/EmployeesPage";
import { EvolutionPage } from "./pages/EvolutionPage";
import { PreferencesPage } from "./pages/PreferencesPage";
import { StatusPage } from "./pages/StatusPage";
import { PublishPage } from "./pages/PublishPage";
import { Navigator } from "./components/Navigator/Navigator";
import { arrangementPageSubTabs, PagesUrl } from "./interfaces/pages.meta";
import { ComingSoonPage } from "./pages/ComingSoonPage";

export default function Portal() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <CssBaseline />
                {/* ********************** NAV BAR **********************  */}
                <Navigator />

                {/* ******************* PAGES ROUTING *******************  */}
                <Routes>
                    <Route
                        path="/*"
                        element={<Navigate to={PagesUrl.Arrangement_New} />}
                    />
                    {/* ***** ARRANGEMENT SUB TABS ****** */}
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
                        element={<PageFrame pageComponent={ComingSoonPage} subtabs={[]} />}
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
