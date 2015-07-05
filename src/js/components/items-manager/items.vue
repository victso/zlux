<template>

    <table class="uk-table">
        <thead>
            <tr>
                <th v-repeat="col: columns">

                    <span v-class="zx-sortable: col.orderKey" v-on="click: sortBy(col.orderKey)">

                        {{ col.title | capitalize }}

                        <i v-show="orderKey == col.orderKey"
                            v-class="reversed[col.orderKey] ? 'uk-icon-caret-up' : 'uk-icon-caret-down'">
                        </i>

                    </span>

                </th>
            <tr>
        </thead>
        <tbody>

            <tr v-component="item" v-repeat="items" on-select="{{ itemSelected }}" columns="{{ columns }}"></tr>

        </tbody>
    </table>

</template>

<script>

    module.exports = {

        inherit: true,
        components: {
            item: require('./item.vue')
        }

    };

</script>
