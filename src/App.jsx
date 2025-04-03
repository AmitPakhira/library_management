import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Books from "./components/Books";
import BorrowedBook from "./components/borrowedBook";
function App() {
  
  return(
    <>
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<Books />} />
      <Route path="/borrowed" element={<BorrowedBook />} />
    </Routes>
  </Router>
  </>
  ) 
}

export default App;
