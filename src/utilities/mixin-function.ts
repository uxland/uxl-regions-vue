import Vue from "vue";
import { VueClass } from "vue-class-component/lib/declarations";

export declare type MixinFunction<
  T1 extends VueClass<any> = VueClass<any>,
  T2 extends VueClass<Vue> = VueClass<Vue>
> = (superClass: T2) => VueClass<T1 & T2>;
