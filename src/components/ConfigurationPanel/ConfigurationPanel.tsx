import { TextField } from "@mui/material";
import { observer } from "mobx-react";

interface ControlParam {
    type: "string" | "number" | "boolean" | "date" | "selection";
    name: string;
    options?: string[];
}

interface ConfigurationPanelProps {
    params: ControlParam[];
    onChange: (input: string) => void;
}

class ControlFactory {
    public static createControlByParam = (param: ControlParam, onChange: () => void) => {
        if (param.type === "string") {
            return (
                <TextField onChange={onChange} placeholder={param.name} />
            )
        }
        if (param.type === "number") {
            return (
                <TextField onChange={onChange} placeholder={param.name} type="number" />
            )
        }
        if (param.type === "boolean") {
            return (
                <TextField onChange={onChange} placeholder={param.name} />
            )
        }
        if (param.type === "date") {
            return (
                <TextField onChange={onChange} placeholder={param.name} />
            )
        }
        if (param.type === "selection") {
            return (
                <TextField onChange={onChange} placeholder={param.name} />
            )
        }
    }
}

export const ConfigurationPanel = observer((props: ConfigurationPanelProps) => {
    return (
        <div>
            {props?.params.map((param: ControlParam) => {
                return ControlFactory.createControlByParam(param, () => {});
            })}
        </div>
    )
});
