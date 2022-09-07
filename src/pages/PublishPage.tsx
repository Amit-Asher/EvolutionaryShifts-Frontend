import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useState } from "react";
import { globalStore } from "../stores/globalStore";
import { ArrangementStore } from "../stores/arrangementStore";
import TimeTable, { ReqSlotCell } from "../components/TimeTable/TimeTable";
import { useNavigate } from 'react-router-dom';
import { EmployeeDTO, EvolutionApi, EvolutionaryOperatorDTO, EvolutionStatusDTO, PublishApi, ShiftDTO } from "../swagger/stubs";
import { ComponentStatus } from "../interfaces/common";
import { companyService } from "../services/companyService";
import { mock } from "../mocks/mockData";
import { LoadingPaper } from "../components/Loading/LoadingPaper";
import { Button, styled } from '@mui/material';
import PropTypes from "prop-types";
import { makeStyles } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import { evolutionService } from '../services/evolutionService';
import { EvolutionStore } from '../stores/evolutionStore';
import { TermCondProgressBar } from '../components/TermCondProgressBar/TermConfProgressBar';
import { NotificationStore } from '../stores/notificationStore';

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;


export const PublishPage = observer(() => {
    const evolutionStore: EvolutionStore = globalStore.evolutionStore;
    const notificationStore: NotificationStore = globalStore.notificationStore;
    const navigate = useNavigate();
    const [allRoles, setAllRoles] = useState<string[]>([]);
    const [allEmployees, setAllEmployees] = useState<EmployeeDTO[]>([]);//maybe there is no nedd in this
    const [allRules, setAllRules] = useState<string[]>([]);//maybe there is no nedd in this
    const [status, setStatus] = useState<ComponentStatus>(
        ComponentStatus.LOADING
    );
    const [reqslots, setReqSlots] = useState<ReqSlotCell[]>([]);
    const [generationNumber, setGenerationNumber] = useState<string>(" ");
    const [fitness, setFitness] = useState<string>(" ");


    const [progressBarGen, setProgressBarGen] = useState<number>(0);
    const [progressBarFitness, setProgressBarFitness]= useState<number>(0);
    const [progressBarTimer, setProgressBarTimer]= useState<number>(0);
    const [stagnationStatus, setStagnationStatus]= useState<string>("");
    

    let mapCond2DisplayName = new Map<string, string>([
        ["GenerationCount", "count"],
        ["ElapsedTime", "maxDuration"],
        ["TargetFitness", "targetFitness"]
    ]);
    let mapCond2isInclude = new Map<string, Boolean>([
        ["GenerationCount", false],
        ["ElapsedTime", false],
        ["TargetFitness", false]
    ]);
    let mapCond2MaxVal = new Map<string, number>();
    let mapCond2ProgressVal = new Map<string, number>([
        ["GenerationCount", progressBarGen],
        ["TargetFitness", progressBarFitness],
        ["ElapsedTime", progressBarTimer]
    ]);
    let mapCond2Val = new Map<string, number>([
        ["GenerationCount", 0],
        ["TargetFitness", 0],
        ["ElapsedTime", 0]
    ]);

    const setprogressBarWrapper = (type: string, num: number) => {
        let max = mapCond2MaxVal.get(type) || -1;
        let newVal = (num / max) * 100.0;

        switch(type){
            case "GenerationCount":
            {
                if (num <= max)
                {
                    setProgressBarGen(newVal);
                }
                break;
            }
            case "TargetFitness":
            {
                if (num <= max)
                    setProgressBarFitness((num / max) * 100.0);
                break;
            }
            case "ElapsedTime":
            {
                if (num <= max)
                    setProgressBarTimer((num / max) * 100.0);
                break;
            }
        }

        mapCond2Val.set(type, num);
    }

    const publishArrangement = async (): Promise<void> => {
        try {
            // POST REQUEST
            const res = await (new PublishApi()).publishArrangement({ credentials: 'include' });
            console.log(res.message);
            notificationStore.show({ message: res.message || "**error**", severity: "success" });
        } catch (err) {
            console.log('failed to publish arrangement');
        }
    }

    const getEvolutionStatus = async (): Promise<EvolutionStatusDTO> => {
        try {
            // GET REQUEST
            const res: EvolutionStatusDTO = await (new EvolutionApi()).getSolution({ credentials: 'include' });
            setFitness("Fitness: ".concat(res.fitness?.toString() || ""));
            setGenerationNumber("Generation Number: ".concat(res.generationNumber?.toString() || " "));
            // notificationStore.show({ message: "Success to get evolution status", severity: "success" });
            return res;
        } catch (err) {
            console.log('failed to get evolution status');
            notificationStore.show({ message: "Failed to get evolution status", severity: "error" });
            return Promise.reject('evolution status is fale');
        }
    }

    const fetchRoles = async () => {
        const employees: EmployeeDTO[] = await companyService.getEmployees();
        const roles: string[] = await companyService.getRoles();
        setAllRoles(roles);
        setAllEmployees(employees);
        setAllRules(mock.rules); // TODO: add route to api and get rules metadata from there
        setStatus(ComponentStatus.READY);
    };

    const loadSolution =  (solution: ShiftDTO[]) => {
        if (reqslots.length == 0) {
            let map: { [key: string]: ShiftDTO[] } = {};
            for (let i = 0; i < solution.length; i++) {
                const key: any = `${solution[i].startTime || ''}-${solution[i].endTime || ''}-${solution[i].role || ''}`;
                if (Object.keys(map).includes(key)) {
                    map[key].push(solution[i]);
                }
                else {
                    map[key] = [solution[i]];
                }
            }

            const reqslotscell: ReqSlotCell[] = Object.values(map).map((shiftsInSlot: ShiftDTO[], idx) => {
                return {
                    id: idx,
                    startDate: new Date(shiftsInSlot[0].startTime || "error_start_date"),
                    endDate: new Date(shiftsInSlot[0].endTime || "error_end_date"),
                    minPersonnelSize: 0,
                    maxPersonnelSize: 0,
                    title: shiftsInSlot.reduce((acc: string, cur: ShiftDTO) => acc.concat(cur.employeeName || ''), ''),
                    role: shiftsInSlot[0].role || "error_role"
                };
            });
            setReqSlots(reqslotscell);
            //console.log(`reqslots: ${JSON.stringify(reqslots, undefined, 2)}`);
        }
    }

    const fetchProgress = async () => {
        console.log("in fetchProgress...");
        const res = await getEvolutionStatus();
        loadSolution(res.arrangement || []);
        if(!res.finished)
        {
            let mapCond2CurrVal = new Map<string, number>([
                ["GenerationCount", res.generationNumber || 0],
                ["TargetFitness", res.fitness || 0],
                ["ElapsedTime", res.elapsedTime || 0]
            ]);

            mapCond2isInclude.forEach((value: Boolean, key: string) => {
                if(value)
                    setprogressBarWrapper(key, mapCond2CurrVal.get(key) || 0);
            });
            setTimeout(checkForProgress, 500);
        }
        else{
            let mapCond2CurrVal = new Map<string, number>([
                ["GenerationCount", res.generationNumber || 0],
                ["TargetFitness", res.fitness || 0],
                ["ElapsedTime", res.elapsedTime || 0]
            ]);

            mapCond2isInclude.forEach((value: Boolean, key: string) => {
                if(value)
                    setprogressBarWrapper(key, mapCond2CurrVal.get(key) || 0);
            });
            let flag = false;
            mapCond2MaxVal.forEach((value: number, key: string) => {
                if(value == mapCond2Val.get(key))
                    flag =true;            
            });            

            if(!flag)
                setStagnationStatus("End with Stagnation!");
        }
    }

    const checkForProgress = () => {
        setTimeout(() => {
            fetchProgress();
        }, 500);
    };

    useEffect(() => {
        fetchRoles();
        
        evolutionStore.termConds.map((termCond: EvolutionaryOperatorDTO) => {
            let displayName: string = mapCond2DisplayName.get(termCond.type ?? "*error*") ?? "*error*";
            mapCond2MaxVal.set(termCond.type ?? "*error*", termCond.params[displayName]);
            mapCond2isInclude.set(termCond.type ?? "*error*", true);
        });
        
        if (evolutionService.getIsSolving()) {
            checkForProgress();
        }
        evolutionService.setIsSolving(false);
    }, []);

    if (status !== ComponentStatus.READY) {
        return <LoadingPaper />;
    }

    return (<>
        <Paper sx={{ margin: "auto", overflow: "hidden" }}>

            <Label>Term Conditions Status</Label>
            {evolutionStore.termConds
            .filter(termCond => termCond.type !== '' && termCond.type !== 'Stagnation')
            .map((termCond: EvolutionaryOperatorDTO) => {
                return (<TermCondProgressBar
                    title={termCond.type ?? "*error*"}
                    map={mapCond2ProgressVal}
                />);
            })}
            <Label>{stagnationStatus}</Label>


            <div style={{ marginBottom: "30px", display: 'flex' }}>
                <Label style={{ marginRight: "20px" }}>{fitness}</Label>
                <Label>{generationNumber}</Label>
            </div>
            <div style={{ backgroundColor: "#fff", padding: "20px" }}>
                <TimeTable
                    views={allRoles}
                    slots={reqslots}
                />
            </div>
            <Button id="ButtonPublish" variant="contained" disableElevation={true} style={{ marginBottom: "10px" }}
                onClick={(event) => {
                    if (reqslots.length !== 0) {
                        publishArrangement();
                        const btn = document.getElementById('ButtonPublish') as HTMLButtonElement | null;
                        btn?.setAttribute('disabled', '');
                    }
                    else {
                        console.log("You need to get solution first");
                        notificationStore.show({ message: "You need to get solution first", severity: "info" });
                    }
                }}>
                Publish
            </Button>
        </Paper>
    </>
    );
});
