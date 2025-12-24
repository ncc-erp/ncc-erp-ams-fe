import { FallbackProps } from "react-error-boundary";
import "./style.less";

export const Fallback = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="fallback-container">
      <div className="fallback-icon">
        <img
          width={100}
          style={{ marginRight: 10 }}
          src="/images/svg/error-icon.svg"
        />
      </div>
      <h2 className="fallback-title">OOPS!</h2>
      <p className="fallback-subtitle">Something went wrong.Please try again</p>
      <button className="fallback-button" onClick={resetErrorBoundary}>
        Retry
      </button>
    </div>
  );
};
