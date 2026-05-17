import { useState } from "react";
import { loadPdfDownload } from "@/lib/load-pdf-download";
import { useGenerationTimer } from "@/hooks/useGenerationTimer";
import { profileColors as colors } from "@/lib/theme-colors";
import ProfileModeSwitch from "@/components/profile/ProfileModeSwitch";

export default function ProfileGeneratorView({
  profileSlug,
  profileName,
  selectedProfileData,
}) {
  const [jd, setJd] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [disable, setDisable] = useState(false);
  const [lastGenerationTime, setLastGenerationTime] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const { elapsedTime, start: startTimer, stop: stopTimer, finishElapsed } = useGenerationTimer();

  const copyToClipboard = async (text, fieldName) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const getLastCompany = () => selectedProfileData?.experience?.[0]?.company || null;
  const getLastRole = () => selectedProfileData?.experience?.[0]?.title || null;

  const handleGenerate = async () => {
    if (!jd.trim()) {
      alert("Please enter a job description");
      return;
    }

    setDisable(true);
    setLastGenerationTime(null);
    startTimer();

    let formatFetchError = (e) => e?.message || "Unknown error";
    try {
      const pdfDownload = await loadPdfDownload();
      formatFetchError = pdfDownload.formatFetchError;
      const { fetchWithTimeout, downloadPdfFromResponse, AI_GENERATE_TIMEOUT_MS } = pdfDownload;

      const response = await fetchWithTimeout(
        "/api/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: profileSlug,
            jd,
            companyName: companyName.trim() || null,
            roleName: roleName.trim() || null,
          }),
        },
        AI_GENERATE_TIMEOUT_MS
      );

      const fallbackFilename = `${profileName?.replace(/\s+/g, "_") || profileSlug}.pdf`;
      await downloadPdfFromResponse(response, fallbackFilename);
      setLastGenerationTime(finishElapsed());
    } catch (error) {
      console.error("Generation error:", error);
      stopTimer();
      alert("Failed to generate PDF: " + formatFetchError(error));
    } finally {
      setDisable(false);
      stopTimer();
    }
  };

  const quickCopyFields = [
    { key: "email", label: "Email", value: selectedProfileData.email, icon: "📧" },
    { key: "phone", label: "Phone", value: selectedProfileData.phone, icon: "📞" },
    { key: "location", label: "Address", value: selectedProfileData.location, icon: "📍" },
    { key: "postalCode", label: "Postal Code", value: selectedProfileData.postalCode, icon: "✉️" },
    { key: "lastCompany", label: "Last Company", value: getLastCompany(), icon: "🏢" },
    { key: "lastRole", label: "Last Role", value: getLastRole(), icon: "💼" },
    { key: "linkedin", label: "LinkedIn", value: selectedProfileData.linkedin, icon: "💼" },
    { key: "github", label: "GitHub", value: selectedProfileData.github, icon: "💻" },
  ].filter((field) => field.value);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
        padding: "16px",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            background: colors.cardBg,
            borderRadius: "8px",
            border: `1px solid ${colors.cardBorder}`,
            padding: "16px",
            marginBottom: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: colors.text,
                  margin: "0 0 2px 0",
                }}
              >
                {profileName}
              </h1>
              {selectedProfileData.title && (
                <p style={{ fontSize: "12px", color: colors.textSecondary, margin: 0 }}>
                  {selectedProfileData.title}
                </p>
              )}
            </div>
            <ProfileModeSwitch profileSlug={profileSlug} mode="api" />
          </div>

          {quickCopyFields.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                gap: "8px",
                paddingTop: "12px",
                borderTop: `1px solid ${colors.cardBorder}`,
              }}
            >
              {quickCopyFields.map(({ key, label, value, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => copyToClipboard(value, key)}
                  style={{
                    padding: "8px 6px",
                    background: copiedField === key ? colors.copyBg : colors.inputBg,
                    border: `1px solid ${copiedField === key ? colors.infoText : colors.inputBorder}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    minHeight: "60px",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{icon}</span>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "500",
                      color: copiedField === key ? colors.successText : colors.textMuted,
                      textTransform: "uppercase",
                    }}
                  >
                    {copiedField === key ? "Copied!" : label}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            background: colors.cardBg,
            borderRadius: "8px",
            border: `1px solid ${colors.cardBorder}`,
            padding: "16px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "600",
                color: colors.textSecondary,
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              Job Description
            </label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here..."
              rows={10}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "13px",
                fontFamily: "inherit",
                color: colors.text,
                background: colors.textareaBg,
                border: `1px solid ${colors.inputBorder}`,
                borderRadius: "6px",
                outline: "none",
                resize: "vertical",
                minHeight: "180px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "600",
                color: colors.textSecondary,
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              Company Name <span style={{ fontWeight: 400, textTransform: "none" }}>(Optional)</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                color: colors.text,
                background: colors.inputBg,
                border: `1px solid ${colors.inputBorder}`,
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "600",
                color: colors.textSecondary,
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              Role Name <span style={{ fontWeight: 400, textTransform: "none" }}>(Optional)</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                color: colors.text,
                background: colors.inputBg,
                border: `1px solid ${colors.inputBorder}`,
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={disable || !jd.trim()}
            style={{
              width: "100%",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: "600",
              color: colors.buttonText,
              background: disable || !jd.trim() ? colors.buttonDisabled : colors.buttonBg,
              border: "none",
              borderRadius: "6px",
              cursor: disable || !jd.trim() ? "not-allowed" : "pointer",
              marginBottom: "12px",
            }}
          >
            {disable ? `Generating... (${elapsedTime}s)` : "Generate Resume PDF"}
          </button>

          {lastGenerationTime ? (
            <div
              style={{
                padding: "10px 12px",
                background: colors.successBg,
                border: `1px solid ${colors.successText}`,
                borderRadius: "6px",
                color: colors.successText,
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              ✓ Resume generated successfully in {lastGenerationTime}s
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
