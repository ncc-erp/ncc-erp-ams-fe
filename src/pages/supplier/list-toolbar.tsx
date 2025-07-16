import { Tooltip } from "@pankod/refine-antd";
import { SyncOutlined } from "@ant-design/icons";
import { MenuOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { FilterOutlined } from "@ant-design/icons";

interface ISupplierListToolbarProps {
  t: any;
  menuRef: React.RefObject<HTMLDivElement>;
  handleRefresh: () => void;
  handleOpenSearchModal: () => void;
  handleResetFilter: () => void;
  onClickDropDown: () => void;
  isActive: boolean;
  collumns: any[];
  onCheckItem: (item: any) => void;
  collumnSelected: any[];
}
export const SupplierListToolbar = (
  props: ISupplierListToolbarProps
): JSX.Element => {
  return (
    <>
      <div className="other_function">
        <div className="menu-container" ref={props.menuRef}>
          <div>
            <button
              className="menu-trigger"
              style={{
                borderTopLeftRadius: "3px",
                borderBottomLeftRadius: "3px",
              }}
            >
              <Tooltip
                title={props.t("supplier.label.tooltip.refresh")}
                color={"#108ee9"}
              >
                <SyncOutlined
                  onClick={props.handleRefresh}
                  style={{ color: "black" }}
                />
              </Tooltip>
            </button>
          </div>
          <div>
            <button onClick={props.onClickDropDown} className="menu-trigger">
              <Tooltip
                title={props.t("supplier.label.tooltip.columns")}
                color={"#108ee9"}
              >
                <MenuOutlined style={{ color: "black" }} />
              </Tooltip>
            </button>
          </div>

          <nav className={`menu ${props.isActive ? "active" : "inactive"}`}>
            <div className="menu-dropdown">
              {props.collumns.map((item) => (
                <Checkbox
                  className="checkbox"
                  key={item.key}
                  onChange={() => props.onCheckItem(item)}
                  checked={props.collumnSelected.includes(item.key)}
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
            <Tooltip
              title={props.t("supplier.label.tooltip.search_advanced")}
              color={"#108ee9"}
            >
              <FileSearchOutlined
                onClick={props.handleOpenSearchModal}
                style={{ color: "black" }}
              />
            </Tooltip>
          </button>
        </div>
        <div>
          <button
            className="menu-trigger"
            onClick={() => props.handleResetFilter()}
          >
            <Tooltip
              title={props.t("supplier.label.tooltip.resetFilter")}
              color="#108ee9"
            >
              <Badge
                count={
                  <CloseOutlined style={{ fontSize: 8, color: "white" }} />
                }
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
    </>
  );
};
