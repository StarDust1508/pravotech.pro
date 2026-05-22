import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () => api.settings.list(),
    staleTime: 5 * 60 * 1000,
    placeholderData: {} as Record<string, string>,
  });
}
