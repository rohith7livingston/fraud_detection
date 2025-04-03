import { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, TextField, InputAdornment, Menu, MenuItem, Badge, Avatar, Box } from "@mui/material";
import { Search, Notifications, Logout, AccountCircle, Settings } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#DC2626", boxShadow: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Left: Logo & Search */}
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
          Fraud Detection
        </Typography>

        <TextField
          variant="outlined"
          placeholder="Search transactions..."
          size="small"
          sx={{
            bgcolor: "white",
            borderRadius: "8px",
            width: { xs: "140px", sm: "220px", md: "280px" },
            "& .MuiOutlinedInput-root": { paddingLeft: "8px" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Center: Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {["Dashboard", "Transactions", "Review Team", "Reports"].map((text, index) => (
            <Link
              key={index}
              to={`/${text.toLowerCase().replace(" ", "-")}`}
              style={{
                color: "white",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "8px",
                transition: "background-color 0.3s ease",
              }}
              className="nav-link"
            >
              {text}
            </Link>
          ))}
        </Box>

        {/* Right: Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: "white", color: "black" }}>
              <AccountCircle />
            </Avatar>
          </IconButton>

          {/* User Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: "40px" }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 1 }} /> Profile Settings
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Hover effect via CSS-in-JS */}
      <style>
        {`
          .nav-link:hover {
            background-color: rgba(255,255,255,0.2);
          }
        `}
      </style>
    </AppBar>
  );
}
