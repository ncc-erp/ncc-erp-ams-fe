/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { Image, Input, Space, Typography } from "@pankod/refine-antd";
import "./type.less";

type UploadImageProps = {
  file: File | undefined;
  setFile: (data: File) => void;
  url?: string;
  id?: string;
};

export const UploadImage = (props: UploadImageProps) => {
  const { id, file, setFile, url } = props;

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
          <label htmlFor={id} className="replace">
            <Typography.Text>Replace</Typography.Text>
          </label>
        </Space>
      )}

      <Input className="file" id={id} type="file" onChange={fileHandler} />
      {!file && (
        <label htmlFor={id}>
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
