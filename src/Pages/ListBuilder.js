import React, {Component} from 'react';
import fire from '../fire';

class ListBuilder extends Component {
state = {
    recipes: [],
    shoppingList: [],
    buttonClicked: false,
    ingredients: null,
    selected: [],
    searchText: '',
    filteredRecipes: ''
}


componentDidMount() {
    const db = fire.firestore();
    
    db.collection("recipes")
        .get()
        .then((querySnapshot) => {
            let recipes = [];
            querySnapshot.forEach((recipe) => {
                recipes.push(recipe.data());
            })  
            this.setState({
                recipes: recipes
            })
            console.log(this.state.recipes)
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

addToShoppingList = () => {
    this.setState({
        shoppingList: this.state.shoppingList.concat(this.state.selected),
        selected: [],
        buttonClicked: false
    })
    
}

handleCheckbox = (ingredient, index) => () => {
        // if (!this.state.selected.includes(ingredient))
        if (!this.refs[ingredient.name].checked===false) {
        this.setState({
            selected: this.state.selected.concat(ingredient)
        })
    }
        else {
            this.setState({
                selected: this.state.selected.filter(item => item !== ingredient)
            })
        }
    
}

render() {
    return(
        <div>
            <h1 style={{textAlign: 'center', marginBottom: 0}}>Create Your Shopping List</h1>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', fontSize:24, paddingBottom: 5}}>
                <label style={{fontWeight:'bold', marginRight: 10, fontSize: 25, paddingTop: 20}}>Search your recipes</label>
                <input style={{width: 300, height: 30, fontSize: 30}} value={this.state.searchText} onChange={this.handleSearch}></input>
            </div>
             <h4 style={{textAlign: 'center', width: 300, margin: 3, fontWeight: 500}}>Select ingredients from a recipe below to add to your shopping list</h4>
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
                    {this.state.ingredients.map((ingredient, index)=>                        
                        <li>
                            <input ref= {ingredient.name} id={ingredient.name} value={ingredient.name} type="checkbox" style={{display:'inline-block', fontSize:22}} onClick={this.handleCheckbox(ingredient, index)}></input>
                            <label for={ingredient.name}>{ingredient.name} x {ingredient.quantity} {ingredient.measure}</label> 
                            {/* <p>checked? {this.refs.mozzarella.checked}</p> */}
                            
                        </li>              
                )}        
                    </ul>         
                    <button style={{width:200, height:25, alignSelf:'center', marginTop:0, marginBottom:5, color: 'white', backgroundColor: '#226bff'}} onClick = {this.addToShoppingList}>Add selected items to list</button>
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
                        <li>
                        <input ref= {ingredient.name} id={ingredient.name} value={ingredient.name} type="checkbox" style={{display:'inline-block', fontSize:22}} onClick={this.handleCheckbox(ingredient, index)}></input>
                            <label for={ingredient.name}>{ingredient.name} x {ingredient.quantity} {ingredient.measure}</label> 
                        </li>         
                )}        
                    </ul> 
                    <button style={{width:200, height:25, alignSelf:'center', marginTop:0, marginBottom:5}}>Add selected items to list</button>
                </div>         
                :
                null
                }
            </div>  
            )}
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <ul style={{ fontSize: 18, textAlign: 'center', listStyle: 'none'}}><label style={{fontSize: 25, fontWeight: 'bold', textDecoration: 'underline'}}>Shopping List</label>
                    
                    {this.state.shoppingList.map(item =>
                    <li style={{fontsize: 18, textDecoration: 'none', paddingTop: 5}}>{item.name} x {item.quantity} {item.measure}</li>
                    )}
                </ul>
            </div>
        </div>
        </div>
    )
}

}
export default ListBuilder; 