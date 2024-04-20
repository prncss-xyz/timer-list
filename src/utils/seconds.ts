import { optic } from "optics-ts";

export function pad(char: string, len: number, value: string) {
  while (value.length < len) {
    value = char + value;
  }
  return value;
}

type Nums = readonly [number, number, number];

function parse(input: string): Nums {
  const res = input.replace(/[^0-9.]/g, "");
  const hours = Number(res.slice(-6, -4));
  const mins = Number(res.slice(-4, -2));
  const secs = Number(res.slice(-2));
  return [hours, mins, secs];
}

function factorize(input: number): Nums {
  const secs = input % 60;
  const mins = Math.floor(input / 60) % 60;
  const hours = Math.floor(input / 3600);
  return [hours, mins, secs];
}

function toNumber([hours, mins, secs]: Nums) {
  return secs + 60 * mins + 3600 * hours;
}

function dd(n: number) {
  return pad("0", 2, String(n));
}

function toString(ns: Nums) {
  return ns.map(dd).join(":");
}

export function toSeconds(input: string) {
  return toNumber(parse(input));
}

export function normalizeSeconds(input: string) {
  return toString(parse(input));
}

export function fromSeconds(input: number) {
  return toString(factorize(input));
}

export const secondsString = optic<number>().iso(fromSeconds, toSeconds);
