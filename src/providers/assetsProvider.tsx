import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Customer {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

interface DataContextType {
  customer: Customer[];
  project: Project[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const AssetsProvider = ({ children }: DataProviderProps) => {
  const [customer, setCustomer] = useState<Customer[]>([]);
  const [project, setProject] = useState<Project[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch('https://66f4ca4977b5e889709a7c0e.mockapi.io/customer');
      const data = await response.json();
      setCustomer(data);
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch('https://66f4ca4977b5e889709a7c0e.mockapi.io/project');
      const data = await response.json();
      setProject(data);
    };

    fetchProject();
  }, []);

  return (
    <DataContext.Provider value={{ customer, project }}>
      {children}
    </DataContext.Provider>
  );
};
