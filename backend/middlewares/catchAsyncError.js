// Middleware to catch errors in async functions and pass them to the error handler
export const catchAsyncError = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
};
