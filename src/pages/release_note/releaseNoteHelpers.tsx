import React from "react";
import ReactMarkdown from "react-markdown";

export const GITHUB_PR_OR_ISSUE_URL_REGEX =
  /(https:\/\/github\.com\/[^\s]+\/(pull|issues)\/(\d+))/g;
export const GITHUB_USERNAME_MENTION_REGEX = /@([a-zA-Z0-9-_]+)/g;
export const GITHUB_PR_OR_ISSUE_PATH_REGEX = /\/(pull|issues)\/(\d+)$/;
export const GITHUB_PROFILE_URL_REGEX =
  /^https:\/\/github\.com\/([a-zA-Z0-9-_]+)$/;

export const renderMarkdown = (text: string) => {
  let replacedText = text.replace(
    GITHUB_USERNAME_MENTION_REGEX,
    (full, username) => `[${full}](https://github.com/${username})`
  );
  replacedText = replacedText.replace(
    GITHUB_PR_OR_ISSUE_URL_REGEX,
    (full, url, type, num) => `[${"#" + num}](${url})`
  );

  return (
    <ReactMarkdown
      components={{
        a: ({
          href,
          children,
        }: {
          href?: string;
          children?: React.ReactNode;
        }) => {
          const match = href?.match(GITHUB_PR_OR_ISSUE_PATH_REGEX);
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
          const userMatch = href?.match(GITHUB_PROFILE_URL_REGEX);
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

export const shortenChangelogLink = (url: string) =>
  url.match(/compare\/([^/]+)$/)?.[1] || url.split("/").pop() || url;

export const parseReleaseBody = (body: string) => {
  if (!body) return { changes: [], contributors: [], changelog: [] };
  const changes =
    body
      .match(/## What's Changed([\s\S]*?)(##|$)/)?.[1]
      .split("\n")
      .map((line: string) => line.trim())
      .filter(
        (line: string) =>
          (line.startsWith("*") || line.startsWith("-")) &&
          !line.toLowerCase().includes("full changelog")
      ) || [];
  const contributors =
    body
      .match(/## New Contributors([\s\S]*?)(##|$)/)?.[1]
      .split("\n")
      .map((line: string) => line.trim())
      .filter(
        (line: string) =>
          (line.startsWith("*") || line.startsWith("-")) &&
          !line.toLowerCase().includes("full changelog")
      ) || [];
  const changelog =
    body
      .match(/\*\*Full Changelog\*\*:(.*)/)?.[1]
      .split(/\s+/)
      .filter((link: string) => link.startsWith("http")) || [];
  return { changes, contributors, changelog };
};
