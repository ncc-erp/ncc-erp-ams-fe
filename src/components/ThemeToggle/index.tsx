import React from "react";
import { Button, Tooltip, ButtonProps } from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";
import { useTranslate } from "@pankod/refine-core";

interface ThemeToggleProps extends ButtonProps {
  showTooltip?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showTooltip = true,
  ...props
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const translate = useTranslate();

  const button = (
    <Button
      type="text"
      icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
      onClick={toggleTheme}
      aria-label={
        isDarkMode
          ? translate("theme.light_mode")
          : translate("theme.dark_mode")
      }
      {...props}
    />
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <Tooltip
      title={
        isDarkMode
          ? translate("theme.light_mode")
          : translate("theme.dark_mode")
      }
      getPopupContainer={() => document.body}
    >
      {button}
    </Tooltip>
  );
};

export default ThemeToggle;
