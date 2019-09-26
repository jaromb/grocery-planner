import React, {Component} from 'react';
import fire from '../fire';
import {Redirect} from 'react-router-dom'

class Login extends Component {
state = {
    response: null,
    email: '',
    password: '',
    create: false,
    error: null,
    user: false
}


componentDidMount() {
    
    let username = null

    const setUser = () => {
        this.setState({
            user: username
        })
    }

    fire.auth().onAuthStateChanged(function(user) {
        if (user) {
          username = user.email
          setUser()
          console.log(username)
        } 
        else {console.log('No user currently signed in.')} 
      })  
        
}

handleUserText = () => (event) => {
    this.setState({
        email: event.target.value
    })
}

handlePasswordText = () => (event) => {
    this.setState({
        password: event.target.value
    })
}


handleLogin = () => {
    let username = null

    const setError = (error) => {
        this.setState({
            error: error
        })
    }
    const setUser = () => {
        this.setState({
            user: username
        })
    }

    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(
        
        fire.auth().onAuthStateChanged(function(user) {
            if (user) {
              username = user.email
              setUser()
              console.log(username)
            } 
            else {console.log('Login failed.  Please verify username & password and try again.')} 
          })  
    )
    .then(
        this.setState({
            user: username
    }))
    .catch(function() {
        // var errorCode = error.code;
        // var errorMessage = error.errorMessage
        
        setError('Unable to verify username/password combination. Please try again.')
        // this.setState({
        //     error: 'Unable to verify username/password combination.'
        // })
    }
    )

}

handleCreate = () => {
    const setError = (error) => {
        this.setState({
            error: error
        })
    }

    fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
        // var errorCode = error.code;
        
        setError('Error with user creation, please verify your credentials and try again.')
        
    }
    )
    
}


clearResponse = () => {
    this.setState({
        response: ''
    })
}

userCreation = () => {
    this.setState({
        create: !this.state.create
    })
}





render() {
    return this.state.user ?
        <Redirect to ='/'></Redirect>
        :
        <div>
        {!this.state.create ? 
            <div style={{display: 'flex', flexDirection:'column', alignItems: 'center'}}>
                <h1 style={{textAlign: 'center', marginBottom: 10, fontSize: 40}}>Login</h1>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                        <label style={{fontSize: 24, paddingRight: 4}}>Username</label><input value={this.state.email} onChange={this.handleUserText()} style={{height: 20}}></input>
                    </div>
                    <div>
                        <label style={{fontSize: 24, paddingRight: 4}}>Password</label><input value={this.state.password} type='password' onChange={this.handlePasswordText()} style={{height: 20}}></input>
                    </div>
                </div>
                <button style={{width: 80, fontSize: 18, backgroundColor: '#226bff', color: '#fff', border: '1px solid gray', cursor: 'pointer'}} onClick={this.handleLogin}>Sign In</button>
                <p style={{marginBottom: 5}}>Not a current user?</p><a style={{color: 'blue', cursor: 'pointer'}} onClick={this.userCreation}>Create an account</a>
                <p style={{color: 'red'}}>{this.state.error}</p>
            </div>
            :
            <div style={{display: 'flex', flexDirection:'column', alignItems: 'center'}}>
                <h1 style={{textAlign: 'center', marginBottom: 10, fontSize: 40}}>Create User</h1>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                        <label style={{fontSize: 24, paddingRight: 4}}>Email</label><input value={this.state.email} onChange={this.handleUserText()} style={{height: 20}}></input>
                    </div>
                    <div>
                        <label style={{fontSize: 24, paddingRight: 4}}>Password</label><input value={this.state.password} onChange={this.handlePasswordText()} style={{height: 20}} type='password'></input>
                    </div>
                </div>
                <button style={{width: 170, fontSize: 18, backgroundColor: '#226bff', color: '#fff', border: '1px solid gray', cursor: 'pointer'}} onClick={this.handleCreate}>Create Account</button>
                <p style={{marginBottom: 5}}>Already have an account?</p><a style={{color: 'blue', cursor: 'pointer'}} onClick={this.userCreation}>Login here</a>
                <p style={{color: 'red'}}>{this.state.error}</p>
            </div>
        }
        </div>
    
}

}
export default Login; 