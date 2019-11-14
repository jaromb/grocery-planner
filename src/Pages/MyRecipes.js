import React, {Component} from 'react';
import fire from '../fire';
import {Redirect} from 'react-router-dom'

class ManageRecipes extends Component {
state = {
    recipes: [],
    shoppingList: [],
    buttonClicked: false,
    searchText: '',
    filteredRecipes: '',
    recipeName: '',
    ingredients: [],
    measure: '',
    response: '',
    updatedRecipe: '',
    user: true
}


componentDidMount() {
    document.title='My Recipes'

    const db = fire.firestore();

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

    new Promise((resolve, reject) => {
        fire.auth().onAuthStateChanged(function(user) {
        if (user) { 
          setUser(user.email)
        } 
        else {
          noUser();    
          console.log('No user currently signed in.')} 
      })  
      resolve();
    })
    .catch(() => {
        console.log('user check failed')
    })
    .then(( ) => 
        getRecipes()
    )
    .catch(() => {
        console.log('get recipes failed')
    })

    const getRecipes = () => { 
        db.collection("recipes")
        .get()
        .then((querySnapshot) => {
            let recipes = [];
            console.log("get recipes user = " + this.state.user)
            querySnapshot.forEach((recipe) => {
                recipes.push(recipe.data());  
            })  
            
            this.setState({
                recipes: recipes.filter(recipe => recipe.user === this.state.user)
            })
            console.log(this.state.recipes)
        })  
    }
}



verifyUser = () => {
    
    fire.auth().onAuthStateChanged(function(user) {
    if (user) {
      return true
    } 
    else {
        console.log('No user currently signed in.')
        return false
    } 
  })  
}

handleIngredientsClick = (item) => (index) => {
    console.log(item);
    console.log(index);
    this.setState({
        buttonClicked: item.name,
        ingredients: item.ingredients
    })
}

handleCollapseClick = () => {
    this.setState({
        buttonClicked: false
    })
}

handleSearch = (event) => {
    this.setState({searchText: event.target.value,
    filteredRecipes: this.state.recipes.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()))})
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

editRecipe = (recipe, index) => (event) => {
    this.setState({
        recipeName: recipe.name,
        ingredients: recipe.ingredients
    })
    console.log(this.state.measure)
}

updateRecipe = () => {
    const db = fire.firestore();
    const updatedRecipe = {user: this.state.user, name: this.state.recipeName, ingredients: this.state.ingredients}
    
    db.collection("recipes").doc(updatedRecipe.name).set({
        user: updatedRecipe.user, name: updatedRecipe.name, ingredients: updatedRecipe.ingredients
    })
    .then(docRef =>  
        // console.log("Document written with ID: ", docRef.id);
        this.setState({
            response: 'Recipe updated successfully!',
            recipeName: '',
            buttonClicked: false,
            searchText: '',
            filteredRecipes: ''
        })
        // console.log('success') 
)
        .then(setTimeout(this.clearResponse, 5000))    
    .catch((error) =>
        // console.error("Error adding document: ", error);
        this.setState({
            response: 'Error adding recipe, please try again.'
        })
)    
}

clearResponse = () => {
    this.setState({
        response: ''
    })
}


deleteRecipe = (recipeName) => () =>  {
    const db = fire.firestore();
    const filteredByDelete = this.state.recipes.filter(recipe => recipe.name!==recipeName)

    db.collection("recipes").doc(recipeName).delete()
    .then( docRef =>  
        this.setState({
            response: 'Recipe successfully deleted!',
            recipeName: '',
            recipes: filteredByDelete,
            searchText: '',
            filteredRecipes: ''
        })
        // console.log('success') 
)
        .then(setTimeout(this.clearResponse, 5000))    
    .catch((error) =>
        // console.error("Error adding document: ", error);
        this.setState({
            response: 'Error deleting recipe, please try again.'
        })
)    
}


