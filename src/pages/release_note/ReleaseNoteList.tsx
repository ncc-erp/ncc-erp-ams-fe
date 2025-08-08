import React, { useState } from "react";
import { List, Typography, Spin, Card, Avatar, Button } from "antd";
import ReactMarkdown from "react-markdown";
import { useReleaseNotes } from "hooks/useReleaseNotes";
import { IReleaseNote } from "interfaces/releaseNote";

const MAX_LINES = 7;

const renderMarkdown = (text: string) => {
  const regex = /(https:\/\/github\.com\/[^\s]+\/(pull|issues)\/(\d+))/g;
  const userRegex = /@([a-zA-Z0-9-_]+)/g;

  let replacedText = text.replace(
    userRegex,
    (full, username) => `[${full}](https://github.com/${username})`
  );
  replacedText = replacedText.replace(
    regex,
    (full, url, type, num) => `[${"#" + num}](${url})`
  );

  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => {
          const match = href?.match(/\/(pull|issues)\/(\d+)$/);
          if (match) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1677ff", fontWeight: 500 }}
              >
                #{match[2]}
              </a>
            );
          }
          const userMatch = href?.match(
            /^https:\/\/github\.com\/([a-zA-Z0-9-_]+)$/
          );
          if (userMatch) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1677ff", fontWeight: 500 }}
              >
                @{userMatch[1]}
              </a>
            );
          }
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1677ff", fontWeight: 500 }}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {replacedText}
    </ReactMarkdown>
  );
};

const shortenChangelogLink = (url: string) =>
  url.match(/compare\/([^/]+)$/)?.[1] || url.split("/").pop() || url;

const parseReleaseBody = (body: string) => {
  if (!body) return { changes: [], contributors: [], changelog: [] };
  const changes =
    body
      .match(/## What's Changed([\s\S]*?)(##|$)/)?.[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          (line.startsWith("*") || line.startsWith("-")) &&
          !line.toLowerCase().includes("full changelog")
      ) || [];
  const contributors =
    body
      .match(/## New Contributors([\s\S]*?)(##|$)/)?.[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          (line.startsWith("*") || line.startsWith("-")) &&
          !line.toLowerCase().includes("full changelog")
      ) || [];
  const changelog =
    body
      .match(/\*\*Full Changelog\*\*:(.*)/)?.[1]
      .split(/\s+/)
      .filter((link) => link.startsWith("http")) || [];
  return { changes, contributors, changelog };
};

export const ReleaseNoteList: React.FC = () => {
  const { data, loading } = useReleaseNotes();
  const [expanded, setExpanded] = useState<{ [id: number]: boolean }>({});

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

  const sorted = [...data].sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return (
    <List
      dataSource={sorted}
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
              What&apos;s Changed
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
              New Contributors
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
              <span style={{ fontWeight: 700 }}>Full Changelog:</span>
              <div style={{ marginLeft: 31, marginTop: 4 }}>
                {changelog.map((link, idx) => (
                  <div key={idx}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1677ff", fontWeight: 500 }}
                    >
                      {shortenChangelogLink(link)}
                    </a>
                  </div>
                ))}
              </div>
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
                          No details.
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
                      {isExpanded ? "Read Less" : "Read More"}
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
