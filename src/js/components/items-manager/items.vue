<script>

    var UI = require('uikit')

    module.exports = {

        inherit: true,
        replace: true,

        components: {

            item: require('./item.vue')

        }

    }

</script>

<template>

    <table class="uk-table">

        <thead>
            <tr>
                <th v-repeat="col: columns">

                    <span v-class="zx-sortable: col.orderKey" v-on="click: sortBy(col.orderKey)">

                        {{ col.name | capitalize }}

                        <i v-show="orderKey == col.orderKey"
                            v-class="reversed[col.orderKey] ? 'uk-icon-caret-up' : 'uk-icon-caret-down'">
                        </i>

                    </span>

                </th>
            <tr>
        </thead>

        <tbody>

            <tr v-component="item" v-repeat="items" track-by="id" on-select="{{ onSelectItem }}" columns="{{ columns }}"></tr>

        </tbody>

    </table>

</template>