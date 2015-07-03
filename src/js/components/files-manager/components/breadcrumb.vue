<template>

    <ul class="uk-breadcrumb">

        <li><a href="#" v-on="click: goTo('/')">{{ 'root' | trans }}</a></li>
        <li v-repeat="crumbs"><a href="#" v-on="click: goTo(path)">{{ name }}</a></li>
        <li v-if="active" class="uk-active"><span>{{ active }}</span></li>

    </ul>

</template>

<script>

    module.exports = {

        props: ['location', 'go-to'],

        computed: {

            parts: function() {

                return this.location.replace(/^[\/]|[\/]$/gm, '').split('/');

            },

            crumbs: function() {

                var crumbs = [], path = '/';

                this.parts.forEach(function(part) {

                    if (part === '') {
                        return true;
                    }

                    crumbs.push({
                        'name': part,
                        'path': path += part + '/'
                    });

                });

                crumbs.pop();

                return crumbs;

            },

            active: function() {

                return this.parts.pop();

            }

        }

    };

</script>
