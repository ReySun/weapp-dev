export interface WeappSitemapJson {
  desc?: string;
  rules: {
    action: "allow" | "disallow";
    page: string;
    params?: unknown[];
    matching?: "exact" | "exclusive" | "inclusive" | "partial";
    priority?: number;
  }[];
}
