import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import DiceGame from './components/DiceGame';
function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<DiceGame/>}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
