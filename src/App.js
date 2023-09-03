import './App.css';
import { Route, Routes, NavLink } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import ManageCustomerPage from './pages/customer/ManageCustomerPage';
import ManageItemPage from './pages/item/ManageItemPage';
import ManageOrdersPage from './pages/orders/ManageOrdersPage';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const nav_icons = [<HomeIcon />, <PersonIcon />, <ShoppingCartIcon />, <ReceiptLongIcon />]

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open} style={{ backgroundColor: "#fff", boxShadow: "none" }}>
        <Toolbar>
          <IconButton
            className='toggle-button'
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
            style={{
              backgroundColor: isHovering ? "#5E35B1" : "#EDE7F6",
              borderRadius: "15px",
              color: isHovering ? "#A58ED3" : "#9478CB"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" style={{ color: "black" }}>
            Pos System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer style={{ backgroundColor: "#000" }} variant="permanent" open={open} >
        <DrawerHeader >
          <IconButton onClick={handleDrawerClose}
            style={{
              backgroundColor: isHovering ? "#5E35B1" : "#EDE7F6",
              borderRadius: "15px",
              color: isHovering ? "#A58ED3" : "#9478CB"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {theme.direction === 'rtl' ? "" : <KeyboardDoubleArrowLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <List >
          {['Home', 'Customer', 'Item', 'Order'].map((text, index) => (
            <NavLink style={{ textDecoration: "none" }} key={text} to={'/' + (index === 0 ? "" : text)} >
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {nav_icons[index]}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Drawer>
      <Box style={{ backgroundColor: "#EEF2F6", width: "94%", margin: "65px 10px 0 10px", borderRadius: "25px" }}>
        <Routes >
          <Route path='' element={<HomePage />} />
          <Route path='/customer' element={<ManageCustomerPage />} />
          <Route path='/item' element={<ManageItemPage />} />
          <Route path='/order' element={<ManageOrdersPage />} />
        </Routes>
      </Box>
    </Box>
  );
}
