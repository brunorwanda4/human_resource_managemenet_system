// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import api from '../services/api';

// export default function Profile() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user) {
//       fetchProfile();
//     }
//   }, [user]);

//   const fetchProfile = async () => {
//     try {
//       const response = await api.get('/user/profile');
//       setProfile(response.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="loading loading-spinner loading-lg"></div>;
//   if (!profile) return <div className="alert alert-error">Profile not found</div>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">My Profile</h1>
      
//       <div className="card bg-base-100 shadow">
//         <div className="card-body">
//           <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
//             <div className="avatar">
//               <div className="w-24 rounded-full">
//                 <img src={`https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=random`} alt="Profile" />
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
//               <p><span className="font-semibold">Email:</span> {profile.email}</p>
//               <p><span className="font-semibold">Phone:</span> {profile.phone}</p>
//               <p><span className="font-semibold">Department:</span> {profile.depName}</p>
//               <p><span className="font-semibold">Position:</span> {profile.postTitle}</p>
//             </div>
//           </div>
          
//           <div className="divider"></div>
          
//           <