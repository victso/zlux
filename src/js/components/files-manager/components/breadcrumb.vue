<template>

    <ul class="uk-breadcrumb">
        <li><a href="#" v-on="click: goTo('/')">{{ 'root' | trans }}</a></li>
        <li v-repeat="crumbs"><a href="#" v-on="click: goTo(location)">{{ name }}</a></li>
        <li v-if="active" class="uk-active"><span>{{ active.name }}</span></li>
    </ul>

</template>

<script>

    module.exports = {

        props: ['location', 'go-to'],

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

                // set active
                this.$set('active', crumbs.pop());

                return crumbs;

            }

        }

    };

</script>
