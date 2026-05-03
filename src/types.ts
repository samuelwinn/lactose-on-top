export interface Game {
  name: string;
  html: string;
  subtitle?: string;
  description?: string;
  isNative?: boolean;
}

export interface WidgetSettings {
  enabled: boolean;
}
