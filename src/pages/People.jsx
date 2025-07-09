import { useEffect, useState } from "react";
import Navbar from "../UI/Navbar";
import UserCard from "../components/UserCard";
import CONFIG from '../Configuration';

function People() {
  const [users, setUsers] = useState([]);

  const IP = CONFIG.IP || 'localhost';
  const PORT = CONFIG.PORT || '8000';
  const API = CONFIG.API_URL;

  useEffect(() => {
    fetch(`${API}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) setUsers(data);
        else console.error("Users response is not an array:", data);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      <Navbar />
      <h2 className="text-3xl font-bold my-6 text-purple-700">Active People</h2>
      <div className="flex flex-wrap justify-center">
        {users.map((user) => (
          <UserCard key={user.email} user={user} />
        ))}
      </div>
    </div>
  );
}

export default People;
