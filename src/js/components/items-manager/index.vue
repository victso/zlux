<script>

    var _ = require('../../util')

    module.exports = {

        replace: true,

        props: ['on-select-item', 'on-load-page', 'filters'],

        data:  function() {

            return {

                nav: {
                    search: ''
                },

                items           : [],
                columns         : [],
                itemsPerPage    : 10,
                currentPage     : 1,
                total           : 0,
                count           : 0,
                offset          : 0,
                orderKey        : '_itemname',
                reversed        : {},

                filters: {
                    name        : '',
                    apps        : [],
                    types       : [],
                    categories  : [],
                    tags        : [],
                    authors     : []
                }

            }

        },

        compiled: function() {

            this.$watch('nav.search', function(value, oldValue) {

                if (oldValue == '') {

                    // on first time search reset pagination
                    this.$set('currentPage', 0)

                }

                this.search()

            })

            this.$set('currentPage', this.currentPage - 1)

        },

        computed: {

            order: function() {

                var order = [this.orderKey]

                if (this.reversed[this.orderKey]) {
                    order.push('_reversed')
                }

                return order

            },

            filter: function() {

                return _.extend({}, this.filters, {
                    name: this.nav.search
                })

            }

        },

        methods: {

            fetchData: function(params) {

                params = _.extend({

                    offset : this.currentPage * this.itemsPerPage,
                    limit  : this.itemsPerPage,
                    order  : this.order,
                    filter : this.filter

                }, (params || {}))

                this.$http.get('/items', params).done(function(response) {

                    this.columns = response.columns
                    this.items   = response.items
                    this.total   = response.total
                    this.count   = response.count
                    this.offset  = response.offset

                    // execute callback
                    if (_.isFunction(this.onLoadPage)) {
                        this.onLoadPage()
                    }

                })

            },

            sortBy: function (key) {

                if (key) {

                    this.reversed[key] = !this.reversed[key]
                    this.fetchData()

                }

            },

            search: function(e) {

                e && e.preventDefault()
                this.fetchData()
                this.searching = false

            },

            clearSearch: function() {

                this.nav.$set('search', '')
                this.fetchData()
                this.searching = false

            },

            changePage: function(index) {

                this.currentPage = index
                this.fetchData()

            }

        },

        components: {

            items: require('./items.vue')

        }

    }

</script>

<template>

    <div class="zx-items-manager">

        <nav class="uk-navbar" v-el="nav">

            <form class="uk-form uk-margin-remove uk-display-inline-block uk-width-1-1" v-on="submit: search">

                <div class="uk-form-icon uk-width-1-1">
                    <i v-class="nav.search ? 'uk-icon-times' : 'uk-icon-search'" v-on="click: clearSearch"></i>
                    <input v-model="nav.search" class="uk-form-blank uk-width-1-1" debounce="500" type="search">
                </div>

            </form>

        </nav>

        <items v-ref="items"></items>

        <pagination v-if="total > itemsPerPage" items="{{ total }}" items-on-page="{{ itemsPerPage }}" on-select-page="{{ changePage }}"></pagination>

    </div>

</template>