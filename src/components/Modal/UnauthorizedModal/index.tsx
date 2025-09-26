import { Modal, Button } from "@pankod/refine-antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useLogout, useNavigation } from "@pankod/refine-core";
import { useTranslation } from "react-i18next";
import "./style.less";
import { LocalStorageKey } from "enums/LocalStorageKey";

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
    localStorage.removeItem(LocalStorageKey.UNAUTHORIZED);
    onClose?.();
    logout();
    push("/login");
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <ExclamationCircleOutlined className="modal-icon" />
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
