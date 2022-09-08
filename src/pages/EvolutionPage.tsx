import { Button, Divider, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { EvolutionStore } from '../stores/evolutionStore';
import { globalStore } from '../stores/globalStore';
import { EvolutionaryOperatorDTO, SchemaDTO, SchemaFamilyDTO } from '../swagger/stubs';
import DeleteIcon from '@mui/icons-material/Delete';
import '../themes/evolutionPage.css';
import { evolutionService } from '../services/evolutionService';
import { useNavigate } from 'react-router';
import { PagesUrl } from '../interfaces/pages.meta';
import { ComponentStatus } from '../interfaces/common';
import { useEffect, useState } from 'react';
import { LoadingPaper } from '../components/Loading/LoadingPaper';
import { ConfigurationPanel, ControlFactory, ValueOfSchemaParam } from '../components/ConfigurationPanel/ConfigurationPanel';

enum SchemaFamilyType {
    Mutations = 'mutations',
    Crossovers = 'crossovers',
    Selections = 'selections',TermConds = 'term_conds'
}

export const EvolutionPage = observer(() => {
    const evolutionStore: EvolutionStore = globalStore.evolutionStore;
    const navigate = useNavigate();
    const [schemas, setSchemas] = useState<SchemaFamilyDTO[]>([]);
    const [status, setStatus] = useState<ComponentStatus>(ComponentStatus.LOADING);


    useEffect(() => {
        const fetchSchemas = async () => {
            const allSchemas = await evolutionService.getSchemas();
            setSchemas(allSchemas); // locally in component
            evolutionStore.setPredefinedSettings(allSchemas); // set in store
            setStatus(ComponentStatus.READY);
        }

        fetchSchemas();
    }, []);


    if (status !== ComponentStatus.READY) {
        return <LoadingPaper />;
    }

    const handleConfigChange = (schemaFamilyType: SchemaFamilyType, paramName: string, paramValue: any, idx: number = 0) => {
        switch (schemaFamilyType) {
            case SchemaFamilyType.Mutations:
                evolutionStore.setMutation(
                    evolutionStore.mutations?.[idx]?.type || '', 
                    { ...evolutionStore.mutations?.[idx]?.params, [paramName]: paramValue },
                    idx);
                break;
            case SchemaFamilyType.Selections:
                evolutionStore.setSelection(
                    evolutionStore.selection?.type || '', 
                    { ...evolutionStore.selection?.params, [paramName]: paramValue });
                break;
            case SchemaFamilyType.Crossovers:
                evolutionStore.setCrossover(
                    evolutionStore.crossover?.type || '', 
                    { ...evolutionStore.crossover?.params, [paramName]: paramValue });
                break;
            case SchemaFamilyType.TermConds:
                evolutionStore.setTermCond(
                    evolutionStore.termConds?.[idx]?.type || '', 
                    { ...evolutionStore.termConds?.[idx]?.params, [paramName]: paramValue },
                    idx);
                break;
            default:
                console.log('unsupported schema family type');
        }
    }

    return (
        <Paper sx={{ margin: 'auto', overflow: 'hidden', height: '100%' }}>
            <div style={{
                margin: '30px'
            }}>

                {/* POPULATION SIZE + ELITISM */}
                <div className='evo-mrg-bt-8'>
                    <TextField
                        value={evolutionStore.populationSize}
                        id="outlined-search"
                        label="pupolation size"
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onChange={(e) => evolutionStore.setPopulationSize(parseInt(e.target.value))}
                        style={{ minWidth: "300px", marginRight: '15px' }}
                    />
                    <TextField
                        value={evolutionStore.elitism}
                        id="outlined-search"
                        label="elitism"
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onChange={(e) => evolutionStore.setElitism(parseInt(e.target.value))}
                    />
                </div>

                <Divider style={{ marginBottom: '40px' }} />


                {/* SELECTION */}
                <div className='evo-mrg-bt-8'>
                    <InputLabel id="selection-label">Selection</InputLabel>
                    <Select
                        /* find a way to make it no draw on edges like regular labels */
                        labelId="selection-label"
                        style={{ minWidth: "300px", marginRight: '15px' }}
                        id="demo-simple-select-helper"
                        value={evolutionStore.selection.type}
                        //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                        onChange={(e) => {
                            const schema = schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.Selections)?.schemas?.find(schema => schema.name === e.target.value);
                            evolutionStore.setSelection(e.target.value || '', {});
                        }}
                        defaultValue="something" //remember to update state to defualt value
                    >
                        {schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.Selections)?.schemas?.map((schema: SchemaDTO) => (
                            <MenuItem value={schema.name}>{schema.name}</MenuItem>
                        ))}
                    </Select>

                    <ConfigurationPanel
                        params={schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.Selections)?.schemas?.find(schema => schema.name === evolutionStore.selection.type)?.params || []}
                        paramsValues={Object.entries(evolutionStore.selection.params).map(param => ({ name: param[0], value: param[1] }))}
                        onChange={(paramName: string, paramValue: any) => handleConfigChange(SchemaFamilyType.Selections, paramName, paramValue)}
                    />
                    <div style={{ height: '15px' }} />
                </div>

                <Divider style={{ marginBottom: '40px' }} />

                {/* CROSSOVER */}
                <div className='evo-mrg-bt-8'>
                    <InputLabel id="selection-label">Crossover</InputLabel>
                    <Select
                        /* find a way to make it no draw on edges like regular labels */
                        labelId="crossover-label"
                        style={{ minWidth: "300px", marginRight: '15px' }}
                        id="demo-simple-select-helper"
                        value={evolutionStore.crossover.type}
                        //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                        onChange={(e) => {
                            const schema = schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.Crossovers)?.schemas?.find(schema => schema.name === e.target.value);
                            evolutionStore.setCrossover(e.target.value || '', {});
                        }}
                        defaultValue="something" //remember to update state to defualt value
                    >
                        {schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.Crossovers)?.schemas?.map((schema: SchemaDTO) => (
                            <MenuItem value={schema.name}>{schema.name}</MenuItem>
                        ))}
                    </Select>

                    <ConfigurationPanel
                        params={schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.Crossovers)?.schemas?.find(schema => schema.name === evolutionStore.crossover.type)?.params || []}
                        paramsValues={Object.entries(evolutionStore.crossover.params).map(param => ({ name: param[0], value: param[1] }))}
                        onChange={(paramName: string, paramValue: any) => handleConfigChange(SchemaFamilyType.Crossovers, paramName, paramValue)}
                    />
                    <div style={{ height: '15px' }} />
                </div>


                <Divider style={{ marginBottom: '40px' }} />

                {/* MUTATIONS */}
                <div className='evo-mrg-bt-8'>

                    <Button
                        variant="contained"
                        onClick={() => evolutionStore.addMutation()}
                        className='evo-mrg-bt-8'
                        style={{ marginBottom: '10px' }}
                    >
                        Add Mutation +
                    </Button>

                    {evolutionStore.mutations.map((mutation: EvolutionaryOperatorDTO, idx: number) => {
                        return <div>
                            <InputLabel id="crossover-label">Mutation</InputLabel> {/* find a way to make it no draw on edges like regular labels */}
                            <Select
                                labelId="mutation-label"
                                style={{ minWidth: "300px", marginRight: '15px' }}
                                id="mutation-select"
                                value={mutation?.type || ''}
                                //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                                defaultValue="something" //remember to update state to defualt value
                                onChange={(e) => {
                                    const schema = schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.Mutations)?.schemas?.find(schema => schema.name === e.target.value);
                                    evolutionStore.setMutation(e.target.value || '', {}, idx)
                                }}
                            >
                                {schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.Mutations)?.schemas?.map((schema: SchemaDTO) => (
                                    <MenuItem value={schema.name}>{schema.name}</MenuItem>
                                ))}
                            </Select>

                            <IconButton
                                aria-label="delete"
                                onClick={() => evolutionStore.removeMutation(idx)}
                            >
                                <DeleteIcon />
                            </IconButton>

                            <ConfigurationPanel
                                params={schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.Mutations)?.schemas?.find(schema => schema.name === mutation.type)?.params || []}
                                paramsValues={Object.entries(evolutionStore.mutations[idx].params).map(param => ({ name: param[0], value: param[1] }))}
                                onChange={(paramName: string, paramValue: any) => handleConfigChange(SchemaFamilyType.Mutations, paramName, paramValue, idx)}
                            />
                            <div style={{ height: '15px' }} />
                        </div>
                    })}
                </div>

                <Divider style={{ marginBottom: '40px' }} />

                {/* TERMINATION CONDITIONS */}
                <div className='evo-mrg-bt-8'>

                    <Button
                        variant="contained"
                        onClick={() => evolutionStore.addTermCond()}
                        className='evo-mrg-bt-8'
                        style={{ marginBottom: '10px' }}
                    >
                        Add Termination Condition +
                    </Button>

                    {evolutionStore.termConds.map((termCond: EvolutionaryOperatorDTO, idx: number) => {
                        return <div>
                            <InputLabel id="crossover-label">Termination Condition</InputLabel> {/* find a way to make it no draw on edges like regular labels */}
                            <Select
                                labelId="term-conds-label"
                                style={{ minWidth: "300px", marginRight: '15px' }}
                                id="term-conds-select"
                                value={termCond?.type || ''}
                                //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                                defaultValue="something" //remember to update state to defualt value
                                onChange={(e) => {
                                    const schema = schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.TermConds)?.schemas?.find(schema => schema.name === e.target.value);
                                    evolutionStore.setTermCond(e.target.value || '', {}, idx);
                                }}
                            >
                                {schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.TermConds)?.schemas?.map((schema: SchemaDTO) => (
                                    <MenuItem value={schema.name}>{schema.name}</MenuItem>
                                ))}
                            </Select>

                            <IconButton
                                aria-label="delete"
                                onClick={() => evolutionStore.removeTermCond(idx)}
                            >
                                <DeleteIcon />
                            </IconButton>

                            <ConfigurationPanel
                                params={schemas.find(schemaFamily => schemaFamily.family === SchemaFamilyType.TermConds)?.schemas?.find(schema => schema.name === termCond.type)?.params || []}
                                paramsValues={Object.entries(evolutionStore.termConds[idx].params).map(param => ({ name: param[0], value: param[1] }))}
                                onChange={(paramName: string, paramValue: any) => handleConfigChange(SchemaFamilyType.TermConds, paramName, paramValue, idx)}
                            />
                            <div style={{ height: '15px' }}>

                            </div>
                        </div>
                    })}
                </div>

                {/* SUBMIT BUTTON */}
                <div className='evo-mrg-bt-8' style={{ display: "flex", padding: "40px" }}>
                    <div style={{ width: '90%' }}></div>
                    <Button
                        variant="contained"
                        color="success"
                        style={{ height: "50px", width: "100px" }}
                        onClick={async () => {
                            let flag: Boolean = await evolutionService.solveArrangement(evolutionStore.algorithmConfig);
                            if(flag)
                                navigate(PagesUrl.Arrangement_Publish);
                        }}
                    >
                        Start
                    </Button>
                </div>
            </div>
        </Paper>
    );
});
