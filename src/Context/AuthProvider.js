import React,{useState,useContext,useEffect} from 'react'
import {auth} from '../firebase'
export const AuthContext = React.createContext();

function AuthProvider({children}) {

    const[currentUser,setCurrentUser] =useState();  // Signed-in User-Info
    const[loading,setLoading] =useState(true);      // loading state

    function signup(email,password)
    {
        return auth.createUserWithEmailAndPassword(email,password);
    }
    function login(email,password)
    {
        return auth.signInWithEmailAndPassword(email,password);
    }
    function logout()
    {
        return auth.signOut();
    }

    // setCurrentUser Initially during 1st Render of This Component 
    useEffect(()=>{
        // Observer
        const unsubscribe  = auth.onAuthStateChanged(user=>{
            setCurrentUser(user);
            setLoading(false);
        })
        return ()=>{
            unsubscribe();
        }
    },[])

    // value-Object Passed in Context Provider
    const value = {
        currentUser,
        login,
        signup,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
             {/* means, jb loading false hoga ,tbi children ko chalana  */}
            {!loading&&children}    
        </AuthContext.Provider>
    )
}

export default AuthProvider
