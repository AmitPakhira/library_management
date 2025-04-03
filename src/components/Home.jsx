import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { useEffect } from "react";
import { Button } from "@mui/material";


const Home = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim() === "" || formData.email.trim() === "") {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://192.168.0.175:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); 
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("Error: Unable to connect to the server.");
    }
  };


  return (
    <>
    <div className="signup-container">
      <h2>WellCome to Our Library </h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <lable>Password:</lable>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        
        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>

        <Button
          variant="contained" 
          color="primary" 
          className="users-button"
          onClick={handleSubmit}
        >
          Create User
        </Button> 
        <Button>
          <Link to="/Books">Book List</Link></Button>    
      </form>
      {message && <p className={message.includes("successful") ? "success" : "error"}>{message}</p>}
    </div>
    </>
  );
};

export default Home;
