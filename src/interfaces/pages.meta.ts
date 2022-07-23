import { FormLabel } from "@mui/material";

export enum PagesUrl {
    Arrangement_New= '/arrangement/new',
    Arrangement_Status= '/arrangement/status',
    Arrangement_Evolution= '/arrangement/evolution',
    Arrangement_Publish= '/arrangement/publish',
    Employees= '/employees',
    Arrangement_Preference = 'arrangement/preferences'
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
