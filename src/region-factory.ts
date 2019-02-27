import Vue from "vue";
import { Region, RegionDefinition, IRegion } from "./region";
import { IRegionManager } from "./region-manager";
import { RegionAdapterRegistry } from "./region-adapter-registry";
import { invariant } from "./utilities/invariant";

export const regionFactory = (
  definition: RegionDefinition,
  host: Vue,
  regionManager: IRegionManager,
  adapterRegistry: RegionAdapterRegistry
): IRegion => {
  let target = host.$refs[definition.targetId];
  let adapterFactory = adapterRegistry.getAdapterFactory(<Element>target);
  invariant(typeof adapterFactory === "function", "No region adapter factory found for the host");
  let adapter = adapterFactory(definition, <any>target);
  invariant(adapter, "No region adapter found for the host");
  let targetRegionManager = definition.scoped ? regionManager.createRegionManager() : regionManager;
  let region = new Region(definition.name, targetRegionManager, target as any, adapter, definition);
  targetRegionManager.add(definition.name, region);
  return region;
};
