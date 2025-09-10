import { Modal, Button } from "@pankod/refine-antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useLogout, useNavigation } from "@pankod/refine-core";
import { useTranslation } from "react-i18next";

type UnauthorizedModalProps = {
  visible: boolean;
  onClose?: () => void;
};

export const UnauthorizedModal = (props: UnauthorizedModalProps) => {
  const { visible, onClose } = props;
  const { mutate: logout } = useLogout();
  const { t } = useTranslation();
  const { push } = useNavigation();

  const handleLogout = () => {
    localStorage.removeItem("unauthorized");
    onClose?.();
    logout();
    push("/login");
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: "#faad14" }} />
          {t("modal.unauthorized.title", "Session Expired")}
        </div>
      }
      visible={visible}
      closable={false}
      maskClosable={false}
      footer={[
        <Button key="logout" type="ghost" onClick={handleLogout}>
          {t("modal.unauthorized.logout", "Logout")}
        </Button>,
      ]}
    >
      <p>
        {t(
          "modal.unauthorized.message",
          "Your session has expired. Please login again."
        )}
      </p>
    </Modal>
  );
};
