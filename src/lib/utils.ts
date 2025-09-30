// This file provides utility functions that can be used throughout the application.

// Import the `clsx` library and the `ClassValue` type.
// `clsx` is a tiny utility for constructing `className` strings conditionally.
// For example: `clsx('foo', true && 'bar', 'baz')` will return `'foo bar baz'`.
import { clsx, type ClassValue } from "clsx"

// Import the `tailwind-merge` library.
// `tailwind-merge` is a utility that intelligently merges Tailwind CSS classes.
// It resolves conflicts between classes. For example, `twMerge('p-4', 'p-2')` will
// correctly return `'p-2'`, as the last padding utility takes precedence.
import { twMerge } from "tailwind-merge"

// This is the `cn` (short for "class names") utility function, a best practice
// popularized by ShadCN UI and other component libraries.
// It combines the power of `clsx` and `tailwind-merge`.
export function cn(...inputs: ClassValue[]) {
  // 1. `clsx(inputs)` takes all the arguments (strings, objects, arrays) and
  //    constructs a single class name string.
  // 2. `twMerge(...)` then takes that string and merges the classes, resolving
  //    any conflicts and ensuring a clean, final class string.
  // This is especially useful when building components that accept a `className` prop
  // and need to merge default classes with user-provided classes.
  return twMerge(clsx(inputs))
}
