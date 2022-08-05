import { TextField } from "@mui/material";
import { observer } from "mobx-react";
import { ParamOfSchemaDTO } from "../../swagger/stubs";

interface ConfigurationPanelProps {
    params: ParamOfSchemaDTO[];
    onChange?: (input: string) => void;
}

export class ControlFactory {
    public static createControlByParam = (param: ParamOfSchemaDTO, onChange?: () => void) => {
        if (param.type === "string") {
            return (
                <TextField onChange={onChange} placeholder={param.name} style={{ width: '300px', marginTop: '10px', marginRight: '15px' }} />
            )
        }
        if (param.type === "number") {
            return (
                <TextField onChange={onChange} placeholder={param.name} type="number" style={{ width: '300px', marginTop: '10px', marginRight: '15px' }} />
            )
        }
    }
}

export const ConfigurationPanel = observer((props: ConfigurationPanelProps) => {
    return (
        <div>
            {props?.params.map((param: ParamOfSchemaDTO) => {
                return ControlFactory.createControlByParam(param, () => {});
            })}
        </div>
    )
});
