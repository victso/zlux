<script>

    var UI = require('uikit')

    module.exports = {

        replace: true,

        props: ['on-select-item', 'on-load-page', 'filter'],

        data:  function() {

            return {

                nav: [
                    {title: 'Filter'}
                ],

                items: [],
                itemsPerPage: 10,
                currentPage: 1,
                total: 0,
                count: 0,
                offset: 0,
                columns: [],
                orderKey: '_itemname',
                reversed: {},

                filter: {
                    apps: '',
                    types: '',
                    categories: '',
                    tags: '',
                    authors: ''
                }

            }

        },

        ready: function() {

            // console.log(this.$data);
            // this.$log()

            UI.$('a[href="#"]', this.$el).on('click', function(e) {

                e.preventDefault();

            })

        },

        components: {

            items: require('./items.vue')

        }

    }

</script>

<template>

    <div class="zx-items-manager">

        <nav class="uk-navbar">
            <div class="uk-navbar-flip">
                <div class="uk-navbar-content">
                    <form class="uk-form uk-margin-remove uk-display-inline-block">
                        <input class="uk-search-field" type="search" placeholder="filter...">
                    </form>
                </div>
            </div>
        </nav>

        <items v-ref="items"></items>

    </div>

</template>