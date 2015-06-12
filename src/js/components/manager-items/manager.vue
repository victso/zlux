<script>

    var UI = require('uikit');

    module.exports = {

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

            });

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
        <ul class="uk-navbar-nav">

            <li class="uk-parent uk-active" v-repeat="item: nav">
                <a href="#"> {{ item.title }}</a>
            </li>

        </ul>
    </nav>

    <div v-component="items"></div>

</template>