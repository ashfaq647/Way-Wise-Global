"use client";

import { useId, useRef, useState, useTransition } from "react";
import { CircleAlert, LoaderCircle, Mail, Send, X } from "lucide-react";
import Notice from "@/components/admin/Notice";
import { buttonPrimary, buttonSecondary, fieldClass, focusRing } from "@/components/admin/ui";
import { EMAIL_MESSAGE_MAX, EMAIL_SUBJECT_MAX } from "@/lib/email/limits";
import { sendInquiryEmail } from "@/lib/admin/actions";

const labelClass = "text-[13px] font-medium leading-[20px] text-white";
const errorClass = "flex items-start gap-[6px] text-[13px] leading-[18px] text-[#ff4d4d]";

function FieldError({ id, messages }) {
  if (!messages?.length) return null;
  return (
    <span id={id} className={errorClass}>
      <CircleAlert className="mt-[2px] size-[14px] shrink-0" aria-hidden />
      {messages[0]}
    </span>
  );
}

// "Send email" button + compose dialog for one inquiry. The browser sends only the inquiry ID,
// subject and message; the server looks up the recipient (the inquiry's email) itself.
// `recipientEmail` is shown here for reference only and is never sent back.
export default function SendEmailDialog({ inquiryId, recipientName, recipientEmail, defaultSubject }) {
  const dialogRef = useRef(null);
  const messageRef = useRef(null);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null); // last result while the dialog is open
  const [sentNotice, setSentNotice] = useState(null); // shown under the button after sending
  const [isPending, startTransition] = useTransition();
  const id = useId();
  const fieldErrors = result?.ok === false ? (result.fieldErrors ?? {}) : {};

  function open() {
    setResult(null);
    setSentNotice(null);
    dialogRef.current?.showModal();
    messageRef.current?.focus();
  }

  function close() {
    if (!isPending) dialogRef.current?.close();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isPending) return;
    setResult(null);
    startTransition(async () => {
      let res;
      try {
        res = await sendInquiryEmail({ inquiryId, subject, message });
      } catch {
        res = { ok: false, error: "The email could not be sent. Check your connection and try again." };
      }
      // No result: the session had ended and the server redirected to the login page
      if (!res) return;
      if (res.ok) {
        dialogRef.current?.close();
        setSubject(defaultSubject);
        setMessage("");
        setSentNotice(res.sent ? "sent" : "logged");
      } else {
        setResult(res);
      }
    });
  }

  const fieldProps = (name) =>
    fieldErrors[name] ? { "aria-invalid": "true", "aria-describedby": `${id}-${name}-error` } : {};

  return (
    <>
      <button type="button" onClick={open} className={`${buttonPrimary} w-full`}>
        <Mail className="size-[16px]" aria-hidden />
        Send email
      </button>

      <div aria-live="polite" className="empty:hidden">
        {sentNotice === "sent" && (
          <Notice title="Email sent.">It was sent to {recipientEmail}.</Notice>
        )}
        {sentNotice === "logged" && (
          <Notice variant="warning" title="Not sent (test mode).">
            Email is set to log only (EMAIL_TRANSPORT=log), so nothing was delivered.
          </Notice>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-title`}
        // Escape: ignored while sending
        onCancel={(e) => isPending && e.preventDefault()}
        // a click on the dimmed backdrop (outside the panel) closes it; the draft is kept
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto w-[calc(100%-32px)] max-w-[640px] rounded-[12px] border border-[#2e2e2e] bg-[#0c0c0c] p-0 text-white shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop:bg-black/70"
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-center justify-between gap-[12px] border-b border-[#2e2e2e] px-[20px] py-[14px] sm:px-[24px]">
            <h2 id={`${id}-title`} className="font-oxanium text-[16px] font-bold leading-[24px] text-white">
              Send email
            </h2>
            <button
              type="button"
              onClick={close}
              disabled={isPending}
              aria-label="Close"
              className={`flex size-[36px] cursor-pointer items-center justify-center rounded-[8px] text-[#9d9d9d] transition-colors duration-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
            >
              <X className="size-[18px]" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col gap-[16px] p-[20px] sm:p-[24px]">
            <div className="flex min-w-0 flex-col gap-[4px]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a7a]">To</span>
              <span className="break-words text-[15px] leading-[22px] text-white">
                {recipientName} <span className="text-[#b2b2b2]">&lt;{recipientEmail}&gt;</span>
              </span>
            </div>

            <label className="flex flex-col gap-[8px]">
              <span className={labelClass}>Subject</span>
              <input
                type="text"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={EMAIL_SUBJECT_MAX}
                autoComplete="off"
                className={`${fieldClass} px-[14px]`}
                {...fieldProps("subject")}
              />
              <FieldError id={`${id}-subject-error`} messages={fieldErrors.subject} />
            </label>

            <label className="flex flex-col gap-[8px]">
              <span className={labelClass}>Message</span>
              <textarea
                ref={messageRef}
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={EMAIL_MESSAGE_MAX}
                rows={9}
                placeholder={`Write your reply to ${recipientName}…`}
                className={`${fieldClass} min-h-[220px] resize-y px-[14px] py-[12px] leading-[22px]`}
                {...fieldProps("message")}
              />
              <FieldError id={`${id}-message-error`} messages={fieldErrors.message} />
            </label>

            <div aria-live="polite" className="empty:hidden">
              {result?.ok === false && <Notice variant="error">{result.error}</Notice>}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-[12px] border-t border-[#2e2e2e] px-[20px] py-[16px] sm:flex-row sm:justify-end sm:px-[24px]">
            <button type="button" onClick={close} disabled={isPending} className={buttonSecondary}>
              Cancel
            </button>
            <button type="submit" disabled={isPending} aria-busy={isPending ? "true" : undefined} className={buttonPrimary}>
              {isPending ? (
                <LoaderCircle className="size-[16px] animate-spin motion-reduce:animate-none" aria-hidden />
              ) : (
                <Send className="size-[16px]" aria-hidden />
              )}
              {isPending ? "Sending…" : "Send email"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
