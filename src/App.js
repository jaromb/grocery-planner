import React from 'react';
import './App.css';
import ListBuilder from './Pages/ListBuilder'
import AddRecipe from './Pages/AddRecipe'
import ManageRecipes from './Pages/MyRecipes'
import fire from './fire';
import {Link, Route, Switch, BrowserRouter as Router} from 'react-router-dom'

function App() {
  return (
    <div>
      <Router>
        <header className="App-header" style={{height: '100px', paddingBottom: 20}}>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            <h1></h1>
            <h1 style={{fontSize: 50}}>Meal Planner</h1>
            <ul style={{display: 'flex', flexDirection: 'column'}}>
              <li style={{listStyle: 'none'}}><Link style={{textDecoration: 'none', color: 'white'}} to='/'>Home</Link></li>
              <li style={{listStyle: 'none'}}><Link style={{textDecoration: 'none', color: 'white'}} to='/create-recipe'>Add Recipe</Link></li>
              <li style={{listStyle: 'none'}}><Link style={{textDecoration: 'none', color: 'white'}} to='/manage-recipes'>My Recipes</Link></li>
            </ul>
          </div>
        </header>
        <Switch>
          <Route path='/' exact component={ListBuilder}/>
          <Route path='/create-recipe' exact component={AddRecipe}/>
          <Route path='/manage-recipes' exact component={ManageRecipes}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
