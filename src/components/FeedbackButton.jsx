import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { ChatIcon } from "./Icons";
import "../styles/Feedback.css";
import "../styles/glass.css";

const MAX_CHARS = 500;
// Free Web3Forms access key (public by design); delivers each submission to your inbox.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

// Labeled pill above the footer that opens a rating popover.
// The popover grows out of the button, and suggestion chips change with the rating.
export default function FeedbackButton() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const suggestions =
    rating === 0
      ? []
      : rating <= 2
        ? t("feedbackSuggestLow")
        : rating === 3
          ? t("feedbackSuggestMid")
          : t("feedbackSuggestHigh");

  function addSuggestion(s) {
    setText((prev) => {
      const next = prev ? `${prev.trimEnd()}. ${s}` : s;
      return next.slice(0, MAX_CHARS);
    });
  }

  async function submit(e) {
    e.preventDefault();
    if (!rating || sending) return;
    setSending(true);
    setFailed(false);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `TARUMT Bus Schedule feedback: ${rating}/5`,
          rating: `${rating}/5`,
          message: text || "(no comment)",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setRating(0);
        setText("");
      }, 1800);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  const shown = hover || rating;

  return (
    <div className="feedback" ref={rootRef}>
      <button
        type="button"
        className="pill-btn feedback-toggle glass"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <ChatIcon size={18} />
        {t("feedbackOpen")}
      </button>

      {open && (
        <form className="feedback-panel glass" onSubmit={submit} role="dialog" aria-label={t("feedbackTitle")}>
          {sent ? (
            <p className="feedback-thanks">{t("feedbackThanks")}</p>
          ) : (
            <>
              <h3 className="feedback-title">{t("feedbackTitle")}</h3>
              <p className="feedback-prompt">{t("feedbackPrompt")}</p>

              <div className="stars" onPointerLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={n <= shown ? "star on" : "star"}
                    onClick={() => setRating(n)}
                    onPointerEnter={() => setHover(n)}
                    aria-label={`${n} ${t("feedbackStar")}`}
                    aria-pressed={n === rating}
                  >
                    ★
                  </button>
                ))}
              </div>

              {suggestions.length > 0 && (
                <>
                  <p className="feedback-prompt">{t("feedbackSuggestHeading")}</p>
                  <div className="suggestions" key={rating <= 2 ? "low" : rating === 3 ? "mid" : "high"}>
                    {suggestions.map((s) => (
                      <button type="button" key={s} className="suggestion" onClick={() => addSuggestion(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <textarea
                className="feedback-text"
                value={text}
                maxLength={MAX_CHARS}
                rows={4}
                placeholder={t("feedbackPlaceholder")}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="feedback-count">
                {text.length}/{MAX_CHARS}
              </div>

              {failed && <p className="feedback-error">{t("feedbackError")}</p>}
              <button type="submit" className="feedback-send" disabled={!rating || sending}>
                {sending ? t("feedbackSending") : t("feedbackSend")}
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
