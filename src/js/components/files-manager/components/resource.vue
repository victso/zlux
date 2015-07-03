<template>

        <td>
            <a v-if="type == 'folder'" href="#" v-on="click: selectPage">{{ basename | title }}</a>
            <template v-if="type == 'file'">{{ basename | title }}</template>
        </td>

        <td>{{ size | parseSize }}</td>

</template>

<script>

    var helper = require('../helper.js');

    module.exports = {

        props: ['$data', 'root', 'on-select-page'],

        data: function() {

            return {
                basename    : '',
                content_type: '',
                ext         : '',
                name        : '',
                size        : ''
            }

        },

        computed: {

            path: function() {
                return  '/' + this.basename;
            },

            type: function() {
                return this.basename.match(/\/$/) ? 'folder' : 'file';
            }

        },

        filters: {

            title: function(value) {

                return value

                    // remove extension
                    .replace(/(\/|\.\w+$)/g, '')

                    // remove dash/underscore
                    .replace(/(-|_)/g, ' ');

            },

            parseSize: function(size) {

                if ( ! size) {
                    return size;
                }

                return helper.filesize( helper.parseSize(size) );

            }

        },

        methods: {

            selectPage: function(e) {

                e.preventDefault();
                this.onSelectPage(this.path);

            }

        }

    }

</script>
