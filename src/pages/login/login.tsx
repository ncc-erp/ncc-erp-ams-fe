import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
} from "antd";

import { useLogin, useTranslate } from "@pankod/refine-core";
import { gapi } from "gapi-script";
import { MEZON_AUTH_URL_API } from "api/baseApi";

import {
  layoutStyles,
  containerStyles,
  titleStyles,
  imageContainer,
  logo,
  buttonLoginGoogle,
} from "./styles";
import "styles/antd.less";

import dataProvider from "providers/dataProvider";
import useLoginWithMezon from "hooks/useLoginWithMezon";
import { useMezonLoginByHash } from "hooks/useMezonLoginByHash";

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
  const translate = useTranslate();
  const [isLoadingMezon, setIsLoadingMezon] = useState<boolean>(false);

  useLoginWithMezon();
  useMezonLoginByHash();

  const { mutate: login, isLoading } = useLogin<ILoginForm>();

  const CardTitle = (
    <Title level={3} style={titleStyles} data-test-id="title">
      {translate("pages.login.title", "Sign in your account")}
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
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col xs={22}>
          <div style={containerStyles}>
            <div style={imageContainer}>
              <img
                style={logo}
                src="/images/global/nccsoft-logo-small.png"
                alt="Refine Logo"
              />
            </div>
            <Card title={CardTitle} headStyle={{ borderBottom: 0 }}>
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
                  <Form.Item
                    name="username"
                    data-test-id="username"
                    label={translate("pages.login.username", "Username")}
                    rules={[{ required: true }]}
                  >
                    <Input
                      size="large"
                      placeholder={translate(
                        "pages.login.username",
                        "Username"
                      )}
                    />
                  </Form.Item>
                  <Form.Item
                    data-test-id="password"
                    name="password"
                    label={translate("pages.login.password", "Password")}
                    rules={[{ required: true }]}
                    style={{ marginBottom: "12px" }}
                  >
                    <Input
                      type="password"
                      placeholder="●●●●●●●●"
                      size="large"
                    />
                  </Form.Item>
                  <div style={{ marginBottom: "12px" }}>
                    <Form.Item
                      data-test-id="remember"
                      name="remember"
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        {translate("pages.login.remember", "Remember me")}
                      </Checkbox>
                    </Form.Item>
                  </div>
                  <Button
                    data-test-id="signin-btn"
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={isLoading}
                    block
                  >
                    {translate("pages.login.signin", "Sign in")}
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
                    width={20}
                    style={{ marginRight: 10 }}
                    src="/images/svg/mezon-logo-black.svg"
                  />
                }
                loading={isLoadingMezon}
                onClick={() => getMezonAuthUrl()}
                style={buttonLoginGoogle}
                className="btn-login-mezon"
              >
                {translate("pages.login.signinMezon", "Sign in with Mezon")}
              </Button>
            </Card>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};
