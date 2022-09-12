import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from "react";
import { globalStore } from "../stores/globalStore";
import { ArrangementStore } from "../stores/arrangementStore";
import TimeTable, { ReqSlotCell } from "../components/TimeTable/TimeTable";
import { useNavigate } from 'react-router-dom';
import { EmployeeDTO, EvolutionApi, EvolutionaryOperatorDTO, EvolutionStatusDTO, PublishApi, ShiftDTO, TermConditionsDTO } from "../swagger/stubs";
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
import { getDateIntervalDuration } from '@amcharts/amcharts5/.internal/core/util/Time';
import { PublishStore } from '../stores/publishStore';

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

export const PublishPage = observer(() => {
    const publishStore: PublishStore = globalStore.publishStore;
    const notificationStore: NotificationStore = globalStore.notificationStore;
    const navigate = useNavigate();
    const [status, setStatus] = useState<ComponentStatus>(
        ComponentStatus.LOADING
    );

    const [termCondsIncludes, setTermCondsIncludes] = useState<TermConditionsDTO[]>([]);

        //work for nkw just for tm with one value//can get the values from 'termCondsIncludes'
    let mapCond2DisplayName = new Map<string, string>([
        ["GenerationCount", "count"],
        ["ElapsedTime", "maxDuration"], 
        ["TargetFitness", "targetFitness"]
    ]);

    let mapCond2isInclude = new Map<string, Boolean>([
        ["GenerationCount", false],
        ["ElapsedTime", false],
        ["TargetFitness", false],
        ["Stagnation", false]
    ]);
    let mapCond2MaxVal = new Map<string, number>();
    let mapCond2ProgressVal = new Map<string, number>([
        ["GenerationCount", publishStore.progressBarGen],
        ["TargetFitness", publishStore.progressBarFitness],
        ["ElapsedTime", publishStore.progressBarTimer]
    ]);
    let mapCond2Val = new Map<string, number>([
        ["GenerationCount", 0],
        ["TargetFitness", 0],
        ["ElapsedTime", 0]
    ]);

    const setprogressBarWrapper = (type: string, num: number) => {
        let max = mapCond2MaxVal.get(type) || -1;
        let newVal = (num / max) * 100.0;//%

        switch(type){
            case "GenerationCount":
            {
                if (num <= max)
                {
                    publishStore.setProgressBarGen(newVal);
                }
                break;
            }
            case "TargetFitness":
            {
                if (num <= max)
                    publishStore.setProgressBarFitness(newVal);
                break;
            }
            case "ElapsedTime":
            {
                if (num <= max)
                    publishStore.setProgressBarTimer(newVal);
                else
                    publishStore.setProgressBarTimer(100);
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

    const getTermConditionsIncludes = async (): Promise<void> => {
        try {
            // GET REQUEST
            const res: TermConditionsDTO[] = await (new EvolutionApi()).getTermConditions({ credentials: 'include' });

            res.map((tm) => {
                let nameCond = tm.termCondition ?? "*error*";
                let displayName: string = mapCond2DisplayName.get(nameCond) ?? "*error*";
                let maxVal = 0;
                if(tm.params !== undefined)
                    maxVal= parseFloat(tm.params[displayName]);
                mapCond2MaxVal.set(nameCond, maxVal);
                mapCond2isInclude.set(nameCond, true);
            });

            setTermCondsIncludes(res);
            console.log("Success to get term conditions");
            if(res.length === 0)
                notificationStore.show({ message: "There is not term Condotions", severity: "warning" });
        } catch (err) {
            console.log('failed to get term conditions');
            notificationStore.show({ message: "Failed to ge term conditions", severity: "error" });
        }
    }

    const getEvolutionStatus = async (): Promise<EvolutionStatusDTO> => {
        try {
            // GET REQUEST
            const res: EvolutionStatusDTO = await (new EvolutionApi()).getSolution({ credentials: 'include' });
            publishStore.setFitness("Fitness: ".concat(res.fitness?.toFixed(3).toString() || ""));
            publishStore.setGenerationNumber("Generation Number: ".concat(res.generationNumber?.toString() || " "));
            publishStore.setElasedTime("Running time: ".concat(((res.elapsedTime || 0) / 1000).toString()).concat(" seconds"));
            return res;
        } catch (err) {
            console.log('failed to get evolution status');
            notificationStore.show({ message: "Failed to get evolution status", severity: "error" });
            return Promise.reject('evolution status is fale');
        }
    }

    const fetchRoles = async () => {
        const roles: string[] = await companyService.getRoles();
        publishStore.setAllRoles(roles);
    };

    const fetchTermConditionsIncludes = async () => {
        await getTermConditionsIncludes();
    };

    const fetchLastSolution = async () => {
        const res = await getEvolutionStatus();
        loadSolution(res.arrangement || []);
        UpdateStatusEvo(res);
    };

    const loadSolution =  (solution: ShiftDTO[]) => {
        if (publishStore.reqslots.length == 0) {
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
            publishStore.setReqslots(reqslotscell);
        }
    }

    const UpdateStatusEvo = (status: EvolutionStatusDTO) =>{
        let mapCond2CurrVal = new Map<string, number>([
            ["GenerationCount", status.generationNumber || 0],
            ["TargetFitness", status.fitness || 0],
            ["ElapsedTime", status.elapsedTime || 0]
        ]);

        mapCond2isInclude
        .forEach((value: Boolean, key: string) => {
            if(key !== "Stagnation")
                if(value)
                    setprogressBarWrapper(key, mapCond2CurrVal.get(key) || 0);
        });
    }

    const fetchProgress = async () => {
        console.log("in fetchProgress...");
        const res = await getEvolutionStatus();
        loadSolution(res.arrangement || []);
        UpdateStatusEvo(res);
        if(!res.finished)
        {
            setTimeout(checkForProgress, 500);
        }
        else{
            if((!(res.fitness === 100 && res.generationNumber === 1)) && mapCond2isInclude.get("Stagnation"))
            {
                let flag = false;
                mapCond2MaxVal.forEach((value: number, key: string) => {
                    if(value <= (mapCond2Val.get(key) || 0))
                        flag =true;            
                });            
    
                if(!flag)
                    publishStore.setStagnationStatus("End with Stagnation!");
            }

            notificationStore.show({ message: "The algorighm is over", severity: "info" });
        }
    }

    const checkForProgress = () => {
        setTimeout(() => {
            fetchProgress();
        }, 500);
    };

    useEffect(() => {
        fetchRoles();
        fetchTermConditionsIncludes();
        fetchLastSolution();
        setStatus(ComponentStatus.READY);

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

            {termCondsIncludes
            .filter(termCond => termCond.termCondition !== 'Stagnation') 
            .map((tm) => {
                return (<TermCondProgressBar
                    title={tm.termCondition ?? "*error*"}
                    map={mapCond2ProgressVal}
                />);
            })}

            <Label>{publishStore.stagnationStatus}</Label>


            <div style={{ marginBottom: "30px", display: 'flex' }}>
                <Label style={{ marginRight: "20px" }}>{publishStore.fitness}</Label>
                <Label style={{ marginRight: "20px" }}>{publishStore.generationNumber}</Label>
                <Label style={{ marginRight: "20px" }}>{publishStore.elasedTime}</Label>
            </div>
            <div style={{ backgroundColor: "#fff", padding: "20px" }}>
                <TimeTable
                    views={publishStore.allRoles}
                    slots={publishStore.reqslots}
                />
            </div>
            <Button id="ButtonPublish" variant="contained" disableElevation={true} style={{ marginBottom: "10px" }}
                onClick={(event) => {
                    if (publishStore.reqslots.length !== 0) {
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
