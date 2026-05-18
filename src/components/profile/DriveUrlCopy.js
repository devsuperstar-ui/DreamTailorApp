import { useState } from "react";

export default function DriveUrlCopy({ url, error, colors }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!url && !error) return null;

  if (error && !url) {
    return (
      <div
        style={{
          marginTop: "12px",
          padding: "10px 12px",
          background: "rgba(234, 179, 8, 0.1)",
          border: "1px solid #eab308",
          borderRadius: "6px",
          color: "#eab308",
          fontSize: "12px",
        }}
      >
        PDF downloaded, but Google Drive upload failed: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "12px",
        padding: "12px",
        background: colors.infoBg,
        border: `1px solid ${colors.infoText}`,
        borderRadius: "6px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: "600",
          color: colors.infoText,
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
        }}
      >
        Google Drive link
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
        <input
          type="text"
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "8px 10px",
            fontSize: "12px",
            fontFamily: "inherit",
            color: colors.text,
            background: colors.inputBg,
            border: `1px solid ${colors.inputBorder}`,
            borderRadius: "6px",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={copyUrl}
          style={{
            flexShrink: 0,
            padding: "8px 14px",
            fontSize: "12px",
            fontWeight: "600",
            color: colors.buttonText,
            background: copied ? colors.successText : colors.buttonBg,
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            fontSize: "12px",
            fontWeight: "600",
            color: colors.linkColor,
            background: colors.inputBg,
            border: `1px solid ${colors.inputBorder}`,
            borderRadius: "6px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Open
        </a>
      </div>
    </div>
  );
}
