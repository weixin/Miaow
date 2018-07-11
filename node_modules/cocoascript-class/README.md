# cocoascript-class
Lets you create real ObjC classes in cocoascript so you can implement delegates, subclass builtin types, etc

## Installation

In your plugin, assuming you're already using an ES6 build toolchain and either `npm` or `yarn`

`npm install --save cocoascript-class` or `yarn add cocoascript-class`


## Usage

Here is an example class created with this:

````js
const MyClass = new ObjCClass({
  // String values create ivar
  _private: 'initial',
  
  // This is a method on the class.
  test() {
    log("test: " + this._private);
  },
});

// MyClass is now a real ObjC class as far as cocoascript is concerned:
const obj = MyClass.new();

// You can use setters for the ivars
obj._private = "efgh";

// And call methods
[obj test];
obj.test();

````

## Advanced


### Calling super


The `SuperCall` function will let you send a message to your superclass, equivalent to `[super myMethod]`. However, you need to tell it the types of the arguments to your function.

````js
SuperCall(sel, argumentTypes, returnType);
````

each argument or return type is just an object with `{type: encodedString}`, where encodedString is the [Objective-C type encoding](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtTypeEncodings.html) of that type, for example:

````
@encode(char*) = "*"
@encode(id) = "@" // any object can use this encoding
@encode(Class) = "#"
@encode(void*) = "^v"
@encode(CGRect) = "{CGRect={CGPoint=dd}{CGSize=dd}}"
@encode(SEL) = ":"
````

Here, we call `[super description]` in our class' description method:

````js

import ObjCClass, {SuperCall} from 'cocoascript-class';

const HasDescriptionClass = new ObjCClass({  
  description() {
    // You should cache the result of SuperCall function, don't look it up each time
    if (typeof MyClass._superDesc == 'undefined') {
      const sel = NSStringFromSelector('description');
      MyClass._superDesc = SuperCall(sel, [], {type:"@"});
    }
    const superDesc = MyClass._superDesc.call(this);
    return NSString.stringWithString(`${superDesc} { _private=${this._private} }`);
  }
});

// MyClass is now a real ObjC class as far as cocoascript is concerned:
const obj = HasDescriptionClass.new();
log(obj); // calls description to become a string
````


