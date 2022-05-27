/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { Image, Input, Space, Typography } from "@pankod/refine-antd";
import "./type.less";

type UploadImageProps = {
  file: File;
  setFile: (data: File) => void;
  url?: string;
};

export const UploadImage = (props: UploadImageProps) => {
  const { file, setFile, url } = props;

  const fileHandler = (e: any) => {
    setFile(e?.target?.files[0]);
  };

  return (
    <div>
      {file && (
        <Space size={12}>
          <Image
            width={200}
            src={file ? URL.createObjectURL(file) : ""}
            placeholder={
              <Image
                preview={false}
                src={file ? URL.createObjectURL(file) : ""}
                width={200}
              />
            }
          />
          <label htmlFor="file" className="replace">
            <Typography.Text>Replace</Typography.Text>
          </label>
        </Space>
      )}

      <Input className="file" id="file" type="file" onChange={fileHandler} />
      {!file && (
        <label htmlFor="file">
          <Image
            preview={false}
            src={url ? url : "/images/global/upload.png"}
            width={200}
          />
        </label>
      )}
    </div>
  );
};
