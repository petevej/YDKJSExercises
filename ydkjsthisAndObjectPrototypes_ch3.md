# You Don't Know JS: This & Object Prototypes

# Chapter 3: Objects

## Syntax

Objects are available in two forms in JavaScript: 1) literal (declarative) form, and 2) constructed form

1) Literal Object
```js
var myObj = {
	key: value
	// ...		Here multiple key-value pairs can be added
};
```
2) Constructed Object
```js
var myObj = new Object();
myObj.key = value;
```

Note that it's extremely uncommon to create an object using the constructed form, majority usage is the literal form.

## 6 Language Types

### 5 Simple Primitives

* 'string'
* 'number'
* 'boolean'
* 'null'
* 'undefined'

***NOT everything in JavaScript is an object***

### 1 Complex Primitive

* 'object'

#### 9 Main Object Sub-Types:

	* 'String'
	* 'Number'
	* 'Boolean'
	* 'Object'
	* 'Function'
	* 'Array'
	* 'Date'
	* 'RegExp'
	* 'Error'

These may appear the same as types or classes, but they are actually built-in functions and can be used as constructors.

```js
var strPrimitive = "I am a string";
typeof strPrimitive;					// "string"
strPrimitive instanceof String;			// "false"  <-- this is a primitive, not an Object sub-type "String"

var strObject = new String( "I am a string");
typeof strObject;						// "Object"
strObject instanceof String;			// "true"

// inspect the object sub-type
Object.prototoype.toString.call( strObject );	// [object String]  <-- this is an object created by the 'String' constructor
```
Preference is to use the literal form to create a new object rather than constructed form.

Primitive literal with immutable value "I am a string" gets coerced to a 'String' object when we perform operations on it.

```js
var strPrimitive  = "I am a string";

console.log( strPrimitive.length );		// 13	<--- string primitive gets coerced to object String
console.log( strPrimitive.charAt( 3 ) );	// "m"	<--- again here
```
As for the 'Object', 'Array', 'Function', and 'RegExp', they are born as objects regardless of whether literal/constructed form was used.

The true use of the constructed form is for identifying extra options such as enumerability, writability, etc.

'Error' is often created automatically when exceptions are thrown.

## Contents

Contents or values of objects are stored at locations called properties. However, in implementation. The engine actually stores only property names inside the object container, and these can reference the actual values.

```js
var myObject = {
		a: 2
};

myObject.a;		// 2	<-- property access
myObject["a"];	// 2	<-- key access, the key need to be enclosed in "..." if there are spaces
```

The '["..."]' syntax can also be used to programmatically build up the value of the string:
```js
var wantA = true;
var myObject = {
		a: 2
};

var idx;

if (wantA) {
		idx = "a";	<--- Assigning the string "a" to variable idx
}

console.log( myObject[idx] );	// 2	<--- Property access uses the string "a" to return value 2
```

Property names in objects are always 'string' any other value type will be converted to a 'string' like so:
```js
var myObject = { };

// these properties are all coerced to 'string'
myObject[true] = "foo";
myObject[3] = "bar";
myObject[myObject] = "baz";

myObject["true"];			// "foo"
myObject["3"];				// "bar"
myObject["[object Object]"];	// "baz"
```
There are essentially two ways to access the value in the object - by either using the '.' or '[ ]' operator. The '.' syntax is "property" access,
whereas the '["a"]' syntax is the "key" access. However, both can be used to retrieve the value by accessing the same location.

The main difference is that the '.' operator requires the 'identifier' to alphanumeric (alphabets or numeric) but can only start with alphabets.

## Computed Property Name

Another very useful feature of the '[..]' property access is that you can compute an expression value to be used as the key name.

ES6 adds computed property names where an expression can be speicifed in the key-name position of an object-literal decalaration:
```js
var prefix = "foo";

var myObject = {
		[prefix + "bar"]: "hello",
		[previx + "baz"]: "world"
};

myObject["foobar"];		// hello
myObject["foobaz"];		// world
```

## Property vs. Method

In other languages, functions that belong to objects are called "methods". However, in JavaScript, these are still just functions stored in an object.
```js
function foo() {
	console.log( "foo" );
}

var someFoo = foo;		// variable reference to 'foo'

var myObject = {
	someFoo: foo
};

foo;					// function foo(){..}

someFoo;				// function foo(){..}

myObject.someFoo;		// function foo(){..}
```

## Arrays

