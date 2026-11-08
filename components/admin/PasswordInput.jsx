"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { iconClass, inputClass } from "@/components/admin/authForm";
import { focusRing } from "@/components/admin/ui";

// Password field with the lock icon and a show/hide button. Goes inside a <label>, or
// pass `id` for a separate <label htmlFor>; `errorId` links the field to its error message.
export default function PasswordInput({ id, name, autoComplete, placeholder, error, errorId }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <span className="relative">
      <Lock className={iconClass} aria-hidden />
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} pr-[52px]`}
      />
      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-pressed={showPassword}
        className={`absolute right-[4px] top-1/2 flex size-[40px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[6px] text-[#9d9d9d] transition-colors duration-200 hover:text-white ${focusRing}`}
      >
        {showPassword ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
      </button>
    </span>
  );
}
