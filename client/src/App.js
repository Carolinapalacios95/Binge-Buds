import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchMovies from './pages/SearchMovies';
import SavedMovies from './pages/SavedMovies';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <>
        <Navbar />
          <Routes>
          <Route exact path='/' component={SearchMovies} />
          <Route exact path='/saved' component={SavedMovies} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Routes>
      </>
    </Router>
  );
}

export default App;
