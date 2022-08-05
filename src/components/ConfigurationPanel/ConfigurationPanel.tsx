import { TextField } from "@mui/material";
import { observer } from "mobx-react";
import { ParamOfSchemaDTO } from "../../swagger/stubs";

export interface ValueOfSchemaParam {
    name: string;
    value: any;
}

const emptyValueOfSchemaParam = {
    name: '',
    value: ''
}

interface ConfigurationPanelProps {
    params: ParamOfSchemaDTO[];
    paramsValues: ValueOfSchemaParam[];
    onChange: (paramName: string, paramValue: any) => void;
}

export class ControlFactory {
    public static createControlByParam = (
        param: ParamOfSchemaDTO,
        paramValue: ValueOfSchemaParam,
        onChangeParam: (paramName: string, paramValue: any) => void
    ) => {
        if (param.type === "string") {
            return (
                <TextField
                    value={paramValue.value}
                    onChange={(e) => onChangeParam(param?.name || '', e.target.value)}
                    placeholder={param.name}
                    style={{ width: '300px', marginTop: '10px', marginRight: '15px' }}
                />
            )
        }
        if (param.type === "number") {
            return (
                <TextField
                    value={paramValue.value}
                    onChange={(e) => onChangeParam(param?.name || '', parseFloat(e.target.value))}
                    placeholder={param.name}
                    type="number"
                    style={{ width: '300px', marginTop: '10px', marginRight: '15px' }}
                />
            )
        }
    }
}

export const ConfigurationPanel = observer((props: ConfigurationPanelProps) => {
    return (
        <div>
            {props?.params.map((param: ParamOfSchemaDTO) => {
                return ControlFactory.createControlByParam(
                    param,
                    props.paramsValues.find(paramVal => paramVal.name === param.name) || emptyValueOfSchemaParam,
                    props.onChange
                );
            })}
        </div>
    )
});
