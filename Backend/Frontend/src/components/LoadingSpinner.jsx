const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-container">
    <div className="spinner-ring">
      <div></div><div></div><div></div><div></div>
    </div>
    <p className="loading-text">{message}</p>
  </div>
);

export default LoadingSpinner;
