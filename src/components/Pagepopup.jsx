import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const AddBookPopup = ({ open, handleClose, onSave, book, loading }) => {
  const [formData, setFormData] = useState({
    book_id: "",  // Include book_id
    title: "",
    author: "",
    isbn: "",
    published_year: "",
    category: "",
    copies_available: "",
  });

  const [errors, setErrors] = useState({
    title: false,
    author: false,
    isbn: false,
    published_year: false,
    category: false,
    copies_available: false,
  });

  useEffect(() => {
    if (book) {
      setFormData({
        book_id: book._id || "",  // Auto-fill book ID if editing
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        published_year: book.published_year || "",
        category: book.category || "",
        copies_available: book.copies_available || "",
      });

      setErrors({
        title: false,
        author: false,
        isbn: false,
        published_year: false,
        category: false,
        copies_available: false,
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "copies_available" ? parseInt(value, 10) || 0 : value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "",
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      title: !formData.title.trim(),
      author: !formData.author.trim(),
      isbn: !formData.isbn.trim(),
      published_year: !formData.published_year.trim(),
      category: !formData.category.trim(),
      copies_available: formData.copies_available <= 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) return;

    try {
      const apiUrl = book ? `http://192.168.0.175:3000/books/${formData.book_id}` : "http://192.168.0.175:3000/books";

      const response = await fetch(apiUrl, {
        method: book ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to ${book ? "update" : "add"} book: ${errorData.message || response.statusText}`);
      }

      const savedBook = await response.json();
      onSave(savedBook);
      handleClose();
    } catch (error) {
      console.error("Error saving book:", error.message);
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
          {book ? "Edit Book Details" : "Add Book"}
        </Typography>

        {book && (
          <TextField
            fullWidth
            margin="normal"
            label="Book ID"
            name="book_id"
            value={formData.book_id}
            disabled  // Make book_id readonly
          />
        )}

        {["title", "author", "isbn", "published_year", "category"].map((field) => (
          <TextField
            key={field}
            fullWidth
            margin="normal"
            label={field.replace("_", " ").toUpperCase()}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            error={errors[field]}
            helperText={errors[field] ? `${field.replace("_", " ")} is required` : ""}
            required
          />
        ))}

        <TextField
          fullWidth
          margin="normal"
          label="Copies Available"
          name="copies_available"
          type="number"
          value={formData.copies_available}
          onChange={handleChange}
          error={errors.copies_available}
          helperText={errors.copies_available ? "Copies Available must be greater than 0" : ""}
          required
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : book ? "Update" : "Save"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddBookPopup;


