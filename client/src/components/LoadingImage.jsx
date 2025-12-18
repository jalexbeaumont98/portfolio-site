import { useState } from "react";
import "./loadingImage.css";

export default function LoadingImage({
  src,
  alt,
  className = "",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`loading-image-wrapper ${className}`}>
      {!loaded && <div className="image-spinner" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        loading="lazy"
        {...props}
      />
    </div>
  );
}