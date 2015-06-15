<script>

    var helper = require('./helper.js');

    module.exports = {

        data: function() {

            return {

                type: '',
                path: '',
                size: null

            }

        },

        created: function() {

            // set object type
            this.type = this.path.match(/\/$/) ? 'folder' : 'file';

        },

        filters: {

            basename: function(path) {

                return helper.basename(path)

                    // remove extension
                    .replace(/(\.\w+$)/g, '')

                    // remove dash/underscore
                    .replace(/(-|_)/g, ' ')

            },

            parseSize: function(size) {

                if ( ! size) return size;

                return helper.filesize( helper.parseSize(size) );

            }

        },

        directives: {

            'set-type': {

                isLiteral: true,

                bind: function () {

                    if (this.expression == 'file') {

                        $(this.el).find('a').remove();
                        $(this.el).append(this.vm.$options.filters.basename(this.vm.path));

                    }

                }

            }

        }

    };

</script>

<template>

    <tr>

        <td v-set-type="{{ type }}">

            <a href="#" v-on="click: $parent.goTo(path)">{{ path | basename }}</a>

        </td>

        <td>

            {{ size | parseSize }}

        </td>

    </tr>

</template>