import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function FormActions({ onCancel, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-4">
      {onCancel && (
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}
