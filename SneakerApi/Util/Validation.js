class Validation extends Object {
    constructor(props) {
        super(props);
    }
    static isEmptyObject (obj)  {
        if(!obj){
            return false
        }
        return Object.keys(obj).length !== 0 && obj.constructor === Object
    };
    static isObject(obj) {
        if (obj === null) { return false;}
        return ( (typeof obj === 'function') || (typeof obj === 'object') );
    }

}

module.exports = Validation