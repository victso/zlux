<script>

    var UI = require('uikit');

    module.exports = {

        replace: true,

        data:  function() {

            return {

                nav: [
                    {title: 'Filter'}
                ]

            }

        },

        ready: function() {

            UI.$('a[href="#"]', this.$el).on('click', function(e) {

                e.preventDefault();

            })

        },

        methods: {

        },

        components: {

            items: require('./items.vue'),

        }

    };

</script>

<template>

    <nav class="uk-navbar">
        <div class="uk-navbar-flip">
            <div class="uk-navbar-content">
                <form class="uk-form uk-margin-remove uk-display-inline-block">
                    <input class="uk-search-field" type="search" placeholder="filter...">
                </form>
            </div>
        </div>
    </nav>

    <items></items>

</template>