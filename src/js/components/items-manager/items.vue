<script>

    var _ = require('../../util')

    module.exports = {

        inherit: true,
        replace: true,

        data: function() {

            return {
                items: [],
                itemsPerPage: 10,
                currentPage: 1,
                total: 0,
                count: 0,
                offset: 0,
                columns: [],
                orderKey: '_itemname',
                reversed: {}
            }

        },

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
                    this.columns.forEach(function (col) {
                        this.reversed.$add(col.name, false)
                    }, this)

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

                this.reversed[key] = !this.reversed[key]
                this.fetchData()

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

                    <span v-on="click: sortBy(col.name)">

                        {{ col.title | capitalize }}

                        <i v-show="orderKey == col.name"
                            v-class="reversed[col.name] ? 'uk-icon-caret-up' : 'uk-icon-caret-down'">
                        </i>

                    </span>

                </th>
            <tr>
        </thead>

        <tbody>

            <tr v-component="item" v-repeat="items" track-by="id"></tr>

        </tbody>

    </table>

    <pagination v-if="items.length > 1" items="{{ total }}" items-on-page="{{ itemsPerPage }}" on-select-page="{{ changePage }}"></pagination>

</template>