import { useLanguage } from "../context/LanguageContext";

const SHARE_URL = "https://joskethegreat.github.io/tarumt-bus-schedule/";
const SHARE_TEXT = `Need to see when TARUMT bus arrives? Now you can!\n\n${SHARE_URL}`;

async function shareViaApp(appName, fallbackUrl) {
  if (navigator.share) {
    try {
      await navigator.share({ text: SHARE_TEXT });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(SHARE_TEXT);
    alert(`Message copied! Paste it into a chat on ${appName} to share.`);
  } catch {
    // Clipboard unavailable; user can still copy the link manually from the alert.
    alert(SHARE_TEXT);
  }
  window.open(fallbackUrl, "_blank", "noopener,noreferrer");
}

export default function ShareButtons() {
  const { t } = useLanguage();

  return (
    <div className="share-section">
      <p className="share-title">{t("shareTitle")}</p>
      <div className="share-buttons">
        <a
          className="share-btn whatsapp"
          href={`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.42a9.87 9.87 0 0 0 4.63 1.18h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.4a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.21.84.86-3.13-.2-.32a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.17 8.33-8.17Zm-4.5 4.68c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42Z"/>
          </svg>
          <span>WhatsApp</span>
        </a>

        <a
          className="share-btn telegram"
          href={`https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent("Need to see when TARUMT bus arrives? Now you can!")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Telegram"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.05 3.58 2.9 10.7c-1.24.5-1.23 1.2-.23 1.5l4.65 1.45 1.8 5.5c.22.6.37.85.75.85.35 0 .5-.16.7-.36l1.9-1.83 4.72 3.48c.87.48 1.5.23 1.72-.8L22.7 4.86c.3-1.27-.48-1.84-1.65-1.28Zm-3.6 3.5-7.7 6.95-.32 3.36-1.6-4.9 9.32-5.85c.42-.26.8.06.5.44Z"/>
          </svg>
          <span>Telegram</span>
        </a>

        <button
          type="button"
          className="share-btn instagram"
          onClick={() => shareViaApp("Instagram", "https://www.instagram.com/direct/inbox/")}
          aria-label="Share on Instagram"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
          </svg>
          <span>Instagram</span>
        </button>

        <button
          type="button"
          className="share-btn xiaohongshu"
          onClick={() => shareViaApp("Xiaohongshu", "https://www.xiaohongshu.com/")}
          aria-label="Share on Xiaohongshu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="4" y="3" width="16" height="18" rx="3" />
            <path d="M8 8h8M8 12h5" strokeLinecap="round" />
          </svg>
          <span>RedNote</span>
        </button>
      </div>
    </div>
  );
}
