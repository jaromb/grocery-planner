import React, {Component} from 'react';
import fire from '../fire';
import {Redirect} from 'react-router-dom'

class AddRecipe extends Component {
state = {
    recipeName: '',
    ingredients: [{name: '', quantity: '', measure: ''}],
    response: '',
    user: true
}

componentDidMount() {
    
    let username = null

    const setUser = (username) => {
        this.setState({
            user: username
        })
    }

    const noUser = () => {
        this.setState({
            user: false
        })
    }

    fire.auth().onAuthStateChanged(function(user) {
        if (user) {
          username = user.email
          setUser(username)
          console.log(username)
        } 
        else {
          noUser();
          console.log('No user currently signed in.')} 
      })  
        
}


moreIngredients = (item) => {
    item = {name: '', quantity: '', measure: ''}
    this.setState({
        ingredients: [...this.state.ingredients, item]
    })
}

deleteIngredient = (item, index) => () => {
    let ingredientsCopy = this.state.ingredients
    ingredientsCopy.splice(index, 1)
    this.setState({
        ingredients: ingredientsCopy
    })
}

handleRecipeName = () => (event) => {
    this.setState({
        recipeName: event.target.value,
        response: ''
    })
}

handleIngredientName = (ingredient, index) => (event) => {
    let ingredientsCopy = this.state.ingredients
    ingredientsCopy[index].name = event.target.value
    this.setState({
        ingredients: ingredientsCopy,
        response: ''
    })
} 

handleIngredientQuantity = (ingredient, index) => (event) => {
    let ingredientsCopy = this.state.ingredients
    ingredientsCopy[index].quantity = event.target.value
    this.setState({
        ingredients: ingredientsCopy
    })
} 
handleIngredientMeasure = (ingredient, index) => (event) => {
    let ingredientsCopy = this.state.ingredients
    ingredientsCopy[index].measure = event.target.value
    this.setState({
        ingredients: ingredientsCopy
    })
} 

addToRecipes = () => () => {
    const db = fire.firestore();
    const newRecipe = {user: this.state.user, name: this.state.recipeName, ingredients: this.state.ingredients}
    
    db.collection("recipes").doc(newRecipe.name).set({
        user: newRecipe.user, name: newRecipe.name, ingredients: newRecipe.ingredients
    })
    .then(docRef => 
        // console.log("Document written with ID: ", docRef.id);
        this.setState({
            response: 'Recipe added successfully!',
            recipeName: '',
            ingredients: [{name: '', quantity: '', measure: ''}] 
        })   
)
    .catch((error) =>
        // console.error("Error adding document: ", error);
        this.setState({
            response: 'Error adding recipe, please try again.'
        })
)    
}


render() {
    return this.state.user ?
        <div>
            <h2 style={{textAlign: 'center', fontSize: 30, marginBottom: 0}}>Add A New Recipe</h2>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h3 style={{fontSize: 25, marginBottom: 5}}>Recipe Name</h3>
                    <input value={this.state.recipeName} onChange={this.handleRecipeName()} style={{height: 20, width: 180, textAlign: 'center', fontSize: 16}}></input>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h3 style={{marginBottom: 0, fontSize: 25}}>Ingredients</h3>
                    <ul>
                    {this.state.ingredients.map((ingredient, index) => 
                    <li style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <label style={{fontSize: 20}}>{(index + 1) + `)`}<input placeholder='e.g. tomatoes' value={this.state.ingredients[index].name} onChange={this.handleIngredientName(ingredient, index)} style={{height: 20}}></input></label>
                            <p style={{paddingLeft: 10, paddingRight: 10}}>x</p>
                            <input type='number' placeholder='qty' style={{height: 20, width: 30, marginRight: 5}} value={this.state.ingredients[index].quantity} onChange={this.handleIngredientQuantity(ingredient, index)}></input>
                            <select style={{height: 20}} onChange={this.handleIngredientMeasure(ingredient, index)}>
                                <option selected disabled>Choose one</option>
                                <option>oz</option>
                                <option>lb(s)</option>
                                <option>tsp</option>
                                <option>Tbsp</option>
                                <option>cup(s)</option>
                                <option>whole</option>
                                <option>oz (canned)</option>
                                <option>bag</option>
                            </select>
                            <button style={{backgroundColor: 'red', color: 'white', marginLeft: 10, cursor: 'pointer'}} onClick={this.deleteIngredient(ingredient, index)}>Delete</button>
                    </li>
                    )}
                    </ul>
                    <button style={{fontSize: 14, marginBottom: 10, cursor: 'pointer'}} onClick={this.moreIngredients}>Add another ingredient</button>
                </div>
                <div>
                    <button onClick={this.addToRecipes()}style={{fontSize: 22, backgroundColor: '#226bff', color: '#fff', border: '1px solid gray', cursor: 'pointer'}}>Add to My Recipes</button>
                </div>
                <p style={{color: 'red'}}>{this.state.response}</p>
            </div>
        </div>
    :
    <Redirect to='/login'></Redirect>
}

}
export default AddRecipe;