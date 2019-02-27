import Vue from "vue";
import { VueClass } from "vue-class-component/lib/declarations";
import { Mixin } from "vue-mixin-decorator";
import { Prop, Watch } from "vue-property-decorator";
import { ViewDefinition } from "./view-definition";
import { MixinFunction } from "./utilities/mixin-function";

export interface IRegionView {
  active: boolean;
  activeChanged(current: boolean, previous: boolean): void;
  view: ViewDefinition;
}
export interface RegionViewConstructor extends VueClass<Vue> {
  new (...args: any[]): IRegionView & VueClass<Vue>;
}
export interface IRegionViewMixin<T = any> extends IRegionView, VueClass<Vue> {
  new (): IRegionViewMixin<T> & T & VueClass<Vue>;
}
export type RegionViewFunction = MixinFunction<RegionViewConstructor>;

export const regionView: RegionViewFunction = (superClass: VueClass<Vue>) => {
  @Mixin
  class RegionView extends superClass implements IRegionView {
    @Prop({ type: Boolean })
    active: boolean;

    @Watch("active")
    activeChanged(current: boolean, previous: boolean): void {}
    view: ViewDefinition;
  }
  return <any>RegionView;
};
