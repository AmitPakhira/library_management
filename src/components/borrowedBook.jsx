import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography, CircularProgress } from "@mui/material";

const BorrowBookPopup = ({ open, handleClose, onBorrow, user, loading }) => {
  const [formData, setFormData] = useState({
    user_id: "",
    book_id: "",
    amount: "",
  });

  // ✅ Auto-fill Book ID when "user" (selected book) is passed
  useEffect(() => {
    if (user && user.id) {
      setFormData((prevData) => ({
        ...prevData,
        book_id: user.id, // ✅ Auto-fill Book ID using "book.id"
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitting borrow request with data:", formData); // ✅ Debugging payload

    if (!formData.book_id || !formData.user_id || !formData.amount) {
      alert("All fields are required!"); // ✅ Prevent empty submission
      return;
    }

    onBorrow(formData); // ✅ Send the full formData object
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, borderRadius: 2 }}>
        <Typography variant="h6">Borrow Book</Typography>

        {/* ✅ Automatically show Book ID */}
        <TextField
          fullWidth
          margin="normal"
          label="Book ID"
          name="book_id"
          value={formData.book_id}
          disabled // ✅ Prevent user from editing
        />

        <TextField
          fullWidth
          margin="normal"
          label="User ID"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Borrow"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BorrowBookPopup;
