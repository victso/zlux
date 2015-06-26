<script>

    var _ = require('../../util')
    var $ = require('jquery')

    module.exports = {

        replace: true,

        data:  function() {

            return {
                root:        '',
                resources:   [],
                cache:       {},
                currentRoot: '',
                currentView: 'resources',

                nav: [
                    {title: 'Files', view: 'files'},
                    {title: 'Uploader', view: 'uploader'}
                ]
            }

        },

        ready: function() {

            $('a[href="#"]', this.$el).on('click', function(e) {

                e.preventDefault();

            })

        },

        methods: {

            changeView: function(view) {

                this.currentView = view

            },

            goTo: function(path) {

                this.root = path
                this.fetch()

            },

            fetch: function(params) {

                // if (this.cache[this.currentPath]) {

                //     this.root  = path;
                //     this.files = this.cache[path];
                //     return;

                // }

                params = _.extend({

                    path : this.root

                }, (params || {}))

                console.log(params);

                this.$http.get('/files', params).done(function(response) {

                    this.root      = response.root;
                    this.resources = response.resources;

                    this.cache[this.root] = response;

                    // execute callback
                    if (_.isFunction(this.onLoadPage)) {
                        this.onLoadPage()
                    }

                })

            },

            init: function() {

                if (!this.resources.length) {
                    this.fetch()
                }

            }

        },

        components: {

            resources : require('./components/resources.vue'),
            uploader  : require('./components/uploader.vue')

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