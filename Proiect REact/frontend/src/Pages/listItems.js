import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import {useNavigate} from "react-router-dom";

const MainListItems = ({ userId }) => {
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path, { state: { key: userId } });
    };

    return (
        <React.Fragment>
            <ListItemButton onClick={() => handleNavigation('../dashboard')}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => handleNavigation('../profile')}>
                <ListItemIcon>
                    <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton onClick={() => handleNavigation('../accounts')}>
                <ListItemIcon>
                    <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText primary="Accounts" />
            </ListItemButton>
            <ListItemButton onClick={() => handleNavigation('../transactions')}>
                <ListItemIcon>
                    <CompareArrowsIcon />
                </ListItemIcon>
                <ListItemText primary="Transactions" />
            </ListItemButton>
        </React.Fragment>
    );
}

export default MainListItems;