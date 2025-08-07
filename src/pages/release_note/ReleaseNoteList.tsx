import React, { useEffect, useState } from "react";
import { List, Typography, Spin, Card, Avatar, Button } from "antd";
import { IReleaseNote } from "interfaces/releaseNote";
import ReactMarkdown from "react-markdown";
import { RELEASE_NOTE_API } from "api/baseApi";
import dataProvider from "providers/dataProvider";
import { useReleaseNotes } from "hooks/useReleaseNotes";

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

// Rút gọn link Full Changelog
const shortenChangelogLink = (url: string) => {
  const match = url.match(/compare\/([^/]+)$/);
  if (match) return match[1];
  return url.split("/").pop() || url;
};

const parseReleaseBody = (body: string) => {
  if (!body) return { changes: [], contributors: [], changelog: [] };
  const changesMatch = body.match(/## What's Changed([\s\S]*?)(##|$)/);
  let changes =
    changesMatch?.[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          (line.startsWith("*") || line.startsWith("-")) &&
          !line.toLowerCase().includes("full changelog")
      ) || [];

  const contributorsMatch = body.match(/## New Contributors([\s\S]*?)(##|$)/);
  const contributors =
    contributorsMatch?.[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          (line.startsWith("*") || line.startsWith("-")) &&
          !line.toLowerCase().includes("full changelog")
      ) || [];

  const changelogMatch = body.match(/\*\*Full Changelog\*\*:(.*)/);
  const changelog =
    changelogMatch?.[1]
      .split(/\s+/)
      .filter((link) => link.startsWith("http")) || [];

  return { changes, contributors, changelog };
};

export const ReleaseNoteList: React.FC = () => {
  const { data, loading } = useReleaseNotes();
  const [expanded, setExpanded] = useState<{ [id: number]: boolean }>({});

  if (loading) return <Spin size="large" />;

  const sorted = [...data].sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const MAX_LINES = 7;

  return (
    <List
      dataSource={sorted}
      renderItem={(item) => {
        const { changes, contributors, changelog } = parseReleaseBody(
          item.body
        );
        const isExpanded = expanded[item.id] || false;

        let allLines: React.ReactNode[] = [];

        if (changes.length > 0) {
          allLines.push(
            <div
              key="changes-title"
              style={{
                marginLeft: 8,
                marginBottom: 0,
                fontWeight: 700,
                fontSize: 16,
                color: "#222",
              }}
            >
              What's Changed
            </div>
          );
          allLines = allLines.concat(
            changes.map((line, idx) => (
              <div
                key={`change-${idx}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginLeft: 24,
                  marginBottom: 0,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    marginRight: 8,
                    fontSize: 18,
                    lineHeight: "22px",
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
                marginLeft: 8,
                marginTop: 8,
                fontWeight: 700,
                fontSize: 16,
                color: "#222",
              }}
            >
              New Contributors
            </div>
          );
          allLines = allLines.concat(
            contributors.map((line, idx) => (
              <div
                key={`contributor-${idx}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginLeft: 24,
                  marginBottom: 0,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    marginRight: 8,
                    fontSize: 18,
                    lineHeight: "22px",
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
                marginLeft: 8,
                marginTop: 8,
                fontWeight: 700,
                fontSize: 16,
                color: "#222",
              }}
              key="changelog-title"
            >
              <span style={{ fontWeight: 700 }}>Full Changelog:</span>
              <div style={{ marginLeft: 16, marginTop: 4 }}>
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
                    <span>{item.tag_name}</span>
                    <span
                      style={{
                        marginLeft: 8,
                        wordBreak: "break-all",
                        display: "inline-block",
                        whiteSpace: "normal",
                        fontWeight: 700,
                        color: "#e74c3c",
                      }}
                    >
                      <a
                        href={item.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#e74c3c",
                          fontWeight: 700,
                          display: "inline-block",
                          wordBreak: "break-all",
                          whiteSpace: "normal",
                        }}
                      >
                        (View on Github)
                      </a>
                    </span>
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
                      style={{ paddingLeft: 0, marginLeft: 8 }}
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
