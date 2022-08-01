import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useState } from "react";
import { globalStore } from "../stores/globalStore";
import { ArrangementStore } from "../stores/arrangementStore";
import TimeTable from "../components/TimeTable/TimeTable";
import { useNavigate } from 'react-router-dom';
import { AlgorithmConfigDTO, EmployeeDTO, EvolutionApi, EvolutionStatusDTO, GenericResponseDTO, ShiftDTO } from "../swagger/stubs";
import { ComponentStatus } from "../interfaces/common";
import { companyService } from "../services/companyService";
import { mock } from "../mocks/mockData";
import { LoadingPaper } from "../components/Loading/LoadingPaper";
import { Button } from '@mui/material';





const getSolution = async (): Promise<ShiftDTO[]> => {
    try {
         // GET REQUEST
         const res: EvolutionStatusDTO = await (new EvolutionApi()).getSolution();
         const arrangement: ShiftDTO[] = res.arrangement || [];
        return arrangement;
    } catch (err) {
        console.log('failed to get solution');
        return [];
    }
}



const solveArrangement = async (algoConfig: AlgorithmConfigDTO): Promise<void> => {
    try {
         // GET REQUEST
        const res: GenericResponseDTO = await (new EvolutionApi()).solveArrangement({
            crossover: algoConfig.crossover,
            elitism: algoConfig.elitism,
            mutations: algoConfig.mutations,
            populationSize: algoConfig.populationSize,
            selection: algoConfig.selection,
            terminationCondition: algoConfig.terminationCondition

        });
        ///const isSolving: boolean = res.success || false;
        console.log('Success to get solution');
        return;
    } catch (err) {
        console.log('failed to get solution');
        return;
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





    const [solution, setSolution] = useState<ShiftDTO[]>([]);
    const fetchSolution = async () => {
        const arrangement = await getSolution();
        setSolution(arrangement);
    }


    const fetchRoles = async () => {
        const employees: EmployeeDTO[] = await companyService.getEmployees();
        const roles: string[] = await companyService.getRoles();
        setAllRoles(roles);
        setAllEmployees(employees);
        setAllRules(mock.rules); // TODO: add route to api and get rules metadata from there
        setStatus(ComponentStatus.READY);
      };

    useEffect(() => {
        fetchRoles();
        //fetchSolution();
      }, []);
    
      if (status !== ComponentStatus.READY) {
        return <LoadingPaper />;
      }


  return (<>
    <Paper sx={{ margin: "auto", overflow: "hidden" }}>
    <Button id="ButtonSolution" variant="contained" disableElevation={true} onClick={(event) => {
            //i think we need to add to the store the algo config or get it from server or something
            //solveArrangement(algoConfig);
            fetchSolution();
            for (let i = 0; i < solution.length; i++) {
               //const day = solution[i].startTime;//how the hill i can get the day 

            }
        }}
        >Get Solution</Button>
        <div style={{ backgroundColor: "#fff", padding: "20px" }}>
        <TimeTable
          views={allRoles}
          slots={arrangementStore.reqSlots}
          setSlots={arrangementStore.setReqSlots}
        />
      </div>
    </Paper>
    </>
  );
});
