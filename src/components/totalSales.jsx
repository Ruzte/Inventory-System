import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const TotalSales = ({ salesRefreshTrigger }) => {
  const navigate = useNavigate();
  const [totalSalesRevenue, setTotalSalesRevenue] = useState(0);

  // Function to get username from localStorage
  const getUsername = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.username;
      }
      return null;
    } catch (error) {
      console.error('Error getting username:', error);
      return null;
    }
  };

  // Function to fetch sales revenue
  const fetchSalesRevenue = async () => {
    try {
      const username = getUsername();
      if (!username) {
        console.error('No username found, redirecting to login');
        navigate('/login');
        return;
      }

      const res = await axios.get("http://localhost:5000/api/items/sales-total", {
        headers: {
          'x-username': username
        }
      });
      
      setTotalSalesRevenue(res.data.totalRevenue);
    } catch (err) {
      console.error("Failed to fetch total sales revenue:", err);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        console.error('Authentication failed, redirecting to login');
        navigate('/login');
      }
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchSalesRevenue();
  }, []);

  // Refetch sales revenue when salesRefreshTrigger changes
  useEffect(() => {
    if (salesRefreshTrigger > 0) {
      fetchSalesRevenue();
    }
  }, [salesRefreshTrigger]);

  return (
    <div className=" p-4 rounded ">
      <p className="text-2xl font-bold">
        💵{totalSalesRevenue.toFixed(2)}
      </p>
    </div>
  );
};

export default TotalSales;