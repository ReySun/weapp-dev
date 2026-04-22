export interface WeappThemeJson {
  light?: {
    [k: string]: string;
  };
  dark?: {
    [k: string]: string;
  };
  [k: string]: unknown;
}
