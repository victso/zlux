<script>

    var UI = require('uikit');

    module.exports = {

        replace: true,

        props: ['on-select-item', 'on-load-page'],

        data:  function() {

            return {

                nav: [
                    {title: 'Filter'}
                ]

            }

        },

        computed: {

            items: function() {

                return this.$.items.items

            }

        },

        ready: function() {

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