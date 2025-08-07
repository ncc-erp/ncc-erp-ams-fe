import { useEffect, useState } from "react";
import { IReleaseNote } from "interfaces/releaseNote";
import { RELEASE_NOTE_API } from "api/baseApi";
import dataProvider from "providers/dataProvider";

export const useReleaseNotes = () => {
  const [data, setData] = useState<IReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataProvider
      .custom?.({
        url: RELEASE_NOTE_API,
        method: "get",
      })
      .then((response) => {
        setData(
          Array.isArray(response?.data) ? response.data : [response?.data]
        );
      })
      .catch((error) => console.error("Error fetching release notes:", error))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};
