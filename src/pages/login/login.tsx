import React, { useEffect } from "react";
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

import { Icons } from "@pankod/refine-antd";

import { useLogin, useNavigation, useTranslate } from "@pankod/refine-core";

import {
  layoutStyles,
  containerStyles,
  titleStyles,
  imageContainer,
  logo,
  buttonLoginGoogle,
  forgotPass,
} from "./styles";
import "styles/antd.less";

import { useGoogleLogin, GoogleLoginResponse } from "react-google-login";

const { GoogleOutlined } = Icons;

const { Text, Title } = Typography;

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

  const { mutate: login, isLoading } = useLogin<ILoginForm>();
  const { list } = useNavigation();

  const CardTitle = (
    <Title level={3} style={titleStyles}>
      {translate("pages.login.title", "Sign in your account")}
    </Title>
  );

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
    ? process.env.REACT_APP_GOOGLE_CLIENT_ID
    : "773310957148-o1bk15p279jst37itlfqmfulglnh4t1k.apps.googleusercontent.com";

  const { mutate: loginGoogle, isLoading: isLoadingGoogle } =
    useLogin<GoogleLoginResponse>();

  const { signIn } = useGoogleLogin({
    onSuccess: (response) => {
      loginGoogle(response as GoogleLoginResponse);
    },
    clientId,
    isSignedIn: false,
    cookiePolicy: "single_host_origin",
  });

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
                  label={translate("pages.login.username", "Username")}
                  rules={[{ required: true }]}
                >
                  <Input
                    size="large"
                    placeholder={translate("pages.login.username", "Username")}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={translate("pages.login.password", "Password")}
                  rules={[{ required: true }]}
                  style={{ marginBottom: "12px" }}
                >
                  <Input type="password" placeholder="●●●●●●●●" size="large" />
                </Form.Item>
                <div style={{ marginBottom: "12px" }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
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
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isLoading}
                  block
                >
                  {translate("pages.login.signin", "Sign in")}
                </Button>
              </Form>
              <Button
                type="primary"
                size="large"
                block
                icon={<GoogleOutlined />}
                loading={isLoadingGoogle}
                onClick={() => signIn()}
                style={buttonLoginGoogle}
                className="btn-login-google"
              >
                {translate("pages.login.signinGoogle", "Sign in with google")}
              </Button>
            </Card>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};
