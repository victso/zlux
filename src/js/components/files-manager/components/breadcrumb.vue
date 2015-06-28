<script>

    module.exports = {

        replace: true,
        props  : ['root'],

        computed: {

            crumbs: function() {

                var parts = this.root.replace(/^[\/]|[\/]$/gm, '').split('/'), crumbs = [];

                if (parts.length > 1) {

                    var path = '/';

                    parts.forEach(function(part) {

                        crumbs.push({
                            'name': part,
                            'path': path += part + '/'
                        });

                    });

                } else {
                    this.root = '/';
                }

                crumbs.unshift({
                    'name': 'root',
                    'path': '/'
                });

                return crumbs;

            }

        }

    };

</script>

<template>

    <ul class="uk-breadcrumb">

        <li v-repeat="crumbs">

            <a href="#" v-if="path !== root" v-on="click: $parent.$parent.goTo(path)">
                {{ name }}
            </a>

            <span v-if="path === root" class="uk-active">
                {{ name }}
            </span>

        </li>

    </ul>

</template>
