import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { Button } from "@mui/material";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.name.trim() === "" ||
      formData.email.trim() === "" ||
      formData.password.trim() === "" ||
      formData.role.trim() === ""
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Ensure role is lowercase to match DB constraint
    const cleanFormData = {
      ...formData,
      role: formData.role.toLowerCase(),
    };

    console.log("Sending form data:", cleanFormData);

    try {
      const response = await fetch("http://192.168.0.175:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "User created successfully!");
        setFormData({ name: "", email: "", password: "", role: "" });
      } else {
        setMessage(`Error: ${data.message || "Something went wrong."}`);
      }
    } catch (error) {
      setMessage("Error: Unable to connect to the server.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Welcome to Our Library</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>

        <Button
          variant="contained"
          color="primary"
          className="users-button"
          type="submit"
        >
          Create User
        </Button>

        <Button>
          <Link to="/Books" style={{ textDecoration: "none", color: "inherit" }}>
            Book List
          </Link>
        </Button>
      </form>

      {message && (
        <p className={message.toLowerCase().includes("success") ? "success" : "error"}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Home;
