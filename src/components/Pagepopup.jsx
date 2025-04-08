import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const Pagepopup = ({ open, handleClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    published_year: "",
    category: "",
    copies_available: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.0.175:3000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const savedBook = await response.json();

      // ✅ Trigger parent's refresh & close
      onBookAdded(savedBook);
      handleClose();
    } catch (error) {
      console.error("Error adding book:", error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Book</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Author"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="ISBN"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Published Year"
          name="published_year"
          value={formData.published_year}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Copies Available"
          name="copies_available"
          type="number"
          value={formData.copies_available}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Pagepopup;
