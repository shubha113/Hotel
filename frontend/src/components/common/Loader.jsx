const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="spinner"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;