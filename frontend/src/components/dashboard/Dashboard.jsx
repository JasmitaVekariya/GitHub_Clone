import React ,{useState ,useEffect}from 'react';

const Dashboard = async () => {
    const [repositoires, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    useEffect(() => {
       const userId = localStorage.getItem('userId');
       const fetchRepositories = async () => {
           try {
               const response = await fetch(`http://localhost:3002/repo/user/${userId}`);
               if (!response.ok) {
                   throw new Error('Failed to fetch repositories');
               }
               const data = await response.json();
               setRepositories(data);
           } catch (error) {
               console.error('Error fetching repositories:', error);
           }
       }
          
    }, []);
}

export default Dashboard;