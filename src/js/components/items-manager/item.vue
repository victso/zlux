<script>

    var _ = require('../../util')

    module.exports = {

        replace: true,

        props: ['on-select', 'columns'],

        data: function() {

            return {
                id      : '',
                name    : '',
                type    : '',
                access  : '',
                active  : -1,
                created : '',

                application: {
                    id   : '',
                    name : ''
                },
                author: {
                    id   : '',
                    name : ''
                }
            }

        },

        filters: {

            property: function(key) {

                return this.$parent.$data[key]

            }

        },

        methods: {

            selectItem: function() {

                if (_.isFunction(this.onSelect)) {
                    this.onSelect(this)
                }

            }

        }

    }

</script>

<template>

    <tr v-on="click: selectItem" v-class="uk-active: active">

        <td v-repeat="col: columns">

            {{ $key | property }}

        </td>

    </tr>

</template>