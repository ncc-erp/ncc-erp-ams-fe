import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { TOKEN_KEY } from "../providers/authProvider";
import { IHardwareResponse } from "interfaces/hardware";
interface IDataContext {
  dataFilters: IHardwareResponse[];
  fetchFilterData: (customerName: string | number, projectName: string | number, isCustomerRenting: string | number, assetName: string | number ) => Promise<void>;
}
const DataContext = createContext<IDataContext | undefined>(undefined);

export const useDataFilterContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataFilterProvider = ({ children }: DataProviderProps) => {
  const [dataFilters, setDataFilters] = useState<IHardwareResponse[]>([]);

  const fetchFilterData = async (customerName: string | number, projectName: string | number, isCustomerRenting: string | number, assetId: string | number ) => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/assets/filter', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
        params: {
            customerName,
            projectName,
            isCustomerRenting,
            assetId
        },
      });
      setDataFilters(response?.data?.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFilterData("", "", "","");
  }, []);
  return (
    <DataContext.Provider value={{ dataFilters, fetchFilterData }}>
      {children}
    </DataContext.Provider>
  );
};
