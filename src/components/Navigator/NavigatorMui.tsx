import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';

const categories = [
  {
    id: 'General',
    children: [
      { id: 'Arrangement', icon: <CalendarMonthIcon />, active: true },
      { id: 'Employees', icon: <PeopleIcon /> },
      { id: 'Requests', icon: <ChatOutlinedIcon /> },
      { id: 'History', icon: <HistoryIcon /> },
      { id: 'Settings', icon: <SettingsIcon /> },
    ],
  },
  {
    id: 'Business',
    children: [
      { id: 'Premuim', icon: <WorkspacePremiumIcon sx={{ color: '#ECB365'}} /> },
      { id: 'Contact us', icon: <MailOutlineOutlinedIcon /> },
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function NavigatorMui(props: DrawerProps) {
  const { ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding style={{ marginTop: '20px' }}>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>
          Evolutionary Shifts
        </ListItem>

        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Project Overview</ListItemText>
        </ListItem>

        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton selected={active} sx={item}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText {...(childId === 'Premuim' && { style: { color: '#ECB365' }})}>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}