Arrays use *numeric indexing*, essentially values are stored in locations - indices that start with 0.
```js
var myArray = [ "foo", 42, "bar" ];

myArray.length;			// 3

myArray[0];				// "foo"

myArray[2];				// "bar"
```
Adding properties to array is also possible:
```js
var myArray = [ "foo", 42, "bar" ];

myArray.baz = "baz";

myArray.length;		// 3

myArray.baz;		// baz
```
Adding named properties like the above will not change the length of the array. Array could be used to store key/value pairs, but object is more suitable.

A slight caution here is that, adding a property name that looks like a number to the array will end up getting recorded as a numeric index instead.
```js
var myArray = [ "foo", 42, "bar" ];

myArray["3"] = "baz";		// this adds "baz" to the 3rd index

myArray.length;		// 4

myArray[3];			// "baz"
```

## Duplicating Objects

ES6 has introduced a solution which allows for shallow copying using 'Object.assign(..)'. It takes a *target* object as the first parameter and the (one or more) source objects as the second parameters.
It iterates over all the unmerable, owned keys of the source objects and copies (via '=' assignment) to target.

```js
var newObj = Object.assign( {}, myObject );

newObj.a;			// 2
newObj.b === anotherObject;		// true
newObj.c === anotherArray;		// true
newObj.d === anotherFunction;	// true
```
This is purely a value '=' copy, and any property characteristics defined in the original object is not copied over.

## Property Descriptors

Previous to ES5, there was no direct way to inspect/compare property characteristics e.g. writeability, enumerability.

Now with ES5, all these characteristicsare referred to as **property descriptor**.

```js
var myObject = {
		a: 2
};

Object.getOwnPropertyDescriptor( myObject, "a" );
// {
//		value: 2,
//		writable: true,
//		enuemrable: true,
//		configurable: true
// }
```
These property descriptors can be added/modified using 'Object.defineProperty(..)'
```js
var myObject = {};

Object.defineProperty( myObject, "a", {
		value: 2,
		writable: true,
		configurable: true,
		enumerable: true
} );

myObject.a;		// 2
```
### Writable

When a property descriptor is set to 'writable: false', the value of the property cannot be re-assigned.
```js
var myObject = {};

Object.defineProperty( myObject, "a", {
		value: 2,
		writable: false,	// not writable
		configurable: true,
		enumerable: true
} );

myObject.a = 3;

myObject.a;		// 2 <--- this is because of non-writable descriptor
```
Trying to overwrite a non-writable value will cause the attempt to silently fail, in 'strict mode', however, we will get a 'TypeError'

### Configurable

This is the I/O switch for usage of 'defineProperty(..)'
```js
var myObject = {
		a: 2
};

myObject.a = 3;
myObject.a;			// 3

Object.defineProperty( myObject, "a", {
		value: 4,
		writable: true,
		configurable: false,		// not configurable!
		enumerable: true
} );

myObject.a;			// 4
myObject.a = 5;
myObject.a;			// 5

Object.defineProperty( myObject, "a", {
		value: 6,
		writable: true,
		configurable: true,
		enumerable: true
} );	// TypeError
```
Setting configurability to 'false' is a one-way ticket - cannot undo! However, writable can still be changed from 'true' -> 'false'

Another effect of setting 'configurable: false' is that it prevents the ability to use 'delete' to remove a property

```js
var myObject = {
		a: 2
};

myObject.a;		// 2
delete myObject.a;
myObject.a;		// undefined

Object.defineProperty( myObject, "a", {
		value: 2,
		writable: true,
		configurable: false,
		enumerable: true
});

myObject.a;		// 2
delete myObject.a;
myObject.a;		// 2	<-- by setting configurable: false, the delete call failed silently
```
In JavaScript, the 'delete' tool can only be used to remove object property, it will allow unreferenced object/function to be garbage collected. However, it will not free up allocated memory like in other languages.

### Enumerable

This is just a I/O switch that will decide whether the object property will show up in the enumerations, e.g. 'foo..in' loop.

Although it will not show up in enumerations, the object property is still completely accessible otherwise.

### Immutability

This is just a I/O switch that decides whether the object or property can be changed.

Although this switch is only shallow, if the object references another object (array, object, function, etc.), the contents of the referenced objects are not affected and are still mutable.
```js
myImmutableObject.foo;		// [1,2,3]
myImmutableObject.foo.push( 4 );
myImmutableObject.foo;		// [1,2,3,4]
```
Here only myImmutableObject is set to 'immutable', therefore 'foo' array remains mutable.

### Object Constant

This one is a combo move consisting of 'writable:false' and 'configurable:false'. By setting both these characteristics to 'false', what you get is a *constant*
```js
var myObject = {};

Object.defineProperty( myObject, "FAVORITE_NUMER", {
		value: 42,
		writable: false,
		configurable: false
} );
```

