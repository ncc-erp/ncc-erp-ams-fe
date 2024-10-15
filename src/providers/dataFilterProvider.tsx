import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IHardwareResponse } from "interfaces/hardware";
import { axiosInstance } from "./axios";
import { CATEGORIES_API } from "api/baseApi";
interface IDataContext {
  dataCategory: IHardwareResponse[];
  fetchCategoryData: () => Promise<void>;
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
  const [dataCategory, setDataCategory] = useState<IHardwareResponse[]>([]);
  const fetchCategoryData = async () => {
    try {
      const response = await axiosInstance.get(CATEGORIES_API, {
      });      
      setDataCategory(response?.data?.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchCategoryData()
  }, []);
  return (
    <DataContext.Provider value={{dataCategory, fetchCategoryData  }}>
      {children}
    </DataContext.Provider>
  );
};
