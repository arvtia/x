import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const BASE_URL = "http://localhost:5000";

const LoginForm = () => {
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   
   
   const handleSubmit = async (e) => {
      e.preventDefault(); // prevent page reload

      try {
         const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
         });

         const data = await res.json();
         if (res.ok) {
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);
            navigate('/dashboard');   
            // store token, redirect, etc.
         } else {
            console.error('Login failed:', data.message);
         }
      } catch (err) {
         console.error('Error:', err);
      }
      };


   return (
      <>
         <div className="max-w-4xl mx-auto bg-neutral-100 rounded-xl h-screen flex items-center justify-center">
            <div className="p-5 rounded-md w-full md:max-w-md">
               <form onSubmit={handleSubmit} className="p-6 rounded-md">
                  <div className="flex flex-col space-y-4">
                     <div className="text-2xl font-bold text-center">Login to Your Account</div>
                     <div className="flex flex-col space-y-1">
                        <label htmlFor="email" className="text-sm font-semibold">Email</label>
                        <input type="email" id="email" className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="example@gmail.com" 
                           value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                     </div>
                     <div className="flex flex-col space-y-1">
                        <label htmlFor="password" className="text-sm font-semibold">Password</label>
                        <input type="password" id="password" className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="" 
                           value={password} onChange={(e)=> setPassword(e.target.value)}
                        />
                     </div>
                     <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition" 
                        
                     >Login</button>
                     <div className="text-sm text-center">
                        Don't have an account? <Link to={'/signup'} className="text-indigo-500 hover:underline">Sign Up</Link>
                     </div>
                  </div>
                        
               </form>
            </div>
         </div>
      </>
   )
}

export default LoginForm;