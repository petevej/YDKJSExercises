# You Don't Know JS: This & Object Prototypes

# Chapter 2: this All Makes Sense Now!

** this is based entirely on the function's call-site **

## Call-site

A Call-site is the location in the code where the function gets called (as opposed to declared). 'This' can sometimes be obsured by coding patterns.

A Call-stack is the stack of functions that have been called to get us to the current moment in execution.

```js
function baz() {
		// call-stack is: 'baz'
		// call-site is global scope

		console.log( "baz" );
		bar();	// <-- call-site for 'bar'
}

function bar() {
		// call-stack is: 'baz' -> 'bar'
		// so, our call-site is in 'baz'

		console.log( "bar" );
		foo();	// <-- call-site for 'foo'
}

function foo() {
		// call-stack is: 'baz' -> 'bar' -> 'foo'
		// call-site is in 'bar'

		console.log("foo");
}

baz();	// <-- call-site is in the global scope
```
*Note:* To see the real call-site, enter the "debugger;" statement on the first line of the desired function, it will pause at this locatoin and will show you the call-stack.
```js
 function baz() {
		// call-stack is: 'baz'
		// call-site is global scope

		console.log( "baz" );
		bar();	// <-- call-site for 'bar'
}

function bar() {
		// call-stack is: 'baz' -> 'bar'
		// so, our call-site is in 'baz'

		console.log( "bar" );
		foo();	// <-- call-site for 'foo'
}

function foo() {
		// call-stack is: 'baz' -> 'bar' -> 'foo'
		// call-site is in 'bar'
		debugger;	// <-- debugger inserted!
		console.log("foo");
}

baz();	// <-- call-site is in the global scope
```
## Nothing But Rules

So how does the call-site determine where to point 'this'? This depends on the 4 rules.

### 1. Default Binding

This is the default catch-all rule if no others apply. It applies to standablone function invocation.
```js
function foo() {
		console.log( this.a );	// this points to a global variable a as it applies the default binding
}

var a = 2;		// this is global variable/global object-properties

foo(); 	// 2
```
Looking at the call-site, foo() is a plain function reference, therefore no other rules will apply -> default binding.
However, in 'strict mode', default binding cannot be applied to the global object so 'this' -> 'undefined'.

```js
function foo() {
		"use strict";

		console.log( this.a );
}

var a = 2;

foo();		// TypeError: 'this' is 'undefined'
```
*Note:* Mixing 'strict mode' and non-'strict mode' in the same codes is generally frowned upon.

### 2. Implicit Binding

Sometimes a function is declared and gets used as a property of an object. This is called the 'obj' *owns/contains* the *function reference*.

```js
function foo() {
		console.log( this.a );
}

var obj = {
		a: 2,
		foo: foo
};

obj.foo();	// 2 <-- at the point where 'foo()' is called, it is preceded by an 'obj' object reference
```
When there is a context object for a function reference, the *implicit binding* rule states that it's that object = 'this'.
In this particular case 'this.a' == 'obj.a'.

However, only the adjacent object property reference matters to the call-site. Example:
```js
function foo() {
		console.log( this.a );
}

var obj2 = {
		a: 42,
		foo: foo
};

var obj1 = {
		a: 2,
		obj2: obj2
};

obj1.obj2.foo();	// 42
```

Implicit binding can get overridden by the global object if defined and can be 'undefined' in 'strict mode'
```js
function foo() {
		console.log( this.a );
}

var obj = {
		a: 2,
		foo: foo
};

var bar = obj.foo;	// function reference

var a = "oops, global";	// 'a' global variable overrides the implicit binding

bar();	// instead of outputting 2, you get "oops, global"
```
The call-site here is 'bar()' - plain function call - default binding applies. To get the value '2', we need to call
obj.foo();'

```js
function foo() {
		console.log( this.a );
}

function doFoo(fn) {
		fn();	// <-- this is the call-site!
}

var obj = {
		a: 2,
		foo: foo
};

var a = "oops, global";	// 'a' is also a global object property

doFoo( obj.foo );	// "oops, global"
```
The call-site here is 'fn()', a function is just being passed - using implicit binding. Therefore the global object 'a' overrides again.
If we use 'strict mode' the result will be 'undefined'