### Prevent Extensions

If you want to prevent new extensions from being added to the object, call 'Object.preventExtensions(..)':
```js
var myObject = {
		a: 2
};

Object.preventExtensions( myObject );

myObject.b = 3;
myObject.b;		// undefined  <-- adding a new property 'b' throws an error silently
```
### Seal

This call is a combo between 'Object.preventExtensions(..)' and setting the property 'configurable:false' so that you can no longer reconfigure or delete any existing properties. Although modification of the value is still allowed.

### Freeze

Freezing an object with 'Object.freeze(..)' is a combo move consisting of calling 'Object.seal(..)' and setting property 'writable:false', this means objects will both be non-configurable and non-writable.

**This is the highest level of immutability for an object**

*Note: the object being referenced by Frozen object is still mutable*

## '[[Get]]'

This topic deals with how properties are accessed. Take for example:
```js
var myObject = {
		a: 2
};

myObject.a;		// 2
```
To access property 'a' of 'myObject' object, the engine performs a '[[Get]]' operation on 'myObject' that looks for the property name and then retrieve the value.

The important distinction here is that if the '[[Get]]' algorithm does not find a property of the requested name, it will traverse up the '[[Prototype]]' chain if it exists.

If the '[[Get]]' operation cannot find any value for the property, then it will return 'undefined'
```js
var myObject = {
		a: 2
};

myObject.b;		// undefined
```
Notice that the error type is different for when the variable being referenced is missing, where the 'ReferenceError' will be thrown instead.

```js
var myObject = {
		a: undefined
};

myObject.a;		// undefined	<-- the engine found this right away
myObject.b;		// undefined  <-- the engine did a bit more work for this
```
The distinction here was that the value returned in 'myObject.a' call was explicitly defined while the 'myObject.b' actually failed to locate the property and the 'undefined' was the default output of the '[[Get]]' function.

### '[[Put]]'

the '[[Put]]' operation goes hand-in-hand with the '[[Get]]' operation. It does the job of assigning a value to a property of an object.

If the property is present, the '[[Put]]' function will check for:
1. Is the property an accessor descriptor, if so, then call the setter
2. Is the property a data descriptor with 'writable:false'? If so, then fail silently in 'non-strict mode' or throw a 'TypeError' in 'strict' mode.
3. Otherwise, set the value to the existing property

## Getters & Setters

Since ES5, there is a way to override part of the default getter and setter operations.

Getters = properties which call a hidden function to retrieve a value
Setters = properties which actually call a hidden function to set a value

A property that has both getter and setter defined becomes an "accessor descriptor" vs regular "data descriptor". For example:
```js
var myObject = {
		// define a getter for 'a'
		get a() {
				return 2;
		}
};

Object.defineProperty(
		myObject,		// target
		"b",				// property name
		{									// descriptor
					// define a getter for 'b'
					get: function() { return this.a * 2 },

					// make sure 'b' shows up as an object property
					enumerable: true
		}
);

myObject.a;		// 2
myObject.b;		// 4
```
Above example shows creation of a property on an object that calls a function via the object-literal syntax and with 'defineProperty(..)' call.
```js
var myObject = {
		// define a getter for 'a'
		get a() {
				return 2;
		}
};

myObject.a = 3;
myObject.a;		// 2
```
By only defining a getter for 'a', any effort to set a new value for 'a' is futile. If we want to utilize a setter, we must define it.
```js
var myObject = {
		// define a getter for 'a'
		get a() {
				return this._a_;
		},
		// define a setter for 'a'
		set a() {
				this._a_ = val * 2;
		}
};

myObject.a = 2;

myObject.a;		// 4 <--- Here the setter function is invoked
```
## Existence

Remember how we had a hard time distinguishing between the value 'undefined' being assigned to the object's property? Worry no more! Now there is a new way to check whether a property exists as all.
```js
var myObject = {
		a: 2
};

("a" in myObject);		//	true
("b" in myObject);		// false

myObject.hasOwnProperty( "a" );		// true
myObject.hasOwnProperty( "b" );		// false
```
The 'in' operator checks not only whether a property (not value of a property) exists inside an object but it will also check higher up the '[[Prototype]]' chain.

By contrast, 'hasOwnProperty(..)' only checks in the 'myObject' and not further up the '[[Prototype]]' chain.

An object that is created without the link to 'Object.prototype' such as 'Object.create(null)' would cause the call 'myObject.hasOwnProperty(..)' to fail.

