import './style.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Login from './auth/Login.js';



export default function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Routes>

          <Route path="/login" element={<Login />} />

        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}
