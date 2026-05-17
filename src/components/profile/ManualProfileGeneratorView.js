import { useState, useEffect } from "react";
import { loadPdfDownload } from "@/lib/load-pdf-download";
import { useGenerationTimer } from "@/hooks/useGenerationTimer";
import { profileColors as colors } from "@/lib/theme-colors";
import ProfileModeSwitch from "@/components/profile/ProfileModeSwitch";

export default function ManualProfileGeneratorView({
  profileSlug,
  profileName,
  selectedProfileData,
}) {
  const [jd, setJd] = useState("");
  const [chatgptResponse, setChatgptResponse] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [disable, setDisable] = useState(false);
  const [lastGenerationTime, setLastGenerationTime] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [copyPromptLoading, setCopyPromptLoading] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const { elapsedTime, start: startTimer, stop: stopTimer, finishElapsed } = useGenerationTimer();

  const expectedJobCount = selectedProfileData?.experience?.length ?? 0;

  useEffect(() => {
    loadPdfDownload().catch(() => {});
  }, []);

  const copyToClipboard = async (text, fieldName) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
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

  const copyPromptToClipboard = async () => {
    if (!jd.trim()) {
      alert("Please enter a job description first");
      return;
    }
    setCopyPromptLoading(true);
    try {
      const response = await fetch("/api/manual-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profileSlug, jd }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to build prompt");
      }
      const { prompt } = await response.json();
      await navigator.clipboard.writeText(prompt);
      setCopiedField("prompt");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      alert("Failed to copy prompt: " + err.message);
    } finally {
      setCopyPromptLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!chatgptResponse.trim()) {
      alert("Please paste the ChatGPT response (JSON) first");
      return;
    }

    setDisable(true);
    setLastGenerationTime(null);
    setGenerateError(null);
    startTimer();

    let formatFetchError = (e) => e?.message || "Unknown error";
    try {
      const pdfDownload = await loadPdfDownload();
      formatFetchError = pdfDownload.formatFetchError;
      const {
        fetchWithTimeout,
        downloadPdfFromResponse,
        MANUAL_GENERATE_TIMEOUT_MS,
      } = pdfDownload;

      const response = await fetchWithTimeout(
        "/api/generate-manual",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: profileSlug,
            chatgptResponse: chatgptResponse.trim(),
            companyName: companyName.trim() || null,
            roleName: roleName.trim() || null,
          }),
        },
        MANUAL_GENERATE_TIMEOUT_MS
      );

      const fallbackFilename = `${profileName?.replace(/\s+/g, "_") || profileSlug}.pdf`;
      await downloadPdfFromResponse(response, fallbackFilename);
      setLastGenerationTime(finishElapsed());
    } catch (error) {
      console.error("Generation error:", error);
      stopTimer();
      const message = formatFetchError(error, { manual: true });
      setGenerateError(message);
      alert("Failed to generate PDF: " + message);
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
  ].filter((f) => f.value);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        padding: "16px",
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
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: 600, color: colors.text, margin: "0 0 2px" }}>
                {profileName}
              </h1>
              <p style={{ fontSize: "12px", color: colors.textMuted, margin: 0 }}>
                No API key • Use ChatGPT manually
              </p>
            </div>
            <ProfileModeSwitch profileSlug={profileSlug} mode="manual" />
          </div>

          {quickCopyFields.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                gap: "6px",
                paddingTop: "10px",
                borderTop: `1px solid ${colors.cardBorder}`,
              }}
            >
              {quickCopyFields.map(({ key, label, value, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => copyToClipboard(value, key)}
                  style={{
                    padding: "6px 4px",
                    background: copiedField === key ? colors.copyBg : colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    minHeight: "44px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{icon}</span>
                  <div style={{ fontSize: "9px", color: colors.textMuted }}>
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
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: colors.textSecondary }}>
              Step 1 — Job Description
            </label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here..."
              rows={5}
              style={{
                width: "100%",
                marginTop: "4px",
                padding: "8px",
                fontSize: "13px",
                color: colors.text,
                background: colors.textareaBg,
                border: `1px solid ${colors.inputBorder}`,
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: colors.textSecondary }}>
              Step 2 — Copy Prompt for ChatGPT
            </label>
            <button
              type="button"
              onClick={copyPromptToClipboard}
              disabled={copyPromptLoading || !jd.trim()}
              style={{
                width: "100%",
                marginTop: "4px",
                padding: "8px",
                fontWeight: 600,
                color: colors.buttonText,
                background: copyPromptLoading || !jd.trim() ? colors.buttonDisabled : colors.buttonBg,
                border: "none",
                borderRadius: "6px",
                cursor: copyPromptLoading || !jd.trim() ? "not-allowed" : "pointer",
              }}
            >
              {copiedField === "prompt"
                ? "✓ Copied! Paste into ChatGPT"
                : copyPromptLoading
                  ? "Building prompt..."
                  : "Copy Prompt (Profile + JD) → Paste in ChatGPT"}
            </button>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: colors.textSecondary }}>
              Step 3 — Paste ChatGPT Response (JSON)
            </label>
            <p style={{ fontSize: "11px", color: colors.textMuted, margin: "4px 0 6px" }}>
              Profile <strong>{profileName}</strong> has <strong>{expectedJobCount}</strong> job(s). JSON{" "}
              <code style={{ fontSize: "10px" }}>experience</code> must have exactly{" "}
              <strong>{expectedJobCount}</strong> entries (≤5 bullets each). Summary: one strong paragraph ~130–165 words.
              James Davis JSON → profile ID <strong>jd1</strong>.
            </p>
            <textarea
              value={chatgptResponse}
              onChange={(e) => setChatgptResponse(e.target.value)}
              placeholder='Paste JSON from ChatGPT: {"title":"...","summary":"...","skills":{},"experience":[]}'
              rows={8}
              style={{
                width: "100%",
                marginTop: "4px",
                padding: "8px",
                fontSize: "13px",
                fontFamily: "monospace",
                color: colors.text,
                background: colors.textareaBg,
                border: `1px solid ${colors.inputBorder}`,
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: colors.textSecondary }}>
              Company Name (Optional)
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google"
              style={{
                width: "100%",
                marginTop: "4px",
                padding: "6px 10px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: colors.textSecondary }}>
              Role Name (Optional)
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              style={{
                width: "100%",
                marginTop: "4px",
                padding: "6px 10px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={disable || !chatgptResponse.trim()}
            style={{
              width: "100%",
              padding: "8px",
              fontWeight: 600,
              color: colors.buttonText,
              background: disable || !chatgptResponse.trim() ? colors.buttonDisabled : colors.buttonBg,
              border: "none",
              borderRadius: "6px",
              cursor: disable || !chatgptResponse.trim() ? "not-allowed" : "pointer",
            }}
          >
            {disable
              ? elapsedTime < 30
                ? `Building PDF... (${elapsedTime}s)`
                : `Building PDF... (${elapsedTime}s — first run in dev can take 1–3 min)`
              : "Generate Resume PDF"}
          </button>

          {generateError ? (
            <div
              style={{
                marginTop: "12px",
                padding: "10px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid #ef4444",
                borderRadius: "6px",
                color: "#ef4444",
                fontSize: "12px",
              }}
            >
              {generateError}
            </div>
          ) : null}

          {lastGenerationTime ? (
            <div
              style={{
                marginTop: "12px",
                padding: "10px",
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
