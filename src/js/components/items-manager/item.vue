<template>

    <tr v-on="click: selectItem" v-class="uk-active: active">

        <td v-repeat="col: columns">
            {{ col.name | property }}
        </td>

    </tr>

</template>

<script>

    module.exports = {

        props: {
            'onSelect': {
                type: Function
            },
            'columns': {
                type: Array,
                required: true
            }
        },

        data: function() {

            return {
                id     : '',
                name   : '',
                type   : '',
                access : '',
                active : false,
                created: '',

                application: {
                    id  : '',
                    name: ''
                },
                author: {
                    id  : '',
                    name: ''
                }
            };

        },

        filters: {

            property: function(key) {
                return this.$parent.$data[key];
            }

        },

        methods: {

            selectItem: function() {
                if (this.onSelect) {
                    this.onSelect(this);
                }
            }

        }

    };

</script>
