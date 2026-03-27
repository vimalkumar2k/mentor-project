import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { 
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
    IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Avatar, Menu, MenuItem
} from '@mui/material';
import { 
    Menu as MenuIcon, Dashboard, Person, Description, 
    ExitToApp, Group, Business, Settings 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const studentLinks = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/student/dashboard' },
        { text: 'My Profile', icon: <Person />, path: '/student/profile' },
        { text: 'Mentoring Form', icon: <Description />, path: '/student/form' },
    ];

    const staffLinks = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/staff/dashboard' },
        { text: 'My Profile', icon: <Person />, path: '/staff/profile' },
        { text: 'My Students', icon: <Group />, path: '/staff/students' },
    ];

    const hodLinks = [
        { text: 'Admin Dashboard', icon: <Dashboard />, path: '/hod/dashboard' },
        { text: 'My Profile', icon: <Person />, path: '/hod/profile' },
        { text: 'Departments', icon: <Business />, path: '/hod/departments' },
        { text: 'All Mentors', icon: <Group />, path: '/hod/mentors' },
        { text: 'All Students', icon: <Group />, path: '/hod/students' },
    ];

    const links = user?.role === 'Student' ? studentLinks : 
                  user?.role === 'Staff' ? staffLinks : hodLinks;

    const drawer = (
        <div>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                    MMS Portal
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ px: 2 }}>
                {links.map((link) => (
                    <ListItem key={link.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton 
                            component={Link} 
                            to={link.path}
                            sx={{ borderRadius: 2 }}
                        >
                            <ListItemIcon color="primary">
                                {link.icon}
                            </ListItemIcon>
                            <ListItemText primary={link.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List sx={{ px: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                        <ListItemIcon><ExitToApp color="error" /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid #e2e8f0'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {user?.role} Portal
                    </Typography>
                    <IconButton onClick={handleMenuOpen}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {user?.name?.charAt(0)}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            const path = user?.role === 'Student' ? '/student/profile' : 
                                       user?.role === 'Staff' ? '/staff/profile' : '/hod/profile';
                            navigate(path);
                        }}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e2e8f0' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', mt: 8 }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
