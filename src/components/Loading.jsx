import React from "react";

const Loading = () => {
  return (
    <div style={styles.loaderContainer}>
      <svg
        style={styles.svgLoader}
        viewBox="0 0 50 50"
      >
        <circle
          style={styles.circle}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
};

const styles = {
  loaderContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 9999,
  },
  svgLoader: {
    width: "80px",
    height: "80px",
  },
  circle: {
    stroke: "#3498db",
    strokeLinecap: "round",
    animation: "rotate 2s linear infinite, dash 1.5s ease-in-out infinite",
  },
  // Add keyframes for the animation
  "@keyframes rotate": {
    "100%": { transform: "rotate(360deg)" },
  },
  "@keyframes dash": {
    "0%": { strokeDasharray: "1, 150", strokeDashoffset: "0" },
    "50%": { strokeDasharray: "90, 150", strokeDashoffset: "-35" },
    "100%": { strokeDasharray: "90, 150", strokeDashoffset: "-124" },
  },
};

export default Loading;
