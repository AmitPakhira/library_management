
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const EditProfilePopup = ({ open, handleClose, onBorrow, user, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    book_id: "",
    amount: "",
   
  });

  const [errors, setErrors] = useState({
    usear_id: "",
    book_id: "",
    amount: "",
   
  });

  useEffect(() => {
    if (user) {
      setFormData({
        usear_id: user.usear_id || "",
        book_id: user.book_id || "",
        amount: user.amount || "",
       
      });

      setErrors({
        usear_id: "",
        book_id: "",
        amount: "",
       
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "copies_available" ? parseInt(value, 10) || 0 : value, // Convert copies_available to number
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "",
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      usear_id: formData.usear_id.trim() === "",
      book_id: formData.book_id.trim() === "",
      amount: formData.amount.trim() === "",
      published_year: formData.published_year.trim() === "",
      category: formData.category.trim() === "",
      copies_available: formData.copies_available === 0, 
    };

    console.log("API POST Validation Errors:", newErrors);
    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) return;

    try {
      const apiUrl = "http://192.168.0.175:3000/books"; 

      const response = await fetch(apiUrl, {
        method: "POST", //
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("API Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add book: ${errorData.message || response.statusText}`);
      }

      const addedBook = await response.json();
      console.log("Book added successfully:", addedBook);

      onBorrow(addedBook);
      handleClose();
    } catch (error) {
      console.error("Error adding book:", error.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Book Details
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="USER_ID"
          name="USER_ID"
          value={formData.usear_id}
          onChange={handleChange}
          error={errors.usear_id}
          helperText={errors.usear_id ? "usear_id is required" : ""}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="BOOK_ID"
          name="BOOK_ID"
          value={formData.book_id}
          onChange={handleChange}
          error={errors.book_id}
          helperText={errors.book_id ? "book_id is required" : ""}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="AMOUNT"
          name="AMOUNT"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          helperText={errors.amount ? "amount is required" : ""}
          required
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Borrow"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProfilePopup;
