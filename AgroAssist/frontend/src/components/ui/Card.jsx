export const Card = ({ children, className = '', title, action }) => {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
};
