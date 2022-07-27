import { FormLabel } from "@mui/material";

export enum PagesUrl {
    Arrangement = '/arrangement',
    Arrangement_New= '/arrangement/new',
    Arrangement_Status= '/arrangement/status',
    Arrangement_Evolution= '/arrangement/evolution',
    Arrangement_Publish= '/arrangement/publish',
    Employees= '/employees',
    Arrangement_Preference = '/arrangement/preferences',
    Requests = '/requests',
    History = '/history',
    Settings = '/settings',
    Premium = '/premium',
    ContactUs = '/contact'
}

export interface SubTab {
    label: string;
    url: string;
    idx: number;
}

export const arrangementPageSubTabs: SubTab[] = [
    {
        idx: 0,
        label: "New Arrangement",
        url: PagesUrl.Arrangement_New
    },
    {
        idx: 1,
        label: "Employees Status",
        url: PagesUrl.Arrangement_Status
    },
    {
        idx: 2,
        label: "Evolution Engine",
        url: PagesUrl.Arrangement_Evolution
    },
    {
        idx: 3,
        label: "Publish",
        url: PagesUrl.Arrangement_Publish
    }
];

export const getBaseUrlByLocation = (location: string): PagesUrl => {

    if (location.includes(PagesUrl.Arrangement)) {
        return PagesUrl.Arrangement;
    }

    if (location.includes(PagesUrl.Employees)) {
        return PagesUrl.Employees;
    }

    return PagesUrl.Arrangement;
}