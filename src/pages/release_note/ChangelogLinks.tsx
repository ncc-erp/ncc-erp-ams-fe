import React from "react";
import { shortenChangelogLink } from "./releaseNoteHelpers";

interface ChangelogLinksProps {
  links: string[];
}

export const ChangelogLinks: React.FC<ChangelogLinksProps> = ({ links }) => (
  <div style={{ marginLeft: 31, marginTop: 4 }}>
    {links.map((link, idx) => (
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
);
