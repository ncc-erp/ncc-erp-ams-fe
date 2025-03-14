import { useNavigation } from "@pankod/refine-core";
import { TOKEN_KEY } from "providers/authProvider";
import dataProvider from "providers/dataProvider";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const useLoginWithMezon = () => {
  const { post } = dataProvider;
  const location = useLocation();
  const { list } = useNavigation();

  const paramValues = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);

    return ["code", "scope", "state"].map((param) => queryParams.get(param));
  }, [location.search]);

  useEffect(() => {
    const [code, scope, state] = paramValues;
    const handleLoginWithMezon = async (code: string, state: string) => {
      try {
        const data = await post({
          url: "api/v1/auth/mezon-login",
          payload: {
            code,
            state,
          },
        });

        if (data?.data?.access_token) {
          localStorage.setItem(TOKEN_KEY, data.data.access_token);
          Promise.resolve("/users");
          window.location.reload();
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (code && state) {
      handleLoginWithMezon(code, state);
    }
  }, [paramValues]);

  return;
};

export default useLoginWithMezon;
