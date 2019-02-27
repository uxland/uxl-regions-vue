import Vue from "vue";
import { VueClass } from "vue-class-component/lib/declarations";
import { Mixin } from "vue-mixin-decorator";
import { RegionDefinition, IRegionBehavior } from "./region";
import { regionsProperty } from "./region-decorator";
import { IRegionManager, regionManager } from "./region-manager";
import { regionAdapterRegistry, RegionAdapterRegistry } from "./region-adapter-registry";
import { factory } from "./adapters/multiple-active-adapter";
import { regionFactory } from "./region-factory";
import { MixinFunction } from "./utilities/mixin-function";

export interface IRegionHostMixin<T = any> extends VueClass<Vue> {
  new (): IRegionHostMixin<T> & T & VueClass<Vue>;
}
export interface RegionHostMixin extends VueClass<Vue> {}
export interface RegionHostMixinConstructor extends VueClass<Vue> {
  new (...args: any[]): RegionHostMixin & VueClass<Vue>;
}
export type RegionHostMixinFunction = MixinFunction<RegionHostMixinConstructor>;

const getUxlRegions: (item: any) => { [key: string]: RegionDefinition } = item =>
  item.constructor[regionsProperty] || {};

export const RegionHostMixin: (
  RegionManager: IRegionManager,
  adapterRegistry: RegionAdapterRegistry
) => RegionHostMixinFunction = (regionManager, adapterRegistry) => (superClass: VueClass<Vue>) => {
  @Mixin
  class RegionHostMixinClass extends superClass {
    mounted() {
      //@ts-ignore
      if (super.mounted) super.mounted();
      let regions = getUxlRegions(this);
      Object.keys(regions).forEach(name => {
        let region = regionFactory(regions[name], <any>this, regionManager, adapterRegistry);
        (this as any)[name] = region;
        let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
        behaviors.forEach(b => b.attach());
      });
    }
    unmounted() {
      //@ts-ignore
      if (super.unmounted) super.unmounted();
      let regions = getUxlRegions(this);
      Object.keys(regions).forEach(name => {
        let region = (this as any)[name];
        if (region) {
          region.regionManager.remove(region);
          let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
          behaviors.forEach((b: IRegionBehavior) => b.detach());
        }
      });
    }
  }
  return <any>RegionHostMixinClass;
};

regionAdapterRegistry.registerDefaultAdapterFactory(factory);

export const RegionHost: RegionHostMixinFunction = RegionHostMixin(regionManager, regionAdapterRegistry);