As a counter, one would have to use 'explicit binding' to bind 'this' to 'myObject': 'Object.prototype.hasOwnProperty.call(myObject, "a")'

### Enumeration

Recall that an enumerable object is not going to show up in enumerations such as 'for..in' loop. However, it will still be accessible.
```js
var myObject = { };

Object.defineProperty(
		myObject,
		"a",
		// make 'a' enumerable, as normal
		{ enumerable: true, value: 2 }
);

Object.defineProperty(
		myObject,
		"b",
		// make 'b' non-enumerable
		{ enumerable: false, value: 3}
);

myObject.b;		// 3  <--- value can be accessed normally
("b" in myObject);		// true
myObject.hasOwnProperty( "b" );		// true

for (var k in myObject) {
		console.log( k, myObject[k] );
}
// "a" 2  <-- notice that only the enumerable 'a' shows up

// Here is how to check enumerability
myObject.propertyIsEnumerable( "a" );		// true
myObject.propertyIsEnumerable( "b" );		// false

// Object.keys returns only enumerable properties (direct object only, not [[Prototype]])
Object.keys( myObject );		// ["a"]

// Object.getOwnPropertyNames returns all properties (direct object only, not [[Prototype]])
Object.getOwnPropertyNames( myObject );		// ["a", "b"]
```
**Note:** the 'for..in' loop can behave unexpectedly for array which contains both values stored in numeric index as well as enumerable properties. Better reserve 'for..in' for objects and traditional 'for' loops for arrays.

## Iteration

The 'for..in' loop is helpful for iteration over enumerable properties but how do you iterate over the values of the object?

For numerically-indexed arrays, simply use the standar 'for' loop:
```js
var myArray = [1, 2, 3];

for (var i = 0; i < myArray.length; i++) {
		console.log( myArray[i] );
}
// 1 2 3
```
There are a few other helpers for array iteration: 'forEach(..)', 'every(..)', and 'some(..)'. Each of these helper will pick an choose what they iterate over.

* 'forEach(..)' will iterate over *all* values in the array and ignores any callback return values
* 'every(..)' keeps going until the end or callback returns a 'false' value
* 'some(..)' keeps going until the end or callback returns a 'true' value

You can think of them as having special 'break' statement inside the for loop where the iteration can break the loop early.

**Note:** These types of enumeration will not return object's properties in any order, unlike the index-based 'for' loop

There is also another way to iterate over the values of the array directly without referencing the indices - through 'for..of' loop:
```js
var myArray = [1, 2, 3];

for (var v of myArray) {
		console.log( v );
}
// 1
// 2
// 3
```
Inside the 'for..of' loop, it asks for the iterator function @@iterator and iterates by calling the 'next()' method.

To illustrate the concept, this is how manual iteration is done:
```js
var myArray = [1, 2, 3];
var it = myArray[Symbol.iterator]();

it.next();	// { value:1, done:false }
it.next();	// { value:2, done:false }
it.next();  // { value:3, done:false }
it.next();	// { done; true }
```
**Note:** While arrays have a built-in @@iterator function, objects do not. However, it is possible to DIY default @@iterator for any object.
```js
var myObject = {
	a: 2,
	b: 3
};

Object.defineProperty( myObject, Symbol.iterator, {
	enumerable: false,
	writable: false,
	configurable: true,
	value: function() {
		var o = this;
		var idx = 0;
		var ks = Object.keys( o );
		return {
			next: function() {
				return {
					value: o[ks[idx++]],
					done: (idx > ks.length)
				};
			}
		};
	}
} );

// iterate `myObject` manually
var it = myObject[Symbol.iterator]();
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { value:undefined, done:true }

// iterate `myObject` with `for..of`
for (var v of myObject) {
	console.log( v );
}
// 2
// 3
```

## TL;DR

* Object-literal ('var a = { .. }') and Constructed ('var a = new Array(..)') form of objects have different uses

* Not everything in JavaScript is an object, there are 6 primitive types. Objects also have sub-types, including 'function'

* Objects are simply collections of key/value pairs and can be accessed via the property 'myObject.propName' or the key 'myObject["propName"]' access

* Accessing property of an object is done by the engine calling the [[Get]] and [[Putt]] function, both work with the [[Prototype]] chain

* Properties have descriptors which control their behaviors e.g. 'writable' and 'configurable'

* Immutability Hierarchy is as follows: 'Object.freeze(..)' > 'Object.seal(..)' > 'Object.preventExtension(..)'

* Properties can be "accessor properties" and not contain values

* ES6 allows for iteration over data structures (arrays, objects, etc.) with 'for..of' loop. However, arrays have built-in @@iterator function but objects don't