This does not happen only with user-defined function but also built-in functions
```js
funciton foo() {
		console.log( this.a );
}

var obj = {
		a: 2,
		foo: foo
};

var a = "oops, global";	// 'a' also property on global object
setTimeout( obj.foo, 100 );	// "oops, global"

function setTimeout(fn, delay) {
		// wait (somehow) for 'delay' milliseconds
		fn();	// <-- call-site!
}
```
JavaScript likes to force the function callback to have a this which may point to the DOM element that triggered the event. We'll see how to control this unexpected behaviors!

### 3. Explicit Binding

Functions in JavaScript have 'call(..)' and 'apply(..)' methods, both of which can be used for binding 'this' to a particular object.
```js
function foo() {
		console.log( this.a );
}

var obj = {
		a: 2
};

foo.call( obj );	// 2
```
Here 'foo.call(..)' is explicitly binding 'this' to 'obj'. For this purpose 'call(..)' and 'apply(..)' can be used interchangeably.

Unfortunately, explicit binding alone doesn't help fix the loss of 'this' binding.

The solution is **Hard Binding**

**Hard Binding**

This is a variation of explicit binding.

```js
function foo() {
		console.log( this.a );
}

var obj = {
		a: 2
};

var bar = function() {
		foo.call( obj );
};

bar();	// 2
setTimeout( bar, 100 ); // 2

// 'bar' hard binds 'foo''s 'this' to 'obj'
// so that it cannot be overridden
bar.call( window ); // 2
```
By forcing the explicit binding of 'this' to 'obj' in the 'bar()' function, no matter how it is invoked, it will always manually invoke 'foo' with 'obj'. This is explicit and strong.

Hard binding is built into the utility since ES5: 'Function.prototype.bind':
```js
function foo(something) {
		console.log( this.a, something );
		return this.a + something;
}

var obj = {
		a: 2
};

var bar = foo.bind( obj );

var b = bar( 3 );	// 2 3
console.log( b ); // 5
```
**API Call "Contexts"**
Many new built-in functions allow the use of "context" which replaces the need for 'bind(..)' to ensure the callback uses a particular 'this'.
```js
function foo(el) {
		console.log( el, this.id );
}

var obj = {
		id: "awesome"
};

// use 'obj' as 'this' for 'foo(..)' calls
[1, 2, 3].forEach( foo, obj );  // 1 awesome 2 awesome 3 awesome
```
Internally these custom functions use 'call(..)' or 'apply(..)' to achieve explicit binding.

### 4. 'new' Binding

A constructor call is a function call with 'new' in front. The following steps happen automatically:

1. a brand new object is created out of thin air
2. the newly constructed object is '[[Prototype]]'-linked
3. that object is then set as the 'this' binding for that function call
4. unless the function returns its own alternate **object**, the new-invoked function call with *automatically* return the newly constructed object.

Example:
```js
function foo(a) {
			this.a = a;
}

var bar = new foo( 2 );
console.log( bar.a );  // 2
```
By calling 'foo(..)' with a constructor call, we've created a new object and set it as the 'this' for the call of 'foo(..)'. This is called 'new' binding.

## Everything In Order

'new' Binding > 'Explicit' Binding > 'Implicit' Binding > 'Default' Binding

**'Explicit' Binding > 'Implicit' Binding**
```js
function foo() {
		console.log( this.a );
}

var obj1 = {
		a: 2,
		foo: foo
};

var obj2 = {
		a: 3,
		foo: foo
};

obj1.foo();		// 2 <- Implicit Binding
obj2.foo(); 	// 3 <- Implicit Binding

obj1.foo.call( obj2 )	// 3 <- Explicit/Hard Binding overriding Implicit Binding
obj2.foo.call( obj1 )	// 2 <- Explicit/Hard Binding overriding Implicit Binding
```

**'new' Binding > 'Implicit' Binding**
```js
function foo(something) {
	this.a = something;
}

var obj1 = {
	foo: foo
};

var obj2 = {};

obj1.foo( 2 );		// Implicit Binding
console.log( obj1.a );	// Property 'a' of 'obj1' now holds the value of '2'

obj1.foo.call( obj2, 3 );	// Explicit Binding
console.log( obj2.a );		// 3

var bar = new obj1.foo( 4 );	// 'new' Binding
console.log( obj1.a );		// 2	<-- implicit binding still holds 
console.log( bar.a );		// 4	<-- bar makes a whole new object that overrides implicit binding
```

