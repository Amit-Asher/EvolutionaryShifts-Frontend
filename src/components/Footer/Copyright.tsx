import { Link, Typography } from "@mui/material";

export function Footer() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        <Link color="inherit" href="https://www.projects.mta.ac.il/projects/evolutionary-shifts/">
        Evolutionary Shifts | project 221004 | {new Date().getFullYear()}
        </Link>{" "}
      </Typography>
    );
  }