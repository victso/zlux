<template>

    <tr>

        <td>
            <a v-if="type == 'folder'" href="#" v-on="click: goToFolder">{{ basename | title }}</a>
            <template v-if="type == 'file'">{{ basename | title }}</template>
        </td>

        <td>{{ size | parseSize }}</td>

    </tr>

</template>

<script>

    var helper = require('../helper.js');

    module.exports = {

        props: ['location', 'go-to'],

        data: function() {

            return {
                basename: '',
                content_type: '',
                ext:  '',
                name: '',
                size: ''
            }

        },

        computed: {

            type: function() {
                return this.basename.match(/\/$/) ? 'folder' : 'file';
            }

        },

        filters: {

            title: function(value) {

                return value
                    .replace(/(\/|\.\w+$)/g, '') // remove extension
                    .replace(/(-|_)/g, ' ');     // replace dash/underscore

            },

            parseSize: function(size) {

                if ( ! size) {
                    return size;
                }

                return helper.filesize( helper.parseSize(size) );

            }

        },

        methods: {

            goToFolder: function(e) {
                e.preventDefault();
                this.goTo(this.location + '/' + this.basename);
            }

        }

    }

</script>
