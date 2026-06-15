const ErrorMessage = ({ message = 'Something went wrong. Please try again.' }) => (
  <div className="error-banner" role="alert">
    <span>⚠️</span>
    <p className="error-text">{message}</p>
  </div>
);
export default ErrorMessage;
