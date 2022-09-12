import { Link, Typography } from "@mui/material";

export function Footer() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        <div>
        <Link color="inherit" href="https://www.projects.mta.ac.il/projects/evolutionary-shifts/">
        Evolutionary Shifts | Project 221004 | {new Date().getFullYear()}
        </Link>
        </div>
        <Link color="inherit" href="https://github.com/Amit-Asher/EvolutionaryShifts-Backend">
        Git Repository
        </Link>
        {" "}
      </Typography>
    );
  }