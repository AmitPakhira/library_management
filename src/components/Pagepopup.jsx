import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const EditProfilePopup = ({ open, handleClose, onSave, user, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    published_year: "",
    category: "",
    copies_available: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    author: "",
    isbn: "",
    published_year: "",
    category: "",
    copies_available: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        title: user.title || "",
        author: user.author || "",
        isbn: user.isbn || "",
        published_year: user.published_year || "",
        category: user.category || "",
        copies_available: user.copies_available || "",
      });

      setErrors({
        title: "",
        author: "",
        isbn: "",
        published_year: "",
        category: "",
        copies_available: "",
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
      title: formData.title.trim() === "",
      author: formData.author.trim() === "",
      isbn: formData.isbn.trim() === "",
      published_year: formData.published_year.trim() === "",
      category: formData.category.trim() === "",
      copies_available: formData.copies_available === 0, // Ensure copies_available is not empty or 0
    };

    console.log("API POST Validation Errors:", newErrors);
    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) return;

    try {
      const apiUrl = "http://192.168.0.175:3000/books"; // Ensure this is correct

      const response = await fetch(apiUrl, {
        method: "POST", // Make sure POST is the correct method for adding books
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

      onSave(addedBook);
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
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          helperText={errors.title ? "Title is required" : ""}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          error={errors.author}
          helperText={errors.author ? "Author is required" : ""}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="ISBN"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          error={errors.isbn}
          helperText={errors.isbn ? "ISBN is required" : ""}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Published Year"
          name="published_year"
          value={formData.published_year}
          onChange={handleChange}
          error={errors.published_year}
          helperText={errors.published_year ? "Published Year is required" : ""}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          helperText={errors.category ? "Category is required" : ""}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Copies Available"
          name="copies_available"
          type="number"
          value={formData.copies_available}
          onChange={handleChange}
          error={errors.copies_available}
          helperText={errors.copies_available ? "Copies Available is required" : ""}
          required
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
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
