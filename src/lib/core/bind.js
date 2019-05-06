function bind(fn, context) {
    return function wf (){
        var args = new Array(arguments.length);
        for (var i = 0, l = args.length; i < l; i++) {
            args[i] = arguments[i]
        }
        return fn.apply(context, args)
    }
}

export default bind;
