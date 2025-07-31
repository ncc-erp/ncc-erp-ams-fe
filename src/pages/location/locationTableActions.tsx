import React, { RefObject } from "react";
import { Tooltip, Badge } from "antd";
import {
  SyncOutlined,
  FileSearchOutlined,
  FilterOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@pankod/refine-core";

type Props = {
  onRefresh: () => void;
  onOpenSearchModal: () => void;
  onResetFilter: () => void;
  menuRef?: RefObject<HTMLDivElement>;
};

export const LocationTableActions: React.FC<Props> = ({
  onRefresh,
  onOpenSearchModal,
  onResetFilter,
  menuRef,
}) => {
  const t = useTranslate();

  return (
    <div className="other_function">
      <div className="menu-container" ref={menuRef}>
        <div>
          <button
            className="menu-trigger"
            style={{
              borderTopLeftRadius: "3px",
              borderBottomLeftRadius: "3px",
            }}
          >
            <Tooltip title={t("buttons.refresh")} color={"#108ee9"}>
              <SyncOutlined onClick={onRefresh} style={{ color: "black" }} />
            </Tooltip>
          </button>
        </div>
      </div>

      <div>
        <button
          className="menu-trigger"
          style={{
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
          }}
        >
          <Tooltip
            title={t("location.label.title.search_advanced")}
            color={"#108ee9"}
          >
            <FileSearchOutlined
              onClick={onOpenSearchModal}
              style={{ color: "black" }}
            />
          </Tooltip>
        </button>
      </div>

      <div>
        <button className="menu-trigger" onClick={onResetFilter}>
          <Tooltip
            title={t("location.label.field.resetFilter")}
            color="#108ee9"
          >
            <Badge
              count={<CloseOutlined style={{ fontSize: 8, color: "white" }} />}
              size="small"
              offset={[-5, 5]}
              style={{
                backgroundColor: "#ff4d4f",
                boxShadow: "0 0 0 1px white",
              }}
            >
              <FilterOutlined style={{ fontSize: 15, color: "black" }} />
            </Badge>
          </Tooltip>
        </button>
      </div>
    </div>
  );
};
