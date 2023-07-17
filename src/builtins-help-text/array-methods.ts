import { _mkText } from "./_mkText";
import { setHelpText } from "../api/help/help";

export function installArrayMethodsHelpTexts(global: typeof globalThis) {
  for (const [value, name, description, link] of [
    // Commented out because it has the same value as Array.prototype.values, so
    // the two are indistinguishable from a help text perspective
    // [
    //   global.Array.prototype[Symbol.iterator],
    //   "Array<T>.prototype[@@iterator](): Iterator<T>",
    //   "The [@@iterator]() method of Array instances implements the iterable protocol and allows arrays to be consumed by most syntaxes expecting iterables, such as the spread syntax and for...of loops. It returns an array iterator object that yields the value of each index in the array.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/@@iterator",
    // ],
    [
      global.Array.prototype.at,
      "Array<T>.prototype.at(index: number): T",
      "The at() method takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative integers count back from the last item in the array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at",
    ],
    [
      global.Array.prototype.concat,
      "Array<T>.prototype.concat(...values: any | Array<any>): Array<T>",
      "The concat() method is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat",
    ],
    [
      global.Array.prototype.copyWithin,
      "Array<T>.prototype.copyWithin(target: number, start: number, end?: number): Array<T>",
      "The copyWithin() method shallow copies part of an array to another location in the same array and returns it without modifying its length.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin",
    ],
    [
      global.Array.prototype.entries,
      "Array<T>.prototype.entries(): Iterator<T>",
      "The entries() method returns a new array iterator object that contains the key/value pairs for each index in the array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries",
    ],
    [
      global.Array.prototype.every,
      "Array<T>.prototype.every(callbackFn: (element: T, index: number, array: Array<T>) => boolean, thisArg?: any): boolean",
      "The every() method tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every",
    ],
    [
      global.Array.prototype.fill,
      "Array.prototype.fill<T>(value: T, start?: number, end?: number): Array<T>",
      "The fill() method changes all elements in an array to a static value, from a start index (default 0) to an end index (default array.length). It returns the modified array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill",
    ],
    [
      global.Array.prototype.filter,
      "Array<T>.prototype.filter(callbackFn: (element: T, index: number, array: Array<T>) => boolean, thisArg?: any): Array<T>",
      "The filter() method creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test implemented by the provided function.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter",
    ],
    [
      global.Array.prototype.find,
      "Array<T>.prototype.find(callbackFn: (element: T, index: number, array: Array<T>) => boolean, thisArg?: any): T | undefined",
      "The find() method returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find",
    ],
    [
      global.Array.prototype.findIndex,
      "Array<T>.prototype.findIndex(callbackFn: (element: T, index: number, array: Array<T>) => boolean, thisArg?: any): number",
      "The findIndex() method returns the index of the first element in an array that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex",
    ],

    // not in our QuickJS
    // [
    //   global.Array.prototype.findLast,
    //   "Array<T>.prototype.findLast(callbackFn: (element: T, index: number, array: Array<T>) => boolean, thisArg?: any): T | undefined",
    //   "The findLast() method iterates the array in reverse order and returns the value of the first element that satisfies the provided testing function. If no elements satisfy the testing function, undefined is returned.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast",
    // ],

    // not in our QuickJS
    // [
    //   global.Array.prototype.findLastIndex,
    //   "Array<T>.prototype.findLastIndex(callbackFn: (element: T, index: number, array: Array<T>) => boolean, thisArg?: any): number",
    //   "The findLastIndex() method iterates the array in reverse order and returns the index of the first element that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex",
    // ],
    [
      global.Array.prototype.flat,
      "Array<T | T[]>.prototype.flat(depth?: number): Array<T>",
      "The flat() method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat",
    ],
    [
      global.Array.prototype.flatMap,
      "Array<T | T[]>.prototype.flatMap(callbackFn: (element: T, index: number, array: Array<T>) => U, thisArg?: any): Array<U>",
      "The flatMap() method returns a new array formed by applying a given callback function to each element of the array, and then flattening the result by one level. It is identical to a map() followed by a flat() of depth 1 (arr.map(...args).flat()), but slightly more efficient than calling those two methods separately.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap",
    ],
    [
      global.Array.prototype.forEach,
      "Array.prototype.forEach(callbackFn: (element: T, index: number, array: Array<T>) => void, thisArg?: any)",
      "The forEach() method executes a provided function once for each array element.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach",
    ],
    [
      global.Array.from,
      "Array.from(arrayLike: any, mapFn?: (element: any, index: number) => any, thisArg?: any): Array<any>",
      "The Array.from() static method creates a new, shallow-copied Array instance from an iterable or array-like object.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from",
    ],

    // not in our QuickJS
    // [
    //   global.Array.fromAsync,
    //   "Array.fromAsync(arrayLike: any, mapFn?: (element: any, index: number) => any, thisArg?: any): Promise<Array<any>>",
    //   "The Array.fromAsync() static method creates a new, shallow-copied Array instance from an async iterable, iterable, or array-like object.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync",
    // ],

    // not in our QuickJS
    // [
    //   global.Array.prototype.group,
    //   "Array.prototype.group(callbackFn: (element: T, index: number, array: Array<T>) => PropertyKey, thisArg?: any): Object",
    //   "The group() method groups the elements of the calling array according to the string values returned by a provided testing function. The returned object has separate properties for each group, containing arrays with the elements in the group.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group",
    // ],

    // not in our QuickJS
    // [
    //   global.Array.prototype.groupToMap,
    //   "Array.prototype.groupToMap(callbackFn: (element: T, index: number, array: Array<T>) => any, thisArg?: any): Map<any, any>",
    //   "The groupToMap() method groups the elements of the calling array using the values returned by a provided testing function. The final returned Map uses the unique values from the test function as keys, which can be used to get the array of elements in each group.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupToMap",
    // ],
    [
      global.Array.prototype.includes,
      "Array.prototype.includes(searchElement: any, fromIndex?: number): boolean",
      "The includes() method determines whether an array includes a certain value among its entries, returning true or false as appropriate.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes",
    ],
    [
      global.Array.prototype.indexOf,
      "Array.prototype.indexOf(searchElement: any, fromIndex?: number): number",
      "The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf",
    ],
    [
      global.Array.isArray,
      "Array.isArray(value: any): boolean",
      "The Array.isArray() static method determines whether the passed value is an Array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray",
    ],
    [
      global.Array.prototype.join,
      "Array.prototype.join(separator?: string)",
      "The join() method creates and returns a new string by concatenating all of the elements in an array (or an array-like object), separated by commas or a specified separator string. If the array has only one item, then that item will be returned without using the separator.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join",
    ],
    [
      global.Array.prototype.keys,
      "Array.prototype.keys(): Iterator<number | undefined>",
      "The keys() method returns a new array iterator object that contains the keys for each index in the array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys",
    ],
    [
      global.Array.prototype.lastIndexOf,
      "Array.prototype.lastIndexOf(searchElement: any, fromIndex?: number): number",
      "The lastIndexOf() method returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf",
    ],
    [
      global.Array.prototype.map,
      "Array<T>.prototype.map(callbackFn: (element: T, index: number, array: Array<T>) => U, thisArg?: any): Array<U>",
      "The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map",
    ],
    [
      global.Array.of,
      "Array.of(...elements: Array<any>)",
      "The Array.of() static method creates a new Array instance from a variable number of arguments, regardless of number or type of the arguments.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of",
    ],
    [
      global.Array.prototype.pop,
      "Array<T>.prototype.pop(): T | undefined",
      "The pop() method removes the last element from an array and returns that element. This method changes the length of the array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop",
    ],
    [
      global.Array.prototype.push,
      "Array.prototype.push(...elements: Array<any>): number",
      "The push() method adds the specified elements to the end of an array and returns the new length of the array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push",
    ],
    [
      global.Array.prototype.reduce,
      "Array<T>.prototype.reduce(callbackFn: (accumulator: any, currentValue: any, currentIndex: number, array: Array<T>) => any, initialValue?: any): any",
      'The reduce() method executes a user-supplied "reducer" callback function on each element of the array, in order, passing in the return value from the calculation on the preceding element. The final result of running the reducer across all elements of the array is a single value.',
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
    ],
    [
      global.Array.prototype.reduceRight,
      "Array<T>.prototype.reduceRight(callbackFn: (accumulator: any, currentValue: any, currentIndex: number, array: Array<T>) => any, initialValue?: any): any",
      "The reduceRight() method applies a function against an accumulator and each value of the array (from right-to-left) to reduce it to a single value.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight",
    ],
    [
      global.Array.prototype.reverse,
      "Array<T>.prototype.reverse(): Array<T>",
      "The reverse() method reverses an array in place and returns the reference to the same array, the first array element now becoming the last, and the last array element becoming the first. In other words, elements order in the array will be turned towards the direction opposite to that previously stated.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse",
    ],
    [
      global.Array.prototype.shift,
      "Array<T>.prototype.shift(): T | undefined",
      "The shift() method removes the first element from an array and returns that removed element. This method changes the length of the array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift",
    ],
    [
      global.Array.prototype.slice,
      "Array<T>.prototype.slice(start?: number, end?: number): Array<T>",
      "The slice() method returns a shallow copy of a portion of an array into a new array object selected from start to end (end not included) where start and end represent the index of items in that array. The original array will not be modified.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice",
    ],
    [
      global.Array.prototype.some,
      "Array.prototype.some(callbackFn: (element: T, index: number, array: Array<T>) => boolean, thisArg?: any): boolean",
      "The some() method tests whether at least one element in the array passes the test implemented by the provided function. It returns true if, in the array, it finds an element for which the provided function returns true; otherwise it returns false. It doesn't modify the array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some",
    ],
    [
      global.Array.prototype.sort,
      "Array<T>.prototype.sort(compareFn?: (a: T, b: T) => number): Array<T>",
      "The sort() method sorts the elements of an array in place and returns the reference to the same array, now sorted. The default sort order is ascending, built upon converting the elements into strings, then comparing their sequences of UTF-16 code units values.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort",
    ],
    [
      global.Array.prototype.splice,
      "Array<T>.prototype.splice(start: number, deleteCount?: number, ...items?: Array<any>): Array<T>",
      "The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice",
    ],
    [
      global.Array.prototype.toLocaleString,
      "Array.prototype.toLocaleString(locales: string | Array<string>, options: Object): string",
      "The toLocaleString() method returns a string representing the elements of the array. The elements are converted to Strings using their toLocaleString methods and these Strings are separated by a locale-specific String (such as a comma ",
      ").",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString",
    ],
    // not in our QuickJS
    // [
    //   global.Array.prototype.toReversed,
    //   "Array<T>.prototype.toReversed(): Array<T>",
    //   "The toReversed() method of Array instances is the copying counterpart of the reverse() method. It returns a new array with the elements in reversed order.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed",
    // ],

    // not in our QuickJS
    // [
    //   global.Array.prototype.toSorted,
    //   "Array<T>.prototype.toSorted(compareFn?: (a: T, b: T) => number): Array<T>",
    //   "The toSorted() method of Array instances is the copying version of the sort() method. It returns a new array with the elements sorted in ascending order.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted",
    // ],

    // not in our QuickJS
    // [
    //   global.Array.prototype.toSpliced,
    //   "Array<T>.prototype.toSpliced(start: number, deleteCount?: number, ...items?: Array<any>): Array<any>",
    //   "The toSpliced() method of Array instances is the copying version of the splice() method. It returns a new array with some elements removed and/or replaced at a given index.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced",
    // ],
    [
      global.Array.prototype.toString,
      "Array.prototype.toString(): string",
      "The toString() method returns a string representing the specified array and its elements.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString",
    ],
    [
      global.Array.prototype.unshift,
      "Array.prototype.unshift(...elements: Array<any>): number",
      "The unshift() method adds the specified elements to the beginning of an array and returns the new length of the array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift",
    ],
    [
      global.Array.prototype.values,
      "Array<T>.prototype.values(): Iterator<T>",
      "The values() method returns a new array iterator object that iterates the value of each item in the array.",
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values",
    ],

    // not in our QuickJS
    // [
    //   global.Array.prototype.with,
    //   "Array<T>.prototype.with(index: number, value: U): Array<T | U>",
    //   "The with() method of Array instances is the copying version of using the bracket notation to change the value of a given index. It returns a new array with the element at the given index replaced with the given value.",
    //   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with",
    // ],
  ] as const) {
    setHelpText(value, _mkText(name, link, description));
  }
}
