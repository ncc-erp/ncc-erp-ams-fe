import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useLogin } from "@pankod/refine-core";
import { MEZON_AUTH_URL_API } from "api/baseApi";
import useLoginWithMezon from "hooks/useLoginWithMezon";
import { useMezonLoginByHash } from "hooks/useMezonLoginByHash";
import dataProvider from "providers/dataProvider";
import "styles/antd.less";

import {
  buttonLoginMezon,
  cardStyles,
  checkboxStyles,
  containerStyles,
  formItemStyles,
  fullHeightRow,
  imageContainer,
  layoutStyles,
  logo,
  mezonLogoStyle,
  rememberContainer,
  titleContentStyles,
  titleStyles,
} from "./styles";

const { Title } = Typography;

export interface ILoginForm {
  username: string;
  password: string;
  remember: boolean;
}

/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/api-references/components/refine-config#loginpage} for more details.
 */
export const LoginPage: React.FC = () => {
  const [form] = Form.useForm<ILoginForm>();
  const { t } = useTranslation();
  const [isLoadingMezon, setIsLoadingMezon] = useState<boolean>(false);

  useLoginWithMezon();
  useMezonLoginByHash();

  const { mutate: login, isLoading } = useLogin<ILoginForm>();

  const CardTitle = (
    <Title level={3} style={titleStyles} data-test-id="title">
      <div style={titleContentStyles}>{t("pages.login.title")}</div>
    </Title>
  );

  const getMezonAuthUrl = async () => {
    try {
      setIsLoadingMezon(true);
      const { post } = dataProvider;
      const url = MEZON_AUTH_URL_API;
      const data = await post({
        url: url,
        payload: {},
      });
      window.location.href = data.data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMezon(false);
    }
  };

  return (
    <Layout style={layoutStyles}>
      <Row justify="center" align="middle" style={fullHeightRow}>
        <Col xs={22}>
          <div style={containerStyles}>
            <div style={imageContainer}>
              <img
                style={logo}
                src="/images/global/nccsoft-logo-small.png"
                alt="Refine Logo"
              />
            </div>
            <Card
              title={CardTitle}
              headStyle={{ borderBottom: 0 }}
              style={cardStyles}
            >
              {process.env.REACT_APP_SHOW_MANUAL_LOGIN === "true" && (
                <Form<ILoginForm>
                  layout="vertical"
                  form={form}
                  onFinish={(values) => {
                    login(values);
                  }}
                  requiredMark={false}
                  initialValues={{
                    remember: false,
                  }}
                >
                  {/* Username */}
                  <Form.Item
                    name="username"
                    data-test-id="username"
                    label={t("pages.login.username")}
                    rules={[{ required: true }]}
                  >
                    <Input
                      size="large"
                      placeholder={t("pages.login.username")}
                    />
                  </Form.Item>

                  {/* Password */}
                  <Form.Item
                    data-test-id="password"
                    name="password"
                    label={t("pages.login.password")}
                    rules={[{ required: true }]}
                    style={formItemStyles}
                  >
                    <Input
                      type="password"
                      placeholder="●●●●●●●●"
                      size="large"
                    />
                  </Form.Item>

                  {/* Check box remember me */}
                  <div style={rememberContainer}>
                    <Form.Item
                      data-test-id="remember"
                      name="remember"
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox style={checkboxStyles}>
                        {t("pages.login.remember")}
                      </Checkbox>
                    </Form.Item>
                  </div>

                  {/* Sign in button */}
                  <Button
                    data-test-id="signin-btn"
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={isLoading}
                    block
                  >
                    {t("pages.login.signin")}
                  </Button>
                </Form>
              )}
              <Button
                data-test-id="signin-mezon-btn"
                type="primary"
                size="large"
                block
                icon={
                  <img
                    style={mezonLogoStyle}
                    src={"/images/svg/mezon-logo-black.svg"}
                  />
                }
                loading={isLoadingMezon}
                onClick={() => getMezonAuthUrl()}
                style={buttonLoginMezon}
                className="btn-login-mezon"
              >
                {t("pages.login.signinMezon")}
              </Button>
            </Card>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};
