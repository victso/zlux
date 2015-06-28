<script>

    var helper = require('../helper.js');
    var $ = require("jquery");

    module.exports = {

        props: ['root', 'on-select-page'],

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
                return this.root + '/' + this.basename;
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

<template>

    <td v-if="type == 'folder'">

        <a href="#" v-on="click: selectPage">{{ basename | title }}</a>

    </td>

    <td v-if="type == 'file'">

        {{ basename | title }}

    </td>

    <td>

        {{ size | parseSize }}

    </td>

</template>
