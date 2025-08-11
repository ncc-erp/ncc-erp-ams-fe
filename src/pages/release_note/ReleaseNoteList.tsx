import React, { useState, useMemo } from "react";
import { List, Typography, Spin, Card, Avatar, Button } from "antd";
import { useReleaseNotes } from "hooks/useReleaseNotes";
import { IReleaseNote } from "interfaces/releaseNote";
import { useTranslate } from "@pankod/refine-core";
import {
  parseReleaseBody,
  renderMarkdown,
  shortenChangelogLink,
} from "./releaseNoteHelpers";
import { ChangelogLinks } from "./ChangelogLinks";

const MAX_LINES = 7;

export const ReleaseNoteList: React.FC = () => {
  const { data, loading } = useReleaseNotes();
  const [expanded, setExpanded] = useState<{ [id: number]: boolean }>({});
  const t = useTranslate();

  const sortedReleaseNotes = useMemo(
    () =>
      [...data].sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      ),
    [data]
  );

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
    <List
      dataSource={sortedReleaseNotes}
      renderItem={(item) => {
        const { changes, contributors, changelog } = parseReleaseBody(
          item.body
        );
        const isExpanded = expanded[item.id] || false;

        const allLines: React.ReactNode[] = [];

        if (changes.length > 0) {
          allLines.push(
            <div
              key="changes-title"
              style={{
                marginBottom: 0,
                fontWeight: 700,
                fontSize: 16,
                color: "#222",
              }}
            >
              {t("release_note.whats_changed")}
            </div>
          );
          allLines.push(
            ...changes.map((line, idx) => (
              <div
                key={`change-${idx}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginLeft: 24,
                  marginBottom: 0,
                  lineHeight: "17px",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    marginRight: 8,
                    fontSize: 18,
                    lineHeight: "14px",
                    color: "#222",
                  }}
                >
                  •
                </span>
                <span style={{ flex: 1 }}>
                  {renderMarkdown(line.replace(/^\* /, ""))}
                </span>
              </div>
            ))
          );
        }

        if (contributors.length > 0) {
          allLines.push(
            <div
              key="contributors-title"
              style={{
                marginTop: 8,
                fontWeight: 700,
                fontSize: 16,
                color: "#222",
              }}
            >
              {t("release_note.new_contributors")}
            </div>
          );
          allLines.push(
            ...contributors.map((line, idx) => (
              <div
                key={`contributor-${idx}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginLeft: 24,
                  marginBottom: 2,
                  lineHeight: "15px",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    marginRight: 8,
                    fontSize: 18,
                    lineHeight: "15px",
                    color: "#222",
                  }}
                >
                  •
                </span>
                <span style={{ flex: 1 }}>
                  {renderMarkdown(line.replace(/^\* /, ""))}
                </span>
              </div>
            ))
          );
        }

        if (changelog.length > 0) {
          allLines.push(
            <div
              style={{
                marginTop: 8,
                fontWeight: 700,
                fontSize: 16,
                color: "#222",
              }}
              key="changelog-title"
            >
              <span style={{ fontWeight: 700 }}>
                {t("release_note.full_changelog")}
              </span>
              <ChangelogLinks links={changelog} />
            </div>
          );
        }

        const showReadMore = allLines.length > MAX_LINES;
        const visibleLines = isExpanded
          ? allLines
          : allLines.slice(0, MAX_LINES);

        return (
          <Card style={{ marginBottom: 24 }}>
            <Card.Meta
              avatar={<Avatar src={item.author?.avatar_url} />}
              title={
                <span>
                  <Typography.Title
                    level={4}
                    style={{
                      margin: 0,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href={item.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#222",
                        fontWeight: 700,
                        wordBreak: "break-all",
                        whiteSpace: "normal",
                        transition: "color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "#e74c3c")
                      }
                      onMouseOut={(e) => (e.currentTarget.style.color = "#222")}
                    >
                      {item.tag_name}
                    </a>
                  </Typography.Title>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    {new Date(item.published_at).toLocaleString()} by{" "}
                    <a
                      href={item.author?.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.author?.login}
                    </a>
                  </div>
                </span>
              }
              description={
                <div>
                  <div style={{ marginBottom: 0 }}>
                    {visibleLines.length === 0 ? (
                      <div style={{ marginLeft: 24 }}>
                        <Typography.Text type="secondary">
                          {t("release_note.no_details")}
                        </Typography.Text>
                      </div>
                    ) : (
                      visibleLines
                    )}
                  </div>
                  {showReadMore && (
                    <Button
                      type="link"
                      style={{ paddingLeft: 0, marginLeft: 0 }}
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [item.id]: !isExpanded,
                        }))
                      }
                    >
                      {isExpanded
                        ? t("release_note.read_less")
                        : t("release_note.read_more")}
                    </Button>
                  )}
                </div>
              }
            />
          </Card>
        );
      }}
    />
  );
};
