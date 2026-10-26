"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import Link from "next/link";
import PartnerWithUsModal from "@/components/PartnerWithUsModal";

const OpenPartnerFormContext = createContext(() => {});

// Wraps the whole site (see app/layout.js) so every "Partner with us" button opens the
// same single form.
export function PartnerWithUsProvider({ children }) {
  const [open, setOpen] = useState(false);
  const returnFocusRef = useRef(null); // the button that opened the form gets focus back

  const openForm = useCallback((trigger) => {
    returnFocusRef.current = trigger;
    setOpen(true);
  }, []);
  const closeForm = useCallback(() => setOpen(false), []);

  return (
    <OpenPartnerFormContext.Provider value={openForm}>
      {children}
      <PartnerWithUsModal open={open} onClose={closeForm} returnFocusRef={returnFocusRef} />
    </OpenPartnerFormContext.Provider>
  );
}

// Drop-in replacement for the old `<Link href="#contact">` buttons: same element and
// classes, but a click opens the form. Without JavaScript it still jumps to #contact.
export function PartnerWithUsLink({ href = "#contact", onClick, ...props }) {
  const openForm = useContext(OpenPartnerFormContext);

  return (
    <Link
      href={href}
      aria-haspopup="dialog"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        e.preventDefault();
        openForm(e.currentTarget);
      }}
    />
  );
}
