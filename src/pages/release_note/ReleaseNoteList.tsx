import React, { useState } from "react";
import { List, Spin, Select, Pagination } from "antd";
import { useReleaseNotes } from "hooks/useReleaseNotes";
import { useTranslate } from "@pankod/refine-core";
import { ReleaseNoteCard } from "./ReleaseNoteCard";
import { ReleaseNoteFilter } from "constants/releaseNote";

const MAX_LINES = 7;

export const ReleaseNoteList: React.FC = () => {
  const [filter, setFilter] = useState<ReleaseNoteFilter>(
    ReleaseNoteFilter.ALL
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const { data, loading, total } = useReleaseNotes(
    filter,
    pagination.current,
    pagination.pageSize
  );
  const [expanded, setExpanded] = useState<{ [id: number]: boolean }>({});
  const t = useTranslate();
  const releaseNotes = data;

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Select
          value={filter}
          onChange={(value: ReleaseNoteFilter) => {
            setFilter(value);
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
          style={{ width: 120 }}
          options={[
            {
              value: ReleaseNoteFilter.ALL,
              label: t("release_note.filter.all"),
            },
            { value: ReleaseNoteFilter.FE, label: t("release_note.filter.fe") },
            { value: ReleaseNoteFilter.BE, label: t("release_note.filter.be") },
          ]}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, pageSize) => {
            setPagination({ current: page, pageSize: pageSize || 5 });
          }}
          style={{ marginLeft: "auto" }}
        />
      </div>
      <div style={{ minHeight: 300, position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" />
          </div>
        )}
        <List
          dataSource={releaseNotes}
          renderItem={(item) => {
            const isExpanded = expanded[item.id] || false;
            return (
              <ReleaseNoteCard
                item={item}
                expanded={isExpanded}
                onToggleExpand={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [item.id]: !isExpanded,
                  }))
                }
                maxLines={MAX_LINES}
              />
            );
          }}
          pagination={false}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 16,
        }}
      >
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, pageSize) => {
            setPagination({ current: page, pageSize: pageSize || 5 });
          }}
        />
      </div>
    </div>
  );
};
