import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const TotalSales = ({ salesRefreshTrigger, currentMonth, currentYear }) => {
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
        navigate('/login');
        return;
      }

      const total = await window.api.getTotalSales({
        username,
        month: currentMonth,
        year: currentYear
      });

      setTotalSalesRevenue(total);

    } catch (err) {
      console.error("Failed to fetch total sales revenue:", err);
      navigate('/login');
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

  // Refetch when month or year changes
  useEffect(() => {
    fetchSalesRevenue();
  }, [currentMonth, currentYear]);

  return (
    <div className="p-4 rounded">
      <p className="text-2xl font-bold">
        💵{Number(totalSalesRevenue.toFixed(2)).toLocaleString()}
      </p>
    </div>
  );
  
};

export default TotalSales;