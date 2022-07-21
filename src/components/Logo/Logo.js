import React,{Component} from 'react';
import Tilt from 'react-parallax-tilt';
import logo from './logo.jpg';

const Logo=()=>{
	return (
		
		<div className= 'ma4 mt0' style={{width:100}}>
			<Tilt className='Tilt br2 shadow-2' props={{tiltMaxAngleX:40},{tiltAngleYManual:40}} >
     			<div className='Tilt-inner' style={{background: 'linear-gradient(to left, blue , aquamarine)'}}>
       				<img style = {{paddingTop: '10px'},{height:'200px'}} alt='logo' src={logo} />
     		 	</div>
   			 </Tilt>
		</div>
	);
}

export default Logo;