import React, { useEffect, useState } from 'react'
import { Route,Redirect} from 'react-router';
import auth from '../services/authService';

function ProtectedRoute({path,component:Component,role,render,...rest}) {

    const [ User, setCurrentUser ] = useState({});

    useEffect (()=>{
        var  currentUser = auth.getCurrentUser();
        var User = currentUser
        setCurrentUser (User);
    },[])
   
  return (
    <Route
    {...rest}
      render={props=>{
          if (!User) return <Redirect to={{
              pathname:'/Login',
              state:{from :props.location}
          }}/>;
          if (User.role === role || role === "ANY") return Component ? <Component {...props}/>: render(props);
      }}
  />
  )
}

export default ProtectedRoute