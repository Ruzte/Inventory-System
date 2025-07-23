import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-6"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`h-6 w-full flex items-center justify-center text-xs rounded-md cursor-pointer hover:bg-[#89AE29] hover:text-white transition-colors ${
            isToday(day)
              ? 'bg-[#89AE29] text-white font-bold'
              : 'text-gray-700 hover:text-white'
          }`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1 hover:bg-[#89AE29] hover:text-white rounded-md transition-colors"
        >
          &#8249;
        </button>
        
        <h3 className="font-semibold text-[#89AE29] text-base">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-1 hover:bg-[#89AE29] hover:text-white rounded-md transition-colors"
        >
          &#8250;
        </button>
      </div>
      
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="h-6 flex items-center justify-center text-xs font-medium text-[#89AE29] border-b border-[#89AE29]/20"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1 content-start">
        {renderCalendarDays()}
      </div>
      
      {/* Quick Actions */}
      <div className="mt-3 pt-3 border-t border-[#89AE29]/20">
        <button
          onClick={() => setCurrentDate(new Date())}
          className="w-full py-2 px-3 text-sm bg-[#89AE29] text-white rounded-md hover:bg-[#7a9625] transition-colors"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default Calendar;