**'new' Binding > 'Explicit' Binding**
```js
function foo(something) {
	this.a = something;
}

var obj1 = {}'

var bar = foo.bind( obj1 );
bar( 2 );
console.log( obj1.a );	// 2

var baz = new bar( 3 );
console.log( obj1.a );	// 2
console.log( baz.a );	// 3
```
## Determining 'this'

This is the order of precedence for determining 'this' from a function call's call-site:

1. Is 'new' being used to construct **new binding**? If so, then 'this' is the newly constructed object.
'var bar = new foo()'	// this === 'foo()'

2. Is the function called with 'call' or 'apply'  (**explicit binding**) or 'bind' being used (**hard binding**)? If so, this is the explicitly specified object.
'var bar = foo.call( obj2 )'	// this === 'obj2'

3. Is the function called with a context (**implicit binding**)? If so, 'this' is that context object.
'var bar = obj1.foo()'	// this === 'obj1'

4. Otherwise, default 'this' (**default binding**). If in 'strict mode', it points to 'undefined', otherwise it points to a 'Global Varialbe' or 'Window' object
'var bar = foo()'

## Binding Exceptions

### Ignored 'this'

Passing 'null' or 'undefined' as a 'this' binding parameter to 'call', 'apply', or 'bind' will cause those values to be ignored.

Instead the *default binding* rule will kick in.
```js
function foo() {
	console.log( this.a );
}

var a = 2;	// declaration in global scope
a = 3;		// value update

foo.call( null );	// 3	<-- default binding
```
An alternative to passing a null object is to use 'Object.create(null)'
```js
function foo() {
	console.log( this.a );
}

var a = 2;	// declaration in global scope
a = 3;		// value update

var o = Object.create( null );	// create a totally empty object

foo.call( o );	// undefined	<-- explicit binding
```
### Indirection

When function reference gets invoked, the *default binding* rule applies!
```js
function foo() {
	console.log( this.a );
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4};

o.foo();	// 3	<-- defaults to global variable 'o'
(p.foo = o.foo)();	// 2	<-- effective call-site is in 'foo()' and it points to global variable 'a'
```
### Soft Binding

If 'this' points to 'global' or 'undefined', then re-direct it to an alternate default 'obj' instead.
```js
function foo() {
	console.log("name: " + this.name);
}

var obj = { name: "obj" },
	obj2 = { name: "obj2" },
	obj3 = { name: "obj3" };
	
var fooOBJ = foo.softBind( obj );

fooOBJ();	// name: obj

obj2.foo = foo.softBind(obj);
obj2.foo();	// name: obj2 <----- look!!

fooOBJ.call( obj3 );	// name: obj3 <--- look!!

setTimeout( obj2.foo, 10);	// name: obj <--- falls back to soft-binding
```
## Lexical 'this'

Arrow-functions don't comply with the four standard 'this' rules, instead it adopts 'this' binding from the enclosing scope.
```js
function foo() {
	setTimeout(() => {
		// 'this' here is lexically adopted from 'foo()'
		console.log( this.a );
	), 100);
}

var obj = {
	a: 2
};

foo.call( obj );	// 2 <--- here 'this' is the global object 'obj'
```
Bottom line is, you should choose between adopting these two styles while writing codes:

1. Use only lexical scope and forget 'this'-style code
2. Use only 'this'-style code completely, including the use of 'bind(..)' where necessary, try to avoid 'self = this' and arrow function "lexical this".

## TL;DR

Determining which 'this' buinding rule applies requires you to go to the call-site and then applying these 4 rules:

1. Called with 'new'? Use the newly constructed object.
2. Called with 'call' or 'apply' (or 'bind')? Use the specified object.
3. Called with a context object owning the call? Use that context object.
4. Default: 'undefined' in 'strict mode', global object otherwise.

To avoid accidentally invoking *default binding* when passing a null object, create o = Object.create(null) to be passed instead - avoid side effects!

The ES6's arrow-function use lexical scoping for 'this' binding.



	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	











































































