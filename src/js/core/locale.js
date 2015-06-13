var strings = {}

exports.lang = {

    /**
     * Push language strings to the list
     * @param Object strings Translated string in JSON format.
     */

    push: function (strings) {
        UI.$.extend(this.strings, strings)
    },

    /**
     * Retrieves the specified language string
     * @param String string String to look for.
     * @return String Translated string or the input string if it wasn't found.
     */

    get: function (string) {
        return this.strings[string] || string
    },

    /**
     * Pseudo sprintf implementation - simple way to replace tokens with specified values.
     * @param String str String with tokens
     * @return String String with replaced tokens
     */

    sprintf: function (str) {
        var args = [].slice.call(arguments, 1)

        str = this.get(str)

        return str.replace(/%[a-z]/g, function () {
            var value = args.shift()
            return _.typeOf(value) !== 'undefined' ? value : ''
        })
    }

}