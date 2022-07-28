import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { ConfigurationPanel } from '../components/ConfigurationPanel/ConfigurationPanel';
import { EvolutionStore } from '../stores/evolutionStore';
import { globalStore } from '../stores/globalStore';
import { EvolutionaryOperatorDTO } from '../swagger/stubs';

// const supportedSelections = [
//     'TournamentSelection'
// ]

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


export const EvolutionPage = observer(() => {
    const evolutionStore: EvolutionStore = globalStore.evolutionStore;

    const [selection, setSelection] = useState('');
    const [crossover, setCrossover] = useState('');
    const [mutation, setmutation] = useState(''); //needs to enable multiple mutation so probably muliple stats or something
    const [terminate, setterminate] = useState('');

    const terminateChange = (event: SelectChangeEvent) => {
        setterminate(event.target.value);
    };
    const mutationChange = (event: SelectChangeEvent) => {
        setmutation(event.target.value);
    };
    const crossoverChange = (event: SelectChangeEvent) => {
        setCrossover(event.target.value);
    };
    const selectionChange = (event: SelectChangeEvent) => {
        setSelection(event.target.value);
    };

    console.log(`evolutionStore.selection: ${JSON.stringify(evolutionStore.selection, undefined, 2)}`)

    return (
        <Paper sx={{ margin: 'auto', overflow: 'hidden', height: '100%' }}>
            <div>evultion page</div>
            {/* <FormControl sx={{ m: 1, minWidth: 120 }}> */}
            <div>
                <InputLabel id="selection-label">selection</InputLabel>
                <Select
                    /* find a way to make it no draw on edges like regular labels */
                    labelId="selection-label"
                    style={{ minWidth: "100px" }}
                    id="demo-simple-select-helper"
                    value={evolutionStore.selection.type}
                    //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                    onChange={(e) => evolutionStore.setSelection(
                        supportedSelections[0].type || '',
                        {}
                    )}
                    defaultValue="regular" //remember to update state to defualt value
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
                    label="top precent"
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
            {/* </FormControl> */}
            <div>
                <TextField id="outlined-search" label="pupolation size" type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                <TextField id="outlined-search" label="elitism" type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            </div>
            {/* <FormControl sx={{ m: 1, minWidth: 120 }}> */}
            <div>
                <InputLabel id="crossover-label">crossover</InputLabel> {/* find a way to make it no draw on edges like regular labels */}
                <Select
                    labelId="crossover-label"
                    style={{ minWidth: "300px" }}
                    id="crossover-select"
                    value={crossover}
                    //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                    onChange={crossoverChange}
                    defaultValue="something" //remember to update state to defualt value
                >
                    <MenuItem value={"basic"}>basic</MenuItem>
                    <MenuItem value={"islands"}>islands</MenuItem>
                    <MenuItem value={"something else"}>something else</MenuItem>
                </Select>
                <TextField id="outlined-search" label="number of cutting points" type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />

            </div>
            {/* </FormControl> */}
            {/* <FormControl sx={{ m: 1, minWidth: 120 }}> */}
            <div>
                <InputLabel id="mutation1-label">mutation</InputLabel>
                <Select
                    /* find a way to make it no draw on edges like regular labels */
                    labelId="mutation1-label"
                    style={{ minWidth: "300px" }}
                    id="mutation1-select"
                    value={mutation}
                    //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                    onChange={mutationChange}
                    defaultValue="something" //remember to update state to defualt value
                >
                    <MenuItem value={"basic"}>basic</MenuItem>
                    <MenuItem value={"islands"}>hours</MenuItem>
                    <MenuItem value={"something else"}>friends</MenuItem>
                </Select>
                <TextField id="outlined-search" label="precent" type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            </div>
            {/* </FormControl> */}
            {/* <FormControl sx={{ m: 1, minWidth: 120 }}> */}
            <div>
                <InputLabel id="terminate1-label">terminate condition</InputLabel>
                <Select
                    /* find a way to make it no draw on edges like regular labels */
                    labelId="terminate1-label"
                    style={{ minWidth: "300px" }}
                    id="terminate1-select"
                    value={mutation}
                    //label="Age" //no idea what does it do to add label need label id this doesnt add anything
                    onChange={mutationChange}
                    defaultValue="something" //remember to update state to defualt value
                >
                    <MenuItem value={"precent"}>precent</MenuItem>
                    <MenuItem value={"time"}>time</MenuItem>
                    <MenuItem value={"generation"}>generation</MenuItem>
                </Select>
                <TextField id="outlined-search" label="precent" type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            </div>


            {/* SUBMIT BUTTON */}

            <div style={{ display: "flex", float: "right", padding: "40px" }}>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ height: "50px", width: "100px" }}
                    onClick={() => { }}
                >
                    Submit
                </Button>
            </div>
            {/* </FormControl> */}

        </Paper>
    );
});
