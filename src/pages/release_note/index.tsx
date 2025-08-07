import React from "react";
import { useTranslate } from "@pankod/refine-core";
import { ReleaseNoteList } from "./ReleaseNoteList";

const ReleaseNotePage: React.FC = () => {
  const t = useTranslate();
  return (
    <div style={{ padding: 24 }}>
      <h2>{t("resource.release_note")}</h2>
      <ReleaseNoteList />
    </div>
  );
};

export default ReleaseNotePage;
