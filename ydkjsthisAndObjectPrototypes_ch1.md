# You Don't Know JS: This & Object Prototypes

# Chapter 1: this or That?

this mechanism allows for a more elegant way of passing along an object reference, creating a cleaner API and easier re-use.

Example:
```js
function identify() {
		return this.name.toUpperCase();
}

function speak() {
		var greeting = "Hello, I'm " + identify.call( this );
		console.log( greeting );
}

var me = {
		name: "Pete"
};

var you = {
		name: "Reader"
};

identify.call( me );	// PETE
identify.call( you );	// Reader

speak.call( me );		// Hello, I'm PETE
speak.call( you );		// Hello, I'm Reader
```
This code snippet allows the function identify() and speak() to be used re-used with multiple object variables (me and you) rather than needing a separate function for each object.

## Confusions

Myth #1: this can be used to reference the function itself in the context of recursion

This is not true, because rather than pointing to the function itself, this is creating a new object with the same name as the function, like so:

```js
function foo(num) {
		console.log( "foo: " + num );

		// keep track of how many times 'foo' is called
		this.count++;		// THIS actually creates a global variable "count"
}

foo.count = 0;		// here the value of the foo.count property is zeroed

var i;

for (i=0; i<10; i++) {
		if (i > 5) {
				foo( i );
		}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was 'foo' called?
console.log( foo.count ); // 0 - that is the value of the foo.count property!
```
If you want to refer to the function itself from inside the block, you can do this:
```js
function foo() {
		foo.count = 4;	// 'foo' refers to itself
}

setTimeout( function() {
		// anonymous function (no name), cannot
		// refer to itself
}, 10 );
```
Here you can see named function can refer to itself, whereas anonymous function cannot.

Going back to the previous example, you can use the foo identifier as a function object reference like so:
```js
function foo(num) {
		console.log( "foo: " + num );

		// keep track of how many times 'foo' is called
		foo.count++;		// here foo refers to the function itself
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
		if (i > 5) {
			foo( i );
		}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was 'foo' called?
console.log( foo.count ); // 4
```
However, this is still side-stepping the actual understanding of this and relies on lexical scoping of foo variable.

Good news is, we can force this to actually point to the foo function object!

```js
function foo(num) {
		console.log( "foo: " + num );

		// keep track of how many times 'foo' is called
		// Note: 'this IS actually 'foo' now, based on
		// how 'foo' is called (see below)
		this.count++;		
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
		if( i > 5) {
				// using 'call(..)', we make sure the 'this'
				// points at the function object ('foo') itself
				foo.call( foo, i );
		}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was 'foo' called?
console.log( foo.count ); // 4
```
## Its Scope

This sometimes gets used as a bridge to mix lexical scope look-ups, albeit unsuccessfully as there is no such bridge!
```js
function foo() {
		var a = 2;
		this.bar();
}

function bar() {
		console.log( this.a );
}

foo();
```
In order to take advantage of the lexical scope, you can nest 'bar()' inside of 'foo()' scope like so:
```js
function foo() {
		var a = 2;
		bar();

		function bar() {
			console.log( a );
		}
}
foo();	// 2
```
## What's 'this'?

'this' is not bound to author-time but rather runtime (it is in the "present"!). It is contexual based upon how the function is invoked.
When a function is invoked, an activation record (execution record) is created to maintain info about where the function was called from (call-stack),
how the function was invoked (what parameters were passed, etc.). This will maintain the same value for the duration of that function's execution.

Esentially when a function gets invoked, there's only one reference to 'this'.

## TL;DR

'This' is not a reference to the function itself, nor is it a reference to the function's lexical scope. It is a binding
that is made when a function is invoked, and what it references depends entirely by the call-site where the function is called.
	
	
	











































































