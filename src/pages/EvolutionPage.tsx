import { Button, Divider, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { EvolutionStore } from '../stores/evolutionStore';
import { globalStore } from '../stores/globalStore';
import { EvolutionaryOperatorDTO } from '../swagger/stubs';
import DeleteIcon from '@mui/icons-material/Delete';
import '../themes/evolutionPage.css';
import { evolutionService } from '../services/evolutionService';

const supportedSelections: EvolutionaryOperatorDTO[] = [
    {
        type: 'TournamentSelection',
        params: [
            {
                type: "number",
                name: "probability"
            },
            // {
            //     type: "boolean",
            //     name: "boolean test"
            // },
            // {
            //     type: "string",
            //     name: "string test"
            // }
        ]
    }
]

const supportedCrossovers: EvolutionaryOperatorDTO[] = [
    {
        type: 'BasicCrossover',
        params: [
            {
                type: "number",
                name: "crossoverPoints"
            },
            // {
            //     type: "boolean",
            //     name: "boolean test"
            // },
            // {
            //     type: "string",
            //     name: "string test"
            // }
        ]
    }
]

const supportedMutations: EvolutionaryOperatorDTO[] = [
    {
        type: 'MutationByEmployee',
        params: [
            {
                type: "number",
                name: "probability"
            },
            // {
            //     type: "boolean",
            //     name: "boolean test"
            // },
            // {
            //     type: "string",
            //     name: "string test"
            // }
        ]
    }
]

const supportedTermConds: EvolutionaryOperatorDTO[] = [
    {
        type: 'GenerationCount',
        params: [
            {
                type: "number",
                name: "count"
            },
            // {
            //     type: "boolean",
            //     name: "boolean test"
            // },
            // {
            //     type: "string",
            //     name: "string test"
            // }
        ]
    }
]

export const EvolutionPage = observer(() => {
    const evolutionStore: EvolutionStore = globalStore.evolutionStore;

    return (
        <Paper sx={{ margin: 'auto', overflow: 'hidden', height: '100%' }}>
            <div style={{
                margin: '30px'
            }}>

                {/* SELECTION */}
                <div className='evo-mrg-bt-8'>
                    <InputLabel id="selection-label">selection</InputLabel>
                    <Select
                        /* find a way to make it no draw on edges like regular labels */
                        labelId="selection-label"
                        style={{ minWidth: "300px", marginRight: '15px' }}
                        id="demo-simple-select-helper"
                        value={evolutionStore.selection.type}
                        //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                        onChange={(e) => evolutionStore.setSelection(
                            supportedSelections[0].type || '',
                            {}
                        )}
                        defaultValue="something" //remember to update state to defualt value
                    >
                        {supportedSelections.map((supportedSelection: EvolutionaryOperatorDTO) => (
                            <MenuItem value={supportedSelection.type}>{supportedSelection.type}</MenuItem>
                        ))}
                    </Select>
                    {/* add controls dynamiclly depends on the type of selection chosen */}
                    {/* understand why input validation doesnt work should only allow number here */}
                    {/* <ConfigurationPanel params={supportedSelections[0].params} onChange={(input: string, paramName: string) => {}}/> */}

                    <TextField
                        id="outlined-search"
                        label="probability"
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onChange={(e) => {
                            evolutionStore.setSelection(
                                evolutionStore.selection.type || '',
                                {
                                    ...evolutionStore.selection.params,
                                    probability: parseFloat(e.target.value)
                                }
                            )
                        }}
                    />
                </div>

                <Divider style={{ marginBottom: '40px' }} />

                {/* POPULATION SIZE + ELITISM */}
                <div className='evo-mrg-bt-8'>
                    <TextField
                        id="outlined-search"
                        label="pupolation size"
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onChange={(e) => evolutionStore.setPopulationSize(parseInt(e.target.value))}
                        style={{ minWidth: "300px", marginRight: '15px' }}

                    />
                    <TextField
                        id="outlined-search"
                        label="elitism"
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onChange={(e) => evolutionStore.setElitism(parseInt(e.target.value))}
                    />
                </div>

                <Divider style={{ marginBottom: '40px' }} />

                {/* CROSSOVER */}
                <div className='evo-mrg-bt-8'>
                    <InputLabel id="crossover-label">crossover</InputLabel> {/* find a way to make it no draw on edges like regular labels */}
                    <Select
                        labelId="crossover-label"
                        style={{ minWidth: "300px", marginRight: '15px' }}
                        id="crossover-select"
                        value={evolutionStore.crossover.type}
                        //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                        defaultValue="something" //remember to update state to defualt value
                        onChange={(e) => evolutionStore.setCrossover(
                            supportedCrossovers[0].type || '',
                            {}
                        )}
                    >
                        {supportedCrossovers.map((supportedCrossover: EvolutionaryOperatorDTO) => (
                            <MenuItem value={supportedCrossover.type}>{supportedCrossover.type}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        id="outlined-search"
                        label="cutting points"
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onChange={(e) => {
                            evolutionStore.setCrossover(
                                evolutionStore.crossover.type || '',
                                {
                                    ...evolutionStore.crossover.params,
                                    crossoverPoints: parseFloat(e.target.value)
                                }
                            )
                        }}
                    />
                </div>

                <Divider style={{ marginBottom: '40px' }} />

                {/* MUTATIONS */}
                <div className='evo-mrg-bt-8'>
                    <div>

                    </div>
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
                            <InputLabel id="crossover-label">mutation</InputLabel> {/* find a way to make it no draw on edges like regular labels */}
                            <Select
                                labelId="mutation-label"
                                style={{ minWidth: "300px", marginRight: '15px' }}
                                id="mutation-select"
                                value={mutation?.type || ''}
                                //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                                defaultValue="something" //remember to update state to defualt value
                                onChange={(e) => evolutionStore.setMutation(supportedMutations[0].type || '', {}, idx)}
                            >
                                {supportedMutations.map((supportedMutation: EvolutionaryOperatorDTO) => (
                                    <MenuItem value={supportedMutation.type}>{supportedMutation.type}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                id="outlined-search"
                                label="probability"
                                type="number"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                value={mutation?.params?.probability}
                                onChange={(e) => {
                                    evolutionStore.setMutation(
                                        evolutionStore.mutations[idx].type || '',
                                        {
                                            ...evolutionStore.mutations[idx].params,
                                            probability: parseFloat(e.target.value)
                                        },
                                        idx
                                    )
                                }}
                            />
                            <IconButton
                                aria-label="delete"
                                onClick={() => evolutionStore.removeMutation(idx)}
                            >
                                <DeleteIcon />
                            </IconButton>
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
                            <InputLabel id="crossover-label">terminate condition</InputLabel> {/* find a way to make it no draw on edges like regular labels */}
                            <Select
                                labelId="mutation-label"
                                style={{ minWidth: "300px", marginRight: '15px' }}
                                id="mutation-select"
                                value={termCond?.type || ''}
                                //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                                defaultValue="something" //remember to update state to defualt value
                                onChange={(e) => evolutionStore.setTermCond(supportedTermConds[0].type || '', {}, idx)}
                            >
                                {supportedTermConds.map((supportedTermCond: EvolutionaryOperatorDTO) => (
                                    <MenuItem value={supportedTermCond.type}>{supportedTermCond.type}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                key={`outlined-search-${idx}`}
                                id={`outlined-search-${idx}`}
                                label="count"
                                type="number"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                value={termCond?.params?.count}
                                onChange={(e) => {
                                    evolutionStore.setTermCond(
                                        evolutionStore.termConds[idx].type || '',
                                        {
                                            ...evolutionStore.termConds[idx].params,
                                            count: parseFloat(e.target.value)
                                        },
                                        idx
                                    )
                                }}
                            />
                            <IconButton
                                aria-label="delete"
                                onClick={() => evolutionStore.removeTermCond(idx)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    })}
                </div>

                {/* SUBMIT BUTTON */}
                <div className='evo-mrg-bt-8' style={{ display: "flex", padding: "40px" }}>
                    <div style={{ width: '90%' }}></div>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ height: "50px", width: "100px" }}
                        onClick={() => evolutionService.solveArrangement(evolutionStore.algorithmConfig)}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </Paper>
    );
});
