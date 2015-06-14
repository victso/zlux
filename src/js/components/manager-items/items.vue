<script>

    var UI = require('uikit')
    var _ = require('../../util')

    module.exports = {

        inherit: true,

        data: function() {

            return {
                data: [],
                limit: 20,
                total: null,
                totalFiltered: null,
                columns: [],
                sortKey: '',
                // filterKey: '',
                reversed: {}
            }

        },

        created: function() {

            this.fetchData();

        },

        methods: {

            fetchData: function() {

                this.$http.get('/items', {}).done(function(response) {

                    this.columns = response.gridColumns
                    this.data = response.gridData
                    this.total = response.gridTotal
                    this.totalFiltered = response.gridFiltered

                    // initialize reverse state
                    this.columns.forEach(function (col) {
                        this.reversed.$add(col.name, false)
                    }, this)

                    UI.pagination(this.$$.pagination, {items: this.total, itemsOnPage: this.totalFiltered});

                })

            },

            sortBy: function (key) {
                this.sortKey = key
                this.reversed[key] = !this.reversed[key]
            }

        }

    };

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

            <tr v-repeat="entry: data | orderBy sortKey reversed[sortKey]">

                <td v-repeat="col: columns">

                    {{ entry[col.name] }}

                </td>

            </tr>

        </tbody>
    </table>

    <ul class="uk-pagination" v-el="pagination"></ul>

</template>