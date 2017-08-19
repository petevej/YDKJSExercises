# You Don't Know JS: This & Object Prototypes

# Chapter 4: Mixing (Up) "Class" Objects

Classes mean copies

JavaScript does not copy and has no actual "Class"

Don't use Mixins

# Chapter 5: *this* & Object Prototypes

When you try to find a missing property of an object, the '[[Get]]' function will attempt to climb the '[[Prototype]]' tree. This link is called the "prototype chain"

At the very top of the prototype chain is the built-in 'Object.prototype' (similar to the global scope concept in the scope lookup). Common utilities e.g. 'toString()', 'valueOf()' exist in the 'Object.prototype' object.

'new' constructor function call is the common way to create object links

'Object.create' is actually an ES5's solution to creating a better prototype links that creates the prototype link to the new object without the side effects of '.constructor' reference
```js
var foo ={
    something: function() {
        console.log( "Tell me something good..." );
    }
};

var bar = Object.create( foo );   // creates a new object 'bar' linked to 'foo' without messing with .constructor references
bar.something();    // Tell me something good...
```

In JavaScript, no actual copies of objects are made, rather only links are created. These links are called **delegation links** which is denoted with an arrow pointing back to the prototype objects
