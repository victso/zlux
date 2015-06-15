<script>

    var UI = require('uikit')
    var _ = require('../../util')

    module.exports = {

        inherit: true,
        replace: true,

        data: function() {

            return {
                data: [],
                limit: 20,
                total: null,
                totalFiltered: null,
                columns: [],
                order: [],
                // filterKey: '',
                reversed: {},
                currentPage: 1
            }

        },

        created: function() {

            this.fetchData()

        },

        methods: {

            fetchData: function(params) {

                params = _.extend({

                    offset: this.currentPage * this.limit,
                    limit:  this.limit,
                    order:  this.order

                }, (params || {}))

                this.$http.get('/items', params).done(function(response) {

                    this.columns        = response.gridColumns
                    this.data           = response.gridData
                    this.total          = response.gridTotal
                    this.totalFiltered  = response.gridFiltered

                    // initialize reverse ordering state
                    this.columns.forEach(function (col) {
                        this.reversed.$add(col.name, false)
                    }, this)

                })

            },

            changePage: function(page) {

                this.currentPage = page
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

            <tr v-repeat="entry: data">

                <td v-repeat="col: columns">

                    {{ entry[col.name] }}

                </td>

            </tr>

        </tbody>
    </table>

    <ul v-if="total" v-el="pagination" class="uk-pagination" v-uk-pagination="{items:total, itemsOnPage: totalFiltered, currentPage:currentPage}"></ul>

</template>