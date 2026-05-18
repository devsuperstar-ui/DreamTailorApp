import { useEffect, useState } from "react";

/** Minimal Drive connect prompt — only when sign-in is still needed. */
export default function GoogleDriveConnect({ colors }) {
  const [needsConnect, setNeedsConnect] = useState(false);

  useEffect(() => {
    fetch("/api/google-drive/status")
      .then((r) => r.json())
      .then((s) => setNeedsConnect(s?.mode === "oauth_pending"))
      .catch(() => setNeedsConnect(false));
  }, []);

  if (!needsConnect) return null;

  return (
    <a
      href="/api/google-drive/auth"
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginBottom: "12px",
        padding: "6px 12px",
        fontSize: "12px",
        fontWeight: "500",
        color: colors.infoText,
        background: colors.infoBg,
        border: `1px solid ${colors.infoText}`,
        borderRadius: "6px",
        textDecoration: "none",
      }}
    >
      Connect Drive
    </a>
  );
}
