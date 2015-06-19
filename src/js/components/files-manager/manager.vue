<script>

    var UI = require('uikit');

    module.exports = {

        data:  {

            currentView: 'files',

            nav: [
                {title: 'Files', view: 'files'},
                {title: 'Uploader', view: 'uploader'}
            ]

        },

        ready: function() {

            UI.$('a[href="#"]', this.$el).on('click', function(e) {

                e.preventDefault();

            });

        },

        methods: {

            changeView: function(view) {

                this.currentView = view;

            }

        },

        components: {

            files: require('./files.vue'),
            uploader: require('./uploader.vue')

        }

    };

</script>

<template>

    <div class="zx-files-manager">

        <nav class="uk-navbar">
            <ul class="uk-navbar-nav">

                <li class="uk-parent uk-active" v-repeat="item: nav">

                    <a href="#" v-on="click: changeView(item.view)"> {{ item.title }}</a>

                </li>

            </ul>
        </nav>

        <component is="{{ currentView }}"></component>

    </div>

</template>