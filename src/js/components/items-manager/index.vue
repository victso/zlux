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

        <pagination v-if="total > itemsPerPage" items="{{ total }}" current-page="{{@ currentPage }}" items-on-page="{{ itemsPerPage }}" on-select-page="{{ changePage }}"></pagination>

    </div>

</template>

<script>

    var _ = require('zlux').util;

    module.exports = {

        props: {
            'onSelectItem': {
                type: Function
            },
            'onLoadPage': {
                type: Function
            },
            'filters': {
                type: Object
            }
        },

        data: function() {

            return {

                nav: {
                    search: ''
                },

                items       : [],
                columns     : [],
                itemsPerPage: 10,
                currentPage : 1,
                total       : 0,
                count       : 0,
                offset      : 0,
                orderKey    : '_itemname',
                reversed    : {},

                filters: {
                    name      : '',
                    apps      : [],
                    types     : [],
                    categories: [],
                    tags      : [],
                    authors   : []
                }

            };

        },

        compiled: function() {

            this.$watch('nav.search', function(value, oldValue) {

                if (oldValue === '') {
                    // on first time search reset pagination
                    this.$set('currentPage', 1);
                }

                this.search();
            });

        },

        computed: {

            order: function() {
                var order = [this.orderKey];

                if (this.reversed[this.orderKey]) {
                    order.push('_reversed');
                }

                return order;
            },

            filter: function() {
                return _.merge({}, this.filters, {
                    name: this.nav.search
                });
            }

        },

        methods: {

            fetch: function(params) {

                params = _.merge({
                    offset: this.currentPage * this.itemsPerPage,
                    limit : this.itemsPerPage,
                    order : this.order,
                    filter: this.filter
                }, (params || {}));

                this.$http.get('/items', params).done(function(response) {

                    this.columns = response.columns;
                    this.items = response.items;
                    this.total = response.total;
                    this.count = response.count;
                    this.offset = response.offset;

                    // execute callback
                    if (_.isFunction(this.onLoadPage)) {
                        this.onLoadPage();
                    }

                });

            },

            sortBy: function (key) {

                if (key) {

                    this.reversed[key] = !this.reversed[key];
                    this.fetch();

                }
            },

            search: function(e) {

                if (e) {
                    e.preventDefault();
                }

                this.fetch();
                this.searching = false;
            },

            clearSearch: function() {
                this.nav.$set('search', '');
                this.fetch();
                this.searching = false;
            },

            changePage: function(index) {
                this.currentPage = index;
                this.fetch();
            },

            itemSelected: function(item) {
                if (_.isFunction(this.onSelectItem)) {
                    this.onSelectItem(item);
                }
            }

        },

        components: {
            items: require('./items.vue')
        }

    };

</script>
