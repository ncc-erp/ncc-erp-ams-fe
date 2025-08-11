import { useEffect, useState } from "react";
import { IReleaseNote, IReleaseNoteListResponse } from "interfaces/releaseNote";
import { RELEASE_NOTE_API } from "api/baseApi";
import dataProvider from "providers/dataProvider";

export const useReleaseNotes = (
  filter: "ALL" | "FE" | "BE",
  page: number,
  pageSize: number
) => {
  const [data, setData] = useState<IReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    dataProvider
      .custom?.({
        url: RELEASE_NOTE_API,
        method: "get",
        query: {
          page,
          pageSize,
          type: filter,
        },
      })
      .then((response) => {
        const res =
          response && response.data ? response.data : { rows: [], total: 0 };
        console.log("API response:", response);
        setData(Array.isArray(res?.rows) ? res.rows : []);
        console.log(Array.isArray(res?.rows));
        setTotal(res.total || 0);
      })
      .catch((error) => console.error("Error fetching release notes:", error))
      .finally(() => setLoading(false));
  }, [filter, page, pageSize]);
  return { data, loading, total };
};
