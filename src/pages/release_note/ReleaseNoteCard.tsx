import React from "react";
import { Card, Avatar, Typography, Tag, Button } from "antd";
import { useTranslate } from "@pankod/refine-core";
import { parseReleaseBody, renderMarkdown } from "./releaseNoteHelpers";
import { ChangelogLinks } from "./ChangelogLinks";
import { ReleaseNoteCardProps } from "interfaces/releaseNote";

export const ReleaseNoteCard: React.FC<ReleaseNoteCardProps> = ({
  item,
  expanded,
  onToggleExpand,
  maxLines = 7,
}) => {
  const t = useTranslate();
  const { changes, contributors, changelog } = parseReleaseBody(item.body);

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

  const showReadMore = allLines.length > maxLines;
  const visibleLines = expanded ? allLines : allLines.slice(0, maxLines);

  const releaseType = item.type;

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
                  marginRight: 8,
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#e74c3c")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#222")}
              >
                {item.tag_name}
              </a>
              {["FE", "BE"].includes(releaseType as string) && (
                <Tag
                  color={releaseType === "FE" ? "blue" : "green"}
                  style={{ marginLeft: 8 }}
                >
                  {releaseType}
                </Tag>
              )}
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
                onClick={onToggleExpand}
              >
                {expanded
                  ? t("release_note.read_less")
                  : t("release_note.read_more")}
              </Button>
            )}
          </div>
        }
      />
    </Card>
  );
};
