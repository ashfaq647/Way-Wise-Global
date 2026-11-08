import { CircleAlert } from "lucide-react";
import { errorClass, errorIconClass } from "@/components/admin/authForm";

// Error message under a field in the admin password forms. `id` is what the field's
// aria-describedby points to.
export default function FieldError({ id, children }) {
  return (
    <span id={id} className={errorClass}>
      <CircleAlert className={errorIconClass} aria-hidden />
      {children}
    </span>
  );
}
