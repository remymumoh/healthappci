import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

interface DateRangeContextType {
  selectedDateRange: DateRange;
  setSelectedDateRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};

interface DateRangeProviderProps {
  children: ReactNode;
}

export const DateRangeProvider: React.FC<DateRangeProviderProps> = ({ children }) => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    startDate: new Date(2025, 4, 1), // May 1, 2025
    endDate: new Date(2025, 4, 31), // May 31, 2025
    label: 'May 2025'
  });

  return (
    <DateRangeContext.Provider value={{ selectedDateRange, setSelectedDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};