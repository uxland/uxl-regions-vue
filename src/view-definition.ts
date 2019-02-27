import Vue from "vue";
import { IRegion } from "./region";

export type ViewFactory = () => Promise<Vue>;
export interface ViewDefinition {
  htmlTag?: string;
  htmlUrl?: string;
  factory?: ViewFactory;
  element?: HTMLElement;
  options?: any;
  isDefault?: boolean;
  removeFromDomWhenDeactivated?: boolean;
  sortHint?: string;
}
export interface ViewComponent {
  view: ViewDefinition;
  viewKey: string;
  region: IRegion;
  active: boolean;
}
