import React, { useState } from "react";
import { 
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";

export default function BorrowBook() {
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleConfirmOpen = () => {
    if (!userId || !bookId || !amount) {
      showSnackbar("All fields are required!", "error");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleBorrowBook = async () => {
    setConfirmOpen(false);
    setLoading(true);

    try {
      const response = await fetch("http://192.168.0.175:3000/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          book_id: bookId,
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to borrow book: ${response.statusText}`);
      }

      showSnackbar("Book borrowed successfully!", "success");

      // Clear input fields after borrowing
      setUserId("");
      setBookId("");
      setAmount("");
    } catch (error) {
      showSnackbar("Error borrowing book!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "auto", marginTop: 50 }}>
      <Typography variant="h4" component="h1" style={{ marginBottom: 24 }}>
        Borrow a Book
      </Typography>

      <TextField
        label="User ID"
        variant="outlined"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Book ID"
        variant="outlined"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Amount"
        variant="outlined"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirmOpen}
        disabled={loading}
        fullWidth
        style={{ marginTop: 20 }}
      >
        {loading ? <CircularProgress size={24} /> : "Borrow"}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Popup */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Borrow</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to borrow this book?
          </DialogContentText>
          <Typography><strong>User ID:</strong> {userId}</Typography>
          <Typography><strong>Book ID:</strong> {bookId}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBorrowBook} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
