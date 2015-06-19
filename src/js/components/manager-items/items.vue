<script>

    var UI = require('uikit')
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
                order: ['_itemname'],
                // filterKey: '',
                reversed: {}
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

                })

            },

            changePage: function(index) {

                this.currentPage = index
                this.fetchData()

            },

            sortBy: function (key) {

                this.order = []
                this.reversed[key] = !this.reversed[key]

                this.order.push(key)

                if (this.reversed[key]) {
                    this.order.push('_reversed')
                }

                this.fetchData()

            }

        }

    }

</script>

<template>

    <table class="uk-table">
        <thead>

            <tr>
                <th v-repeat="col: columns" v-on="click: sortBy(col.name)">

                    {{ col.title | capitalize }}

                    <i v-show="sortKey == col.name" class="uk-icon"
                        v-class="reversed[col.name] ? 'uk-icon-caret-up' : 'uk-icon-caret-down'">
                    </i>

                </th>
            <tr>

        </thead>
        <tbody>

            <tr v-repeat="entry: items">

                <td v-repeat="col: columns">

                    {{ entry[col.name] }}

                </td>

            </tr>

        </tbody>
    </table>

    <zx-pagination v-if="items.length > 1" items="{{ total }}" items-on-page="{{ itemsPerPage }}" on-select-page="{{ changePage }}"></zx-pagination>

</template>