<template>

    <ul class="uk-breadcrumb">
        <li><a href="" v-on="click: select(this, '/')">{{ 'root' | trans }}</a></li>
        <li v-repeat="crumbs"><a href="" v-on="click: select(this, location)">{{ name }}</a></li>
        <li v-if="active" class="uk-active"><span>{{ active.name }}</span></li>
    </ul>

</template>

<script>

    module.exports = {

        props: ['location', 'goTo'],

        data: function () {

            return {
                active: null
            };

        },

        computed: {

            crumbs: function() {

                var crumbs = [], location = '';

                this.location.replace(/^[\/]|[\/]$/gm, '').split('/').forEach(function(crumb) {

                    if (crumb === '') {
                        return true;
                    }

                    crumbs.push({
                        'name': crumb,
                        'location': location += '/' + crumb
                    });

                });

                this.$set('active', crumbs.pop());

                return crumbs;

            }

        },

        methods: {

            select: function(crumb, location) {
                crumb.$event.preventDefault();
                this.goTo(location);
            }

        }

    };

</script>
