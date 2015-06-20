<script>

    var _ = require('../../util')

    module.exports = {

        inherit: true,
        replace: true,

        data: function() {

            return {

                id: '',
                active: false

            }

        },

        computed: {

            name: function() {

                return this.$data['_itemname']

            }

        },

        methods: {

            selectItem: function() {

                if (_.isFunction(this.onSelectItem)) {
                    this.onSelectItem(this)
                }

            }

        }

    }

</script>

<template>

    <tr v-on="click: selectItem" v-class="uk-active: active">

        <td v-repeat="columns">

            {{ $parent.$data[name] }}

        </td>

    </tr>

</template>