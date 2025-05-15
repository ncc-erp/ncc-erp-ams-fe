import {
  SyncOutlined,
  MenuOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Checkbox, Tooltip } from "antd";
import { IToolBarProps } from "interfaces/hardware";
import React, { useEffect, useRef, useState } from "react";

export const ToolbarActions: React.FC<IToolBarProps> = ({
  columns,
  selectedColumns,
  onToggleColumn,
  onRefresh,
  onOpenSearch,
  t,
}) => {
  const [isActive, setIsActive] = useState(false);
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);

  const onClickDropDown = () => setIsActive(!isActive);

  const listenForOutsideClicks = (
    listening: boolean,
    setListening: (arg0: boolean) => void,
    menuRef: { current: any },
    setIsActive: (arg0: boolean) => void
  ) => {
    if (listening || !menuRef.current) return;
    setListening(true);
    [`click`, `touchstart`].forEach((type) => {
      document.addEventListener(type, (event) => {
        const current = menuRef.current;
        const node = event.target;
        if (current && current.contains(node)) return;
        setIsActive(false);
      });
    });
  };

  useEffect(() => {
    const abortController = new AbortController();
    listenForOutsideClicks(listening, setListening, menuRef, setIsActive);
    return () => {
      abortController.abort();
    };
  }, []);

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
            <Tooltip
              title={t("hardware.label.tooltip.refresh")}
              color="#108ee9"
            >
              <SyncOutlined onClick={onRefresh} style={{ color: "black" }} />
            </Tooltip>
          </button>
        </div>
        <div>
          <button onClick={onClickDropDown} className="menu-trigger">
            <Tooltip
              title={t("hardware.label.tooltip.columns")}
              color="#108ee9"
            >
              <MenuOutlined style={{ color: "black" }} />
            </Tooltip>
          </button>
        </div>
        <nav className={`menu ${isActive ? "active" : "inactive"}`}>
          <div className="menu-dropdown">
            {columns.map((item) => (
              <Checkbox
                className="checkbox"
                key={item.key}
                onChange={() => onToggleColumn(item)}
                checked={selectedColumns.includes(item.key)}
              >
                {item.title}
              </Checkbox>
            ))}
          </div>
        </nav>
      </div>
      <div>
        <button
          className="menu-trigger"
          style={{
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
          }}
        >
          <Tooltip title={t("hardware.label.tooltip.search")} color="#108ee9">
            <FileSearchOutlined
              onClick={onOpenSearch}
              style={{ color: "black" }}
            />
          </Tooltip>
        </button>
      </div>
    </div>
  );
};
