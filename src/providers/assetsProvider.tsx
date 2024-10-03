import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { TOKEN_KEY } from "../providers/authProvider";
import { CLIENT_AND_CLIENT_HARDWARE_CREATE } from "../api/baseApi";

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
    const fetchData = async () => {
      try {
        const response = await axios.get(CLIENT_AND_CLIENT_HARDWARE_CREATE, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          },
        });
        setCustomer(response.data.customers.result);
        setProject(response.data.projects.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ customer, project }}>
      {children}
    </DataContext.Provider>
  );
};
