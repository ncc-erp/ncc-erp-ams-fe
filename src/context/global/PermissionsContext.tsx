import { EPermissions } from 'constants/permissions';
import { ReactChild, createContext, useContext, useEffect, useState } from 'react';
import {
    usePermissions
  } from "@pankod/refine-core";
import { authProvider } from 'providers/authProvider';


export const PermissionsContext = createContext(false);

export const PermissionsProvider = ({ children } : { children: ReactChild}) => {

  const [ isAdmin, setIsAdmin] = useState(false);
  const getPermissions = async () => {
    const permissions = await authProvider.getPermissions();
    
    if (permissions?.admin === EPermissions.ADMIN) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }
  
  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <PermissionsContext.Provider value={ isAdmin }>
      {children}
    </PermissionsContext.Provider>
  );
};