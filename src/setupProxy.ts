import { createProxyMiddleware } from "http-proxy-middleware";
import { Application } from "express";

export default function (app: Application) {
  app.use(
    "/oauth/token",
    createProxyMiddleware({
      target: process.env.REACT_APP_API_PROXY,
      changeOrigin: true,
    })
  );
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_API_PROXY,
      changeOrigin: true,
      // pathRewrite: { "^/api": "" },
    })
  );
}
