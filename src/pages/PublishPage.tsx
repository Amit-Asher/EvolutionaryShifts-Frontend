import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useState } from "react";
import { globalStore } from "../stores/globalStore";
import { ArrangementStore } from "../stores/arrangementStore";
import TimeTable, { ReqSlotCell } from "../components/TimeTable/TimeTable";
import { useNavigate } from 'react-router-dom';
import { EmployeeDTO, EvolutionApi, EvolutionStatusDTO, PublishApi, ShiftDTO } from "../swagger/stubs";
import { ComponentStatus } from "../interfaces/common";
import { companyService } from "../services/companyService";
import { mock } from "../mocks/mockData";
import { LoadingPaper } from "../components/Loading/LoadingPaper";
import { Button, styled } from '@mui/material';

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const publishArrangement = async (): Promise<void> => {
    try {
        // POST REQUEST
        const res = await (new PublishApi()).publishArrangement({ credentials: 'include' });
        console.log(res.message);
        globalStore.notificationStore.show({ message: res.message || "**error**", severity:"success" });
    } catch (err) {
        console.log('failed to publish arrangement');
    }
}

const getSolution = async (setFitness: React.Dispatch<React.SetStateAction<string>>, setGenerationNumber: React.Dispatch<React.SetStateAction<string>>): Promise<ShiftDTO[]> => {
    try {
        // GET REQUEST
        const res: EvolutionStatusDTO = await (new EvolutionApi()).getSolution({ credentials: 'include' });
        const arrangement: ShiftDTO[] = res.arrangement || [];
        setFitness("Fitness: ".concat(res.fitness?.toString() || ""));
        setGenerationNumber("Generation Number: ".concat(res.generationNumber?.toString() || " "));
        console.log('Success to get solution');
        globalStore.notificationStore.show({ message: "Success to get solution", severity:"success" });
        return arrangement;
        
    } catch (err) {
        console.log('failed to get solution');
        globalStore.notificationStore.show({ message: "Failed to get solution", severity:"error" });
        return [];
    }
}


export const PublishPage = observer(() => {
    const arrangementStore: ArrangementStore = globalStore.arrangementStore;
    const navigate = useNavigate();
    const [allRoles, setAllRoles] = useState<string[]>([]);
    const [allEmployees, setAllEmployees] = useState<EmployeeDTO[]>([]);
    const [allRules, setAllRules] = useState<string[]>([]);
    const [status, setStatus] = useState<ComponentStatus>(
        ComponentStatus.LOADING
    );
    const [reqslots, setReqSlots] = useState<ReqSlotCell[]>([]);
    const [generationNumber, setGenerationNumber] = useState<string>(" ");
    const [fitness, setFitness] =  useState<string>(" ");
    
    const fetchRoles = async () => {
        const employees: EmployeeDTO[] = await companyService.getEmployees();
        const roles: string[] = await companyService.getRoles();
        setAllRoles(roles);
        setAllEmployees(employees);
        setAllRules(mock.rules); // TODO: add route to api and get rules metadata from there
        setStatus(ComponentStatus.READY);
    };

    const loadSolution = async (setFitness: React.Dispatch<React.SetStateAction<string>>, setGenerationNumber: React.Dispatch<React.SetStateAction<string>>) => {
        if (reqslots.length == 0) {
            const solution = await getSolution(setFitness, setGenerationNumber);
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

    useEffect(() => {
        fetchRoles();
    }, []);

    if (status !== ComponentStatus.READY) {
        return <LoadingPaper />;
    }
    

    return (<>
        <Paper sx={{ margin: "auto", overflow: "hidden" }}>
        <div style={{ marginBottom: "30px", display: 'flex' }}>
        <Label style={{marginRight: "20px"}}>{fitness}</Label>
        <Label>{generationNumber}</Label>
        </div>
        <Button id="ButtonSolution" variant="contained" disableElevation={true} onClick={async (event) =>{ 
            loadSolution(setFitness, setGenerationNumber);
            const btn = document.getElementById('ButtonSolution') as HTMLButtonElement | null;
            // Set disabled attribute
            btn?.setAttribute('disabled', '');}}>
         Get Solution
        </Button>
        <div style={{ backgroundColor: "#fff", padding: "20px" }}>
            <TimeTable
                views={allRoles}
                slots={reqslots}
            />
        </div>
        <Button id="ButtonPublish" variant="contained" disableElevation={true} style={{marginBottom:"10px"}}
        onClick={(event) => {
            if(reqslots.length !== 0){
                publishArrangement();
                const btn = document.getElementById('ButtonPublish') as HTMLButtonElement | null;
                // Set disabled attribute
                btn?.setAttribute('disabled', '');

                //Remove disabled attribute
                // btn?.removeAttribute('disabled');
            }
            else{
                console.log("You need to get solution first");
                globalStore.notificationStore.show({ message: "You need to get solution first", severity:"info" });
            }
        }}>
         Publish
        </Button>
        </Paper>
    </>
    );
});
