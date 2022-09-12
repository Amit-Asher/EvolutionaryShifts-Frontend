import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { PagesUrl, SubTab } from "../../interfaces/pages.meta";
import { observer } from "mobx-react";
import { loginService } from "../../services/loginService";

const lightColor = "rgba(255, 255, 255, 0.7)";

interface HeaderProps {
    subTabs: SubTab[];
}

export const Header = observer((props: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation().pathname;

    const doLogout = async () => {
        await loginService.doLogout();
        navigate(PagesUrl.Login);
    }

    return (
        <React.Fragment>
            <AppBar color="primary" position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
                            <IconButton color="inherit" aria-label="open drawer" edge="start">
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs />
                        <Grid item>
                            <Button
                                sx={{ borderColor: lightColor }}
                                variant="outlined"
                                color="inherit"
                                size="small"
                                onClick={() => doLogout()}
                            >
                                Sign out
                            </Button>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Alerts • No alerts">
                                <IconButton color="inherit">
                                    <NotificationsIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <IconButton color="inherit" sx={{ p: 0.5 }}>
                                <Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <AppBar
                component="div"
                color="primary"
                position="static"
                elevation={0}
                sx={{ zIndex: 0 }}
            >
                <Toolbar>
                </Toolbar>
            </AppBar>
            <AppBar
                component="div"
                position="static"
                elevation={0}
                sx={{ zIndex: 0 }}
            >
                <Tabs
                    value={
                        props.subTabs.find((subtab) => subtab.url === location)?.idx ?? 0
                    }
                    textColor="inherit"
                >
                    {props.subTabs.map((subtab: SubTab, index: number) => {
                        return (
                            <Tab
                                onClick={() => {
                                    navigate(subtab.url);
                                }}
                                label={subtab.label}
                                key={index.toString()}
                            ></Tab>
                        );
                    })}
                </Tabs>
            </AppBar>
        </React.Fragment>
    );
});
