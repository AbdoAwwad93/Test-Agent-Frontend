export type StatusFilter = "all" | "pass" | "fail" | "canceled";

export const PAGE_SIZE = 7;

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
  { value: "canceled", label: "Canceled" },
];