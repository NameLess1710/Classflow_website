import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { NAV_GROUPS, NAV_ITEMS } from "@/data/nav";

export function PageSearch({ open, onOpenChange }) {
  const navigate = useNavigate();
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, e.g. attendance, exams…" />
      <CommandList>
        <CommandEmpty>No matching page.</CommandEmpty>
        {NAV_GROUPS.map((g) => (
          <CommandGroup key={g} heading={g}>
            {NAV_ITEMS.filter((i) => i.group === g).map((item) => (
              <CommandItem
                key={item.to}
                value={`${item.label} ${item.description}`}
                onSelect={() => {
                  onOpenChange(false);
                  navigate({ to: item.to });
                }}
              >
                <item.icon className="mr-2 h-4 w-4 text-primary" />
                <span>{item.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
