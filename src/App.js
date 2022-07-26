import React,{Component} from 'react';
import Navigation from './components/navigation/nav.js';
import Logo from './components/Logo/Logo.js';
import Rank from './components/Rank/Rank.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import SignInForm from './components/SignInForm/SignInForm.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Register from './components/Register/Register.js';
import './App.css';
import Particle from './components/Particles/Particles.js';


window.process = {
    env: {
        NODE_ENV: 'development'
    }
}


const initialState={
      input:'',
      imageURL:'',
      box: {},
      route:'SignIn',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor() {
    super()
    this.state=initialState;
    }
  
  loadUser=(data)=>{
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined

      }
    })
  }



  calculateFaceLocation = (data)=>{
    const clariface=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return {
      leftCol: clariface.left_col*width,
      topRow: clariface.top_row*height,
      rightCol: width-(clariface.right_col*width),
      bottomRow: height-(clariface.bottom_row*height)
    }
  }

  displayBox=(box)=>{
    this.setState({box: box})
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value});
}


onButtonSubmit = () => {
  this.setState({imageURL: this.state.input});
  fetch("https://ml-facial-recognition.onrender.com/imageurl",
        {method: "post",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response=>response.json())
  .then(response => {
    if (response) {
      fetch("https://ml-facial-recognition.onrender.com/image",
        {method: "put",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          id: this.state.user.id
        })
      }).then(response=>response.json()).then(count=>{
        this.setState(Object.assign(this.state.user,{entries: count}))
      })
      
    }
  this.displayBox(this.calculateFaceLocation(response))})
  .catch((err) => {
  console.log(err);
  });
};   
  
onRouteChange=(route) => {
  if (route==='signout') {
    this.setState(initialState)
  }
  else if (route==='home') {
  this.setState({isSignedIn: true});
  }
  this.setState({route: route});
}


  render() {
    
    return (
      <div className="App">
        
        <Particle className='particl'/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>

        {this.state.route==='home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition displayBox={this.displayBox} box={this.state.box} imageURL={this.state.imageURL}/>
          </div>
          : (
            this.state.route==='SignIn' ?
            <div>
              <Logo />
              <SignInForm loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            </div>
            :
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
          
        }
      </div>
    );
  }
}

export default App;
