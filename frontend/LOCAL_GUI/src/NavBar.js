import React, { useState } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, useMediaQuery } from '@material-ui/core/';
import MenuIcon from "@material-ui/icons/Menu";
// import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { NavLink } from 'react-router-dom';
// import app from './Auth/base';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1
    },
    NavBar:{
        background: '#3571b4'
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      [theme.breakpoints.down("xs")]: {
        flexGrow: 1
      }
    },
    headerOptions: {
      display: "flex",
      flex: 1,
      justifyContent:"flex-end"
    }
}));

const CustomizedButton = withStyles({
    root:{
        // background: '#fff',
        // fontWeight: "bold",
        color: '#fff',
        marginLeft: 20,
        '&:hover': {
            backgroundColor: '#fff',
            color: '#000'
        }
    }
})(Button)

const Brand = withStyles({
    root:{
        color: '#fff',
        textDecoration: 'none'
    }
})(Typography)

export default function NavBar() {

    const classes = useStyles();
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const [menu, setMenu] = useState(null);
    const openMenu = Boolean(menu);
    // const [settings, setSettings] = useState(null);
    // const openSettings = Boolean(settings);

    const handleMenu = event => {
        setMenu(event.currentTarget);
    };

    // const handleSettings = event => {
    //     setSettings(event.currentTarget);
    // };

    const menuItems = [
        {
          menuTitle: "Devices",
          pageURL: "/"
        },
        {
          menuTitle: "Divisions",
          pageURL: "/divisions"
        },
        {
            menuTitle: "Statistics",
            pageURL: "/statistics"
        },
        {
          menuTitle: "Scenes",
          pageURL: "/scenes"
        },
        // {
        //   menuTitle: "Graphics",
        //   pageURL: "/graphics"
        // }
      ];
    
    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.NavBar}>
                <Toolbar>
                    <Brand variant="h6" className={classes.title} component={NavLink} to="/">
                        ZIGBEE
                    </Brand>
                    { isMobile ? (
                        <>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={menu}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                open={openMenu}
                                onClick={() => setMenu(null)}
                                onClose={() => setMenu(null)}
                            >
                                {menuItems.map(menuItem => {
                                    const { menuTitle, pageURL } = menuItem;
                                    return (
                                        <MenuItem component={NavLink} to={pageURL} key={menuTitle}>
                                                {menuTitle}
                                        </MenuItem>
                                    );
                                })}
                            </Menu>
                            {/* <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                // aria-label="menu"
                                onClick={() => app.auth().signOut()}
                            >
                                <ExitToAppIcon />
                            </IconButton> */}
                        </>
                        ) : (
                            <div className={classes.headerOptions}>
                                <CustomizedButton component={NavLink} to="/">Devices</CustomizedButton>
                                <CustomizedButton component={NavLink} to="/divisions">Divisions</CustomizedButton>
                                <CustomizedButton component={NavLink} to="/statistics">Statistics</CustomizedButton>
                                {/* <CustomizedButton component={NavLink} to="/graphics">Graphics</CustomizedButton> */}
                                <CustomizedButton component={NavLink} to="/scenes">Scenes</CustomizedButton>
                                {/* <CustomizedButton onClick={() => app.auth().signOut()}><ExitToAppIcon /></CustomizedButton> */}
                            </div>
                        )}
                        
                    
                </Toolbar>
            </AppBar>
        </div>
    )
}
