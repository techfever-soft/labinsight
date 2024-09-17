/**
 * This class has methods without JSDoc comments.
 */
class TestClass {
    /**
     * This method has a JSDoc comment.
     */
    methodWithComment() {
        console.log('This method has a comment.');
    }

    methodWithoutComment() {
        console.log('This method is missing a JSDoc comment.');
    }

    /**
     * Another method with a JSDoc comment.
     */
    anotherMethodWithComment() {
        console.log('This method also has a comment.');
    }

    methodWithoutCommentAgain() {
        console.log('Another method missing a JSDoc comment.');
    }
}

const instance = new TestClass();
instance.methodWithComment();
instance.methodWithoutComment();
instance.anotherMethodWithComment();
instance.methodWithoutCommentAgain();
