import './SkeletonLoader.css';

export default function SkeletonLoader({ lines = 3, height = '16px', width = '100%' }) {
  return (
    <div className="skeleton-wrapper">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{
            height,
            width: i === lines - 1 ? '60%' : width,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}
