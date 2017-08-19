# You Don't Know JS: Scope & Closures
# Chapter 3: Function vs. Block Scope

```js
function foo(a) {
	var b = a;
	return a + b;
}

var c = foo( 2 );
```

Engine: Yo, scope, I have a LHS reference for c, ever heard of it?

Scope: Bro, nah this is the first time, let me declare it.

Engine: Thanks. Hey Scope, I have a RHS reference for foo. Ever heard of it?

Scope: Yeaaaah. Compiler just declared it a moment ago.

Engine: Scope, I have a RHS reference to a, have you heard of it?

Scope: Sure, here you go!

Engine: Cool beans. Scope, I have a LHS reference for b. Ever heard of it?

Scope: Bro, nah this is the first time, let me declare it.

Engine: Thanks. Passing the value of a which is 2 (LHS implicit param assignment)  to variable b.

*Note that when RHS look-up fails to find a variable anywhere in the nested Scopes, the Engine will throw a ReferenceError. In contrast, if Engine is performing a LHS look-up and worked up to the Global Scope without finding it, if the program is not running in Strict Mode, then the global Scope will create a new variable of that name and hand it back to Engine.*

**RHS = Pull (retrieve value)**

**LHS = Push (assign value)**

If a variable is found for a RHS look-up but you try to execute an impossible operation with it, then the Engine will throw a TypeError.

**Lexical scope** = scope that is defined by author-time decisions where functions are declared. It is created by the process of lexing, allowing prediction of how identifiers will be looked-up during execution

**eval(..)** = [cheat that will kill your speed] allows modification of existing lexical scope by evaluating a string of code which has one or more declarations in it.

with = creates a whole new lexical scope by treating an object reference as a "scope" and that object's properties as scoped identifiers.

**eval(..) and with are BAD**

## Principle of Least Privilege

You should expose only what is minimally necessary, and "hide" everything else

*Good example:*

```js
function doSomething(a) {
	function doSomethingElse(a) {
		return a - 1;
	}
	var b;

	b = a + doSomethingElse( a * 2 );
	console.log( b * 3 );
}

doSomething( 2 ); // 15
```

*Bad example:*

```js
function doSomething(a) {
	b = a + doSomethingElse( a * 2 );
	console.log( b * 3 );
}

function doSomethingElse(a) {
	return a - 1;
}

var b;

doSomething( 2 ); // 15
```

## Function Declaration vs Function Expression

If "function" leads the statement, it's a declaration, otherwise it's an expression

Example of function expression:

```js
var a = 2;

(function foo() {
	var a = 3;
	console.log( a ); // 3
})();

console.log( a ); // 2
```

Hiding the identifier "foo" inside the scope of the function expression avoids polluting enclosing scope unnecessarily

## Anonymous vs. Named

Leaving the function anonymous presents several risks: (difficult to debug, recursion not possible, difficult to understand code).

It is often better to use inline function expressions e.g.

```js
setTimeout( function timeoutHandler(){ // <-- Look, I have a name!
	console.log( "I waited 1 second!" );
}, 1000 );
```

## Invoking Function Expressions Immediately

The first pair of () wraps around a function, making it an expression, the second pair of () executes the function:

```js
var a = 2;

(function foo() {

	var a = 3;
	console.log( a ); // 3
})();

console.log( a ); // 2
```

## IIFE - Immediately Invoked Function Expression

```js
var a = 2;
(function IIFE(){

	var a = 3;
	console.log( a ); // 3
})();

console.log( a ); //2
```

## Blocks As Scopes - Principle of Least Exposure

It's all bout declaring variables as close as possbile, as local as possible, to where they will be used. e.g.:

for (var i=0; i<10; i++) {   // i is declared right in the for loop head, only to be used there
	console.log( i );
}

## The Rise of let

ES6 introduces a new keyword to allow variable declaration alongside var. It attaches the variable declaration to the scope of the enclosing block {..}. This allows for explicit block-scoping style:

```js
var foo = true;

if (foo) {
	{ // <-- explicit block
		let bar = foo * 2;
		bar = something( bar );
		console.log( bar );
	}
}

console.log( bar ); // ReferenceError
```

The main benefit of block-scoping is that it makes refactoring a lot easier when you have to move certain blocks around

let also allows garbage collection for the case where a large momemory-heavy data needs to be garbage collected, e.g.:

```js
function process(data) {
	// do something interesting
}
// anthing declared inside this block can go away after!
{
	let someReallyBigData = {...};

	process( someReallyBigData );
}
var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt) {
	console.log("button clicked");
}, /*capturingPhase=*/false );
```

**let** is also great for the for loop as it re-binds the counter (e.g. i) to each iteration of the loop.

```js
for (let i=0; i<10; i++) {
	console.log( i );
}
console.log( i ); // ReferenceError as i is not defined in the outer scope
```

runs like this:

```js
{
	let j;
	for (j=0; j<10; j++) {
		let i = j;  // re-bound for each iteration!
		console.log( i );
	}
}
```

*Caution: block-scoping with let can be dangerous when a nested block is dependent upon that variable and it gets refactored outside later, e.g.:*

```js
var foo = true, baz = 10;

if (foo) {
	let bar = 3;
	if (baz > bar) {  // <-- don't forget 'bar' when moving!
		console.log( baz );
	}
}
// bar needs to be declared again outside!
```

## New addition of const in ES6

const also creates a fixed block-scoped variable, any attempt to overwrite it will throw an error

```js
var foo = true;

if (foo) {
	var a = 2;
	const b = 3;  // block-scoped ot the containing 'if'

	a = 3;  // just fine!
	b = 4; // this will throw an error!
}

console.log( a ); // 3
console.log( b ); // ReferenceError!
```

```js
function foo(a) {
	var b = a;
	return a + b;
}

var c = foo( 2 );
```

Engine: Yo, scope, I have a LHS reference for c, ever heard of it?

Scope: Bro, nah this is the first time, let me declare it.

Engine: Thanks. Hey Scope, I have a RHS reference for foo. Ever heard of it?

Scope: Yeaaaah. Compiler just declared it a moment ago.

Engine: Scope, I have a RHS reference to a, have you heard of it?

Scope: Sure, here you go!

Engine: Cool beans. Scope, I have a LHS reference for b. Ever heard of it?

Scope: Bro, nah this is the first time, let me declare it.

Engine: Thanks. Passing the value of a which is 2 (LHS implicit param assignment)  to variable b.

*Note that when RHS look-up fails to find a variable anywhere in the nested Scopes, the Engine will throw a ReferenceError. In contrast, if Engine is performing a LHS look-up and worked up to the Global Scope without finding it, if the program is not running in Strict Mode, then the global Scope will create a new variable of that name and hand it back to Engine.*

**RHS = Pull (retrieve value)**

**LHS = Push (assign value)**

If a variable is found for a RHS look-up but you try to execute an impossible operation with it, then the Engine will throw a TypeError.

**Lexical scope** = scope that is defined by author-time decisions where functions are declared. It is created by the process of lexing, allowing prediction of how identifiers will be looked-up during execution

**eval(..)** = [cheat that will kill your speed] allows modification of existing lexical scope by evaluating a string of code which has one or more declarations in it.

with = creates a whole new lexical scope by treating an object reference as a "scope" and that object's properties as scoped identifiers.

**eval(..) and with are BAD**

## Principle of Least Privilege

You should expose only what is minimally necessary, and "hide" everything else

*Good example:*

```js
function doSomething(a) {
	function doSomethingElse(a) {
		return a - 1;
	}
	var b;

	b = a + doSomethingElse( a * 2 );
	console.log( b * 3 );
}

doSomething( 2 ); // 15
```

*Bad example:*

```js
function doSomething(a) {
	b = a + doSomethingElse( a * 2 );
	console.log( b * 3 );
}

function doSomethingElse(a) {
	return a - 1;
}

var b;

doSomething( 2 ); // 15
```

## Function Declaration vs Function Expression

If "function" leads the statement, it's a declaration, otherwise it's an expression

Example of function expression:

```js
var a = 2;

(function foo() {
	var a = 3;
	console.log( a ); // 3
})();

console.log( a ); // 2
```

Hiding the identifier "foo" inside the scope of the function expression avoids polluting enclosing scope unnecessarily

## Anonymous vs. Named

Leaving the function anonymous presents several risks: (difficult to debug, recursion not possible, difficult to understand code).

It is often better to use inline function expressions e.g.

```js
setTimeout( function timeoutHandler(){ // <-- Look, I have a name!
	console.log( "I waited 1 second!" );
}, 1000 );
```

## Invoking Function Expressions Immediately

The first pair of () wraps around a function, making it an expression, the second pair of () executes the function:

```js
var a = 2;

(function foo() {

	var a = 3;
	console.log( a ); // 3
})();

console.log( a ); // 2
```

## IIFE - Immediately Invoked Function Expression

```js
var a = 2;
(function IIFE(){

	var a = 3;
	console.log( a ); // 3
})();

console.log( a ); //2
```

## Blocks As Scopes - Principle of Least Exposure

It's all bout declaring variables as close as possbile, as local as possible, to where they will be used. e.g.:

for (var i=0; i<10; i++) {   // i is declared right in the for loop head, only to be used there
	console.log( i );
}

## The Rise of let

ES6 introduces a new keyword to allow variable declaration alongside var. It attaches the variable declaration to the scope of the enclosing block {..}. This allows for explicit block-scoping style:

```js
var foo = true;

if (foo) {
	{ // <-- explicit block
		let bar = foo * 2;
		bar = something( bar );
		console.log( bar );
	}
}

console.log( bar ); // ReferenceError
```

The main benefit of block-scoping is that it makes refactoring a lot easier when you have to move certain blocks around

let also allows garbage collection for the case where a large momemory-heavy data needs to be garbage collected, e.g.:

```js
function process(data) {
	// do something interesting
}
// anthing declared inside this block can go away after!
{
	let someReallyBigData = {...};

	process( someReallyBigData );
}
var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt) {
	console.log("button clicked");
}, /*capturingPhase=*/false );
```

**let** is also great for the for loop as it re-binds the counter (e.g. i) to each iteration of the loop.

```js
for (let i=0; i<10; i++) {
	console.log( i );
}
console.log( i ); // ReferenceError as i is not defined in the outer scope
```

runs like this:

```js
{
	let j;
	for (j=0; j<10; j++) {
		let i = j;  // re-bound for each iteration!
		console.log( i );
	}
}
```

*Caution: block-scoping with let can be dangerous when a nested block is dependent upon that variable and it gets refactored outside later, e.g.:*

```js
var foo = true, baz = 10;

if (foo) {
	let bar = 3;
	if (baz > bar) {  // <-- don't forget 'bar' when moving!
		console.log( baz );
	}
}
// bar needs to be declared again outside!
```

## New addition of const in ES6

const also creates a fixed block-scoped variable, any attempt to overwrite it will throw an error

```js
var foo = true;

if (foo) {
	var a = 2;
	const b = 3;  // block-scoped ot the containing 'if'

	a = 3;  // just fine!
	b = 4; // this will throw an error!
}

console.log( a ); // 3
console.log( b ); // ReferenceError!
```
# Chapter 4: Hoisting

## The Compiler Strikes Again

The best way to think about which comes first is that all declarations, both variables and functions, are processed first, before any part of your code is executed.

Essentially variable and function declarations are "hoisted" to the top of the code.

However, it is only the declaration that gets hoisted, and not the value assignment or any other executable logic.

Example:
```js
console.log( a );

var a = 2;
```
is processed like:
```js
var a;
```
```js
console.log( a );  // undefined
a = 2;
```
** the egg (declaration) comes before the chicken (assignment). **

Hoisting is per-scope, the declaration will only be hoisted to the top of a particular scope it's in.

Expressions are not hoisted, only the declaration. e.g.:
```js
foo(); // not ReferenceError, but TypeError!

var foo = function bar() {
		// ...
};
```
is interpreted as:
```js
var foo;
foo();

foo = function bar() {
	//...
};
```
## Functions First

Functions are hoisted first, then variables.
```js
foo(); // 1

var foo;

function foo() {
		console.log( 1 );
};

foo = function() {
		console.log( 2 );
};
```
is interpreted by the Engine as:
```js
function foo() {
		console.log( 1 );
};

foo(); // 1

foo = function() {
		console.log( 2 );
};
```
## Review (TL;DR)

A simple ```var a = 2;``` may look like one statement but the JavaScript Engine actually interprets it as ```var a;``` and ```a = 2```, two separate statements.

Declarations in a scope, regardless of their location, will always be processed first - effectively "hoisted" to the top!

!Only Declarations are hoisted, not the assignments!

# Chapter 5: Scope Closure

Definition: Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.

Below, function bar() has access to variable a in the outer scope because of lexical scope look-up rules (RHS-pull):

```js
function foo() {
		var a = 2;

		function bar() {
				console.log( a ); //2
		}

		bar();
}

foo();
```
Here, bar() closes over the scope of foo() as it is nested inside of foo().
```js
function foo() {
		var a = 2;

		function bar() {
				console.log( a );
		}

		return bar;
}
var baz = foo();

baz(); // 2 -- Whoa, closure was just observed, man!
```
bar() has a lexical scope closure over that inner scope of foo(), which keeps that scope alive for bar() to reference at any later time.

Here bar() still has reference to that scope - that reference = closure

Whatever facility we use to transport an inner function outside of its lexical scope, it will maintain a scope reference to where it was originally declared, and wherever we execute it, that closure will be exercised. It's like the love between mother and child that never really gets cut even though a child is somewhere far away.

This is not considered closure because the function (child) is being invoked right there in the same scope (mother) as it was declared.
```js
var a = 2;

(function IIFE() {
		console.log( a );
})();
```
Use case of closure, adding new scope at each iteration of the for loop by assigning a new variable:
```js
for ( var i=1; i<=5; i++){
		(function(j){
			setTimeout( function timer(){
				console.log( j );
			}), j*1000);
	})( i );		// the IIFE is being invoked with i as input
}
```
An alternative to this would be a much easier "let" declaration as it hijacks a block and declares a new variable every times:
```js
for (var i=1; i<=5; i++) {
		let j = i;  // yay, block-scope for closure!
		setTimeout( function timer() {
				console.log( j );
		}), j*1000 );
}
```
or an even shorter version where let can be used right there in the head of for loop!
```js
for (let i=1; i<=5; i++) {
		setTimeout( function timer() {
					console.log( i );
		}, i*1000);
}
```
**FEEL THE POWER OF BLOCK-SCOPING AND CLOSURE WORKING TOGETHER!***

## Modules
