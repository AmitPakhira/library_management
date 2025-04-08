import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TableBody,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Pagepopup from "./Pagepopup";
import BorrowBookPopup from "./borrowedBook";
// import Return from "./Return";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetchBooks();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.0.175:3000/books");
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data);
      showSnackbar("Books fetched successfully!", "success");
    } catch (error) {
      showSnackbar("Error fetching books!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setBorrowOpen(true);
  };

  const handleBorrowBook = async (borrowData) => {
    if (!borrowData) return;
    try {
      const response = await fetch("http://192.168.0.175:3000/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrowData),
      });

      if (!response.ok) {
        throw new Error(`Failed to borrow book: ${response.statusText}`);
      }

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === borrowData.book_id
            ? { ...book, copies_available: book.copies_available - 1 }
            : book
        )
      );

      showSnackbar("Book borrowed successfully!", "success");
      setBorrowOpen(false);
    } catch (error) {
      showSnackbar("Error borrowing book!", "error");
    }
  };

  const filteredBooks = [...books].sort((a, b) => {
    const aMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const bMatch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
  
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "80px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          px: 4,
          boxShadow: 3,
          zIndex: 1100,
        }}
      >
        {/* Add Book Button */}
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add Book
        </Button>

        {/* BOOK Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
              
            letterSpacing: 2,
          }}
        >
          BOOK
        </Typography>

        {/* Search Box */}
        <TextField
  placeholder="Search"
  variant="outlined"
  size="small"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <SearchIcon />
      </InputAdornment>
    ),
  }}
/>

      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4, mt: '80px' }}>
      <Pagepopup
  open={open}
  handleClose={() => setOpen(false)}
  onBookAdded={() => {
    setOpen(false);
    fetchBooks(); // ✅ refreshes book list
    showSnackbar("Book added successfully!", "success");
  }}
/>


        {loading && !books.length ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "common.white" }}>Book ID</TableCell>
                  <TableCell sx={{ color: "common.white" }}>Title</TableCell>
                  <TableCell sx={{ color: "common.white" }}>Author</TableCell>
                  <TableCell sx={{ color: "common.white" }}>ISBN</TableCell>
                  <TableCell sx={{ color: "common.white" }}>Published Date</TableCell>
                  <TableCell sx={{ color: "common.white" }}>Category</TableCell>
                  <TableCell sx={{ color: "common.white" }}>Copies</TableCell>
                  <TableCell sx={{ color: "common.white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBooks.map((book, ind) => (
                 <TableRow key={ind}>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.published_year}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>{book.copies_available}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleBorrowClick(book)}
                      >
                        Borrow
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        )}

        {/* Borrow Popup */}
        {borrowOpen && selectedBook && (
          <BorrowBookPopup
            open={borrowOpen}
            handleClose={() => setBorrowOpen(false)}
            onBorrow={handleBorrowBook}
            user={selectedBook}
          />
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Books;
