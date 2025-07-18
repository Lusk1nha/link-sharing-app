export const TEMPLATE_MAP = Symbol('TEMPLATE_MAP');

export interface TemplateSchema {
  name: string;
  subject: string;
}

export type TemplateMap = Record<string, TemplateSchema>;
