<script>

    var _ = require('../../util')
    var UI = require('uikit')

    module.exports = {

        inherit: true,
        replace: true,

        computed: {

            order: function() {

                var order = [this.orderKey]

                if (this.reversed[this.orderKey]) {
                    order.push('_reversed')
                }

                return order

            }

        },

        created: function() {

            this.$set('currentPage', this.currentPage - 1)
            this.fetchData()

        },

        methods: {

            fetchData: function(params) {

                var vm = this

                params = _.extend({

                    offset: this.currentPage * this.itemsPerPage,
                    limit:  this.itemsPerPage,
                    order:  this.order

                }, (params || {}))

                this.$http.get('/items', params).done(function(response) {

                    this.columns = response.columns
                    this.items   = response.items
                    this.total   = response.total
                    this.count   = response.count
                    this.offset  = response.offset

                    // initialize reverse ordering state
                    UI.$.each(this.columns, function ($key, col) {
                        vm.reversed.$add($key, false)
                    })

                    // execute possible callback
                    if (_.isFunction(this.onLoadPage)) {
                        this.onLoadPage()
                    }

                })

            },

            changePage: function(index) {

                this.currentPage = index
                this.fetchData()

            },

            sortBy: function (key) {

                if (key) {
                    this.reversed[key] = !this.reversed[key]
                    this.fetchData()
                }

            }

        },

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

    <pagination v-if="items.length > 1" items="{{ total }}" items-on-page="{{ itemsPerPage }}" on-select-page="{{ changePage }}"></pagination>

</template>