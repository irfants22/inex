import { updateRecurringStatus } from "@/app/actions/recurring-transaction-actions";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function RecurringSwitchStatus({
  id,
  initialIsActive,
}: {
  id: string;
  initialIsActive: boolean;
}) {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [isPending, startTransition] = useTransition();

  function handleToggle(value: boolean) {
    const previousIsActive = isActive;
    setIsActive(value);

    startTransition(async () => {
      const result = await updateRecurringStatus(id, value);

      if (result.status === "error") {
        setIsActive(previousIsActive);
        toast.error("Failed to update recurring status", {
          description: result.message,
          descriptionClassName: "!text-black",
        });
      }
    });
  }
  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      id={id}
      disabled={isPending}
      className="data-checked:bg-emerald-500"
    />
  );
}