render() {
    return this.state.user ?
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', fontSize:24, paddingBottom: 5}}>
                    {this.state.response !== '' ? 
                        <p style={{textAlign: 'center', color: 'red', margin: 0}}>{this.state.response}</p>
                        :
                        null
                    }
                    <h2 style={{marginBottom: 0}}>My Recipes</h2>
                    <h4 style={{textAlign: 'center', margin: 3, fontWeight: 500}}>View, Edit, and Delete recipes</h4>
                        <label style={{fontWeight:'bold', marginRight: 10, fontSize: 25, paddingTop: 20}}>Search your recipes</label>
                        <input style={{width: 300, height: 30, fontSize: 30}} value={this.state.searchText} onChange={this.handleSearch}></input>
                    </div>
                    
                    {this.state.filteredRecipes === '' || null ?
                        this.state.recipes.map((item, index) => 
                    <div>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', lineHeight: 0}}>
                            <h2>{item.name}</h2>
                            <button style={{height: 30, width: 'auto', marginLeft: 10}} 
                                onClick={this.handleIngredientsClick(item, index)}>View Ingredients</button>
                            <button style={{height: 30, width: 'auto', marginLeft: 10}}
                                onClick={this.handleCollapseClick}>Collapse</button>    
                        </div>  
                        {this.state.buttonClicked===item.name ? 
                        <div style={{display:'flex', flexDirection: 'column', textAlign:'center'}}>    
                            <ul style={{display: 'flex', flexDirection:'column', justifyContent:'center', marginTop: 0, marginBottom:1, paddingLeft:0, listStyle: 'none'}}>
                            {this.state.ingredients.map((ingredient)=>                        
                                <li>{ingredient.name} x {ingredient.quantity} {ingredient.measure}</li>              
                        )}        
                            </ul>
                            <button onClick={this.editRecipe(item, index)} style={{fontSize: 18, width:200, height:25, alignSelf:'center', marginTop:0, marginBottom:5, color: 'white', backgroundColor: '#226bff'}}>Edit this recipe</button>
                            <button onClick={this.deleteRecipe(item.name)} style={{fontSize: 18, width:200, height:25, alignSelf:'center', marginTop:0, marginBottom:5, color: 'white', backgroundColor: 'red'}}>Delete this recipe</button>
                        </div>         
                        :
                        null
                        }
                    </div>  
                    )
                    :
                        this.state.filteredRecipes.map((item, index) => 
                    <div>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', lineHeight: 0}}>
                            <h2>{item.name}</h2>
                            <button style={{height: 30, width: 'auto', marginLeft: 10}} 
                                onClick={this.handleIngredientsClick(item, index)}>View Ingredients</button>
                            <button style={{height: 30, width: 'auto', marginLeft: 10}}
                                onClick={this.handleCollapseClick}>Collapse</button>    
                        </div>  
                        {this.state.buttonClicked === item.name ? 
                        <div style={{display:'flex', flexDirection: 'column', textAlign:'center'}}>    
                            <ul style={{display: 'flex', flexDirection:'column', justifyContent:'center', marginTop: 0, marginBottom:1, paddingLeft:0, listStyle: 'none'}}>
                            {this.state.ingredients.map((ingredient)=>                        
                                <li>{ingredient.name} x {ingredient.quantity} {ingredient.measure}</li>        
                        )}        
                            </ul> 
                            <button onClick={this.editRecipe(item, index)} style={{fontSize: 18, width:200, height:25, alignSelf:'center', marginTop:0, marginBottom:5, color: 'white', backgroundColor: '#226bff'}}>Edit this recipe</button>
                            <button onClick={this.deleteRecipe(item.name)} style={{fontSize: 18, width:200, height:25, alignSelf:'center', marginTop:0, marginBottom:5, color: 'white', backgroundColor: 'red'}}>Delete this recipe</button>
                        </div>         
                        :
                        null
                        }
                    </div>  
                    )}
                    </div>
                </div>
                {this.state.recipeName !== '' ?
                    <div>
                        
                        <div>
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
                                        <input placeholder='qty' style={{height: 20, width: 30, marginRight: 5}} value={this.state.ingredients[index].quantity} onChange={this.handleIngredientQuantity(ingredient, index)}></input>
                                        <select style={{height: 20}} onChange={this.handleIngredientMeasure(ingredient, index)}>
                                            <option selected disabled>{ingredient.measure}</option>
                                            <option>oz</option>
                                            <option>lb(s)</option>
                                            <option>tsp</option>
                                            <option>Tbsp</option>
                                            <option>cup(s)</option>
                                            <option>whole</option>
                                            <option>oz (canned)</option>
                                            <option>bag</option>
                                        </select>
                                        <button style={{backgroundColor: 'red', marginLeft: 10, cursor: 'pointer'}} onClick={this.deleteIngredient(ingredient, index)}>Delete</button>
                                </li>
                                )}
                                </ul>
                                <button style={{fontSize: 14, marginBottom: 10, cursor: 'pointer'}} onClick={this.moreIngredients}>Add another ingredient</button>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <button onClick={this.updateRecipe} style={{fontSize: 22, backgroundColor: '#226bff', color: '#fff', border: '1px solid gray', cursor: 'pointer'}}>Update Recipe</button>
                            </div>
                        </div>       
                </div>
                :
                null
                }
        </div>
    :
    <Redirect to='/login'></Redirect>
}

}
export default ManageRecipes